import { CODE } from '@Codes';
import { QueryOperation, PKInfo } from '@types';
import { QueryRequest, QueryResponse, LogType, Map } from '@types';
import { Row, DMLRequest, DMLResponse, Status } from '@types';
import Utils from '@Utils';
import DatabaseManager from '@DatabaseManager';
import logger from '@logger';
import Table from '@Table';
import * as constants from '@constants';
import uuid from 'uuid';

export default class APIManager {
  private static instance: APIManager;
  private db: DatabaseManager;

  public static getInstance(): APIManager {
    if (!this.instance) {
      this.instance = new APIManager();
    }
    return this.instance;
  }

  constructor() {
    this.db = DatabaseManager.getInstance();
  }

  /* **************************************
  | | | | | | | Query API  |  | | | | | |  |
   **************************************** */
  public async executeQuery(
    queryRequest: QueryRequest
  ): Promise<QueryResponse> {
    let instance = Utils.getInstanceOf(queryRequest.alias);
    if (instance) {
      Utils.queryUpdateOf(queryRequest, instance);
    }
    const start = new Date().getTime();
    logger.log(LogType.INFO, constants.MSG_QUERY_START + queryRequest.userInfo);
    logger.log(LogType.INFO, 'Request Params:', queryRequest);
    const response: QueryResponse = Utils.getInitialQueryResponse(queryRequest);
    let error;
    if (instance && typeof instance.beforeInsert === 'function') {
      await instance.beforeQuery(queryRequest).catch(err => {
        error = err;
      });
      if (error) {
        return this.resolveError(CODE.ERR_BEFORE_QUERY, error, response);
      }
    }
    let sql = queryRequest.customSql;
    if (!sql) {
      try {
        sql = await Utils.parseQueryParams(queryRequest);
      } catch (err) {
        error = err;
      }
    }
    if (error || !sql) {
      return this.resolveError(CODE.ERR_BEFORE_QUERY, error, response);
    }
    response.sql = sql;
    logger.log(LogType.INFO, sql);
    const params = queryRequest.whereClauseParams;
    let rows: Row[] = [];
    if (instance) {
      rows = instance.rows;
    }
    if (!(instance && instance.skipQuery)) {
      try {
        rows = <Row[]>(
          await this.db.executeQuery(QueryOperation.QUERY, sql, params)
        );
      } catch (error) {
        return this.resolveError(CODE.ERR_WHILE_QUERY, error, response);
      }
    }
    response.rows = rows;
    if (instance) {
      instance.rows = rows;
      instance.toatalRows = rows.length;
    }
    if (instance && typeof instance.afterQuery === 'function') {
      await instance.afterQuery(response.rows).catch(err => {
        error = err;
      });
    }
    if (error) {
      return this.resolveError(CODE.ERR_AFTER_QUERY, error, response);
    }
    response.status = Status.SUCCESS;
    response.wire = (new Date().getTime() - start) / 1000;
    response.table = response.table;
    if (response.rows && response.rows.length > 0) {
      response.rows.forEach((row: Row) => {
        row.$status$ = Status.SUCCESS;
        row.$operation$ = QueryOperation.QUERY;
      });
    }
    Utils.logSQLResponse(response);
    return Promise.resolve(response);
  }

  /* **************************************
              | Insert/Update/Delere API  |
   **************************************** */
  public async executeUpdate(dMLRequest: DMLRequest): Promise<DMLResponse> {
    let instance: Table | void = Utils.getInstanceOf(dMLRequest.alias);
    if (instance) {
      Utils.dMLUpdateOf(dMLRequest, instance);
    }
    let pkInfo: PKInfo | void;
    try {
      pkInfo = await Utils.getPrimaryKeyInfo(dMLRequest.table);
    } catch (error) {
      logger.log(LogType.ERROR, error);
    }
    const dMLResponse: DMLResponse = Utils.getInitialDMLResponse(dMLRequest);
    dMLResponse.rows = [];
    let index: number = 0;
    const start = new Date().getTime();
    logger.log(
      LogType.INFO,
      constants.MSG_DML_START + dMLRequest.userInfo.userId
    );
    logger.log(LogType.INFO, 'Request Params:', dMLRequest);
    for (const row of dMLRequest.rows) {
      await this._executeUpdate(dMLRequest, row, instance, pkInfo, index);
      dMLResponse.rows.push(row);
      index++;
    }
    dMLResponse.wire = (new Date().getTime() - start) / 1000;
    Utils.logSQLResponse2(dMLResponse);
    return Promise.resolve(dMLResponse);
  }

  private doEmailActions(
    table: string,
    event: string,
    operation: QueryOperation,
    row: Row
  ) {
    const action = event + '_' + operation;
    table = Utils.inverseCamelCase(table);
    Utils.queryEmailAction(table, action).then(res => {
      if (res) {
        const emailAction: Row = res;
        const condition = emailAction.condition;
        if (condition) {
          var jexl = require('jexl');
          try {
            jexl.eval(condition, row, function(err: any, res: any) {
              if (err) {
                logger.log(LogType.ERROR, 'Exception while email action', res);
              } else if (typeof res == typeof true) {
                Utils.performEmailAction(emailAction, row);
              }
            });
          } catch (error) {
            logger.log(LogType.ERROR, 'Exception while email action', res);
          }
        } else {
          Utils.performEmailAction(emailAction, row);
        }
      }
    });
  }

  private async _executeUpdate(
    dMLRequest: DMLRequest,
    row: Row,
    instance: Table | void,
    pkInfo: PKInfo | void,
    index: number
  ): Promise<Row> {
    const operation: QueryOperation = row.$operation$ || QueryOperation.INVALID;
    if (!this.isDMLOperation(operation)) {
      const msg = constants.ERR_INVLD_OPTION + operation;
      return this.resolveError2(CODE.INVALID_DML_OPERATION, msg, row);
    }
    if (operation === QueryOperation.QUERY) {
      const msg = constants.ERR_CANT_QUERY;
      return this.resolveError2(CODE.QUERY_NOT_ALLOWED, msg, row);
    }
    if (!pkInfo) {
      return this.resolveError2(CODE.NO_PK_DEF, constants.ERR_NO_PK_DEF, row);
    }
    if (
      operation === QueryOperation.UPDATE ||
      operation === QueryOperation.DELETE
    ) {
      if (!row.hasOwnProperty(pkInfo.key)) {
        const msg = constants.ERR_NO_PK_DEF;
        return this.resolveError2(CODE.NO_PK_DATA, msg, row);
      }
      if (!this.isAuditsPresent(row)) {
        const err = constants.ERR_MISSING_AUDIT_COLUMNS + operation;
        return this.resolveError2(CODE.NO_AUDIT_COLUMNS, err, row);
      }
    }
    let error;
    await this.callBeforeDML(operation, row, instance, index).catch(err => {
      error = err;
    });
    if (error) {
      return this.resolveError2(CODE.ERR_BERORE_DML, error, row);
    }
    let result;
    this.fillServerSideData(operation, row, dMLRequest, pkInfo);
    this.doEmailActions(dMLRequest.table, 'before', operation, row);
    try {
      result = await this.dbExecute(
        operation,
        dMLRequest.table,
        row,
        instance,
        pkInfo
      );
    } catch (error) {
      const _err = constants.ERR_WHIL_DML(operation) + error;
      return this.resolveError2(CODE.ERR_WHILE_DML, _err, row);
    }
    if (result) {
      row = result;
    }
    await this.callAfterDML(operation, row, instance, index).catch(err => {
      error = err;
    });
    if (error) {
      return this.resolveError2(CODE.ERR_AFTER_DML, error, row);
    }
    this.doEmailActions(dMLRequest.table, 'after', operation, row);
    row.$status$ = Status.SUCCESS;
    row.$message$ = undefined;
    return Promise.resolve(row);
  }

  private async dbExecute(
    operation: QueryOperation,
    table: string,
    row: Row,
    instance: Table | void,
    pkInfo: PKInfo
  ): Promise<Row | void> {
    let map: Map = {};
    if (
      operation === QueryOperation.INSERT &&
      !(instance && instance.skipInsert)
    ) {
      map = Utils.parseInsertParams(table, row);
    } else if (
      operation === QueryOperation.UPDATE &&
      pkInfo &&
      !(instance && instance.skipInsert)
    ) {
      map = Utils.parseUpdateParams(table, row, pkInfo);
    } else if (
      operation === QueryOperation.DELETE &&
      pkInfo &&
      !(instance && instance.skipInsert)
    ) {
      map = Utils.parseDeleteParams(table, row, pkInfo);
    }
    let result: Row[];
    try {
      logger.log(LogType.INFO, 'Executing" ' + map.sql, map.params);
      result = <Row[]>(
        await this.db.executeQuery(operation, map.sql, map.params, row, pkInfo)
      );
    } catch (err) {
      return Promise.reject(err);
    }
    if (result && result.length > 0) {
      return Promise.resolve(result[0]);
    }
    return Promise.resolve();
  }

  private async callBeforeDML(
    operation: QueryOperation,
    row: Row,
    instance: Table | void,
    index: number
  ) {
    return new Promise((resolve, reject) => {
      if (instance) {
        instance.rowIndex = index;
        if (
          operation === QueryOperation.INSERT &&
          typeof instance.beforeInsert === 'function'
        ) {
          instance.beforeInsert(row).then(() => {
            return resolve();
          });
        } else if (
          operation === QueryOperation.UPDATE &&
          typeof instance.beforeUpdate === 'function'
        ) {
          try {
            instance
              .beforeUpdate(row)
              .then(() => {
                return resolve();
              })
              .catch(error => {
                return reject(error);
              });
          } catch (error) {
            return reject(error);
          }
        } else if (
          operation === QueryOperation.DELETE &&
          typeof instance.beforeDelete === 'function'
        ) {
          instance.beforeDelete(row).then(() => {
            return resolve();
          });
        }
      } else {
        return resolve();
      }
    });
  }

  private async callAfterDML(
    operation: QueryOperation,
    row: Row,
    instance: Table | void,
    index: number
  ) {
    return new Promise((resolve, reject) => {
      if (instance) {
        instance.rowIndex = index;
        if (
          operation === QueryOperation.INSERT &&
          typeof instance.afterInsert === 'function'
        ) {
          instance.afterInsert(row).then(() => {
            return resolve();
          });
        } else if (
          operation === QueryOperation.UPDATE &&
          typeof instance.afterUpdate === 'function'
        ) {
          instance.afterUpdate(row).then(() => {
            return resolve();
          });
        } else if (
          operation === QueryOperation.DELETE &&
          typeof instance.afterDelete === 'function'
        ) {
          instance.afterDelete(row).then(() => {
            return resolve();
          });
        }
      } else {
        return resolve();
      }
    });
  }

  private resolveError(code: CODE, error: any, response: QueryResponse) {
    response.status = Status.ERROR;
    response.responseCode = code;
    response.table = <string>Utils.toCamelCase(response.table);
    response.message = error + '';
    return Promise.resolve(response);
  }

  private resolveError2(code: CODE, error: any, row: Row, params?: any) {
    row.$status$ = Status.ERROR;
    row.$code$ = code;
    row.$message$ = error + '';
    //logger.log(LogType.ERROR, row.message, params);
    return Promise.resolve(row);
  }

  private isAuditsPresent(row: Row) {
    return (
      !row.create_date ||
      !row.create_user_id ||
      !row.update_date ||
      !row.update_user_id
    );
  }
  private fillServerSideData(
    operation: QueryOperation,
    row: Row,
    request: DMLRequest,
    pkInfo: PKInfo
  ) {
    if (operation == QueryOperation.INSERT) {
      row.createUserId = request.userInfo.userId;
      row.createDate = new Date();
      if (pkInfo && pkInfo.type === 'string' && !pkInfo.autoIncrement) {
        row[pkInfo.key] = uuid();
      }
    } else {
      delete row['createDate'];
    }
    row.updateDate = new Date();
    row.updateUserId = request.userInfo.userId;
  }

  private isDMLOperation(operation: QueryOperation) {
    return (
      operation &&
      (operation === QueryOperation.INSERT ||
        operation === QueryOperation.DELETE ||
        operation === QueryOperation.UPDATE ||
        operation === QueryOperation.QUERY)
    );
  }
}
