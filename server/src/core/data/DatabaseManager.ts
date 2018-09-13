import Utils from '@Utils';
import logger from '@logger';
import { LogType, Row, QueryOperation, PKInfo, Map } from '@types';
import mysql, { Pool, MysqlError, PoolConnection, FieldInfo } from 'mysql';
import * as constants from '@constants';

export default class DatabaseManager {
  pool: Pool;
  static instance: DatabaseManager;

  constructor() {
    this.pool = this.getPool();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DatabaseManager();
    }
    return this.instance;
  }

  private getPool() {
    const props = Utils.getProps();
    const db = props.db;
    if (!props || !db) {
      logger.log(
        LogType.ERROR,
        'Invalid .properties, DB details are not found!'
      );
      throw new Error('Invalid .properties, DB details are not found!');
    }
    let connectionLimit = 10;
    if (db.connectionPoolLimit) connectionLimit = db.connectionPoolLimit;
    logger.log(
      LogType.INFO,
      'Database pool is initialized with connection limit of ' + connectionLimit
    );
    return mysql.createPool({
      connectionLimit,
      host: db.host,
      user: db.user,
      port: db.port,
      password: db.password,
      database: db.name
    });
  }

  private connect(): Promise<PoolConnection> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err: MysqlError, connection: PoolConnection) => {
        if (err) {
          if (connection) connection.release();
          return reject(err);
        }
        connection.on('error', err => {
          return reject(err);
        });
        return resolve(connection);
      });
    });
  }

  public executeQuery(
    operation: QueryOperation,
    sql: string,
    params?: any[],
    row?: Row,
    pkInfo?: PKInfo
  ): Promise<Map[]> {
    return new Promise((resolve, reject) => {
      this.connect()
        .then(
          conn => {
            if (conn) {
              conn.query(
                sql,
                params,
                (
                  err: MysqlError | null,
                  results?: any,
                  fields?: FieldInfo[]
                ) => {
                  conn.release();
                  if (err) {
                    logger.log(LogType.ERROR, err + '');
                    return reject(err);
                  }
                  if (operation === QueryOperation.QUERY) {
                    return resolve(<Map[]>Utils.toCamelCase(results));
                  } else {
                    if (operation === QueryOperation.INSERT && row && pkInfo) {
                      row[pkInfo.key] = results.insertId;
                    }
                    const rows: Map[] = [];
                    if (row) {
                      rows.push(row);
                    }
                    return resolve(rows);
                  }
                }
              );
            } else {
              logger.log(LogType.ERROR, constants.ERROR_MSG_SYSTEM_DOWN);
              return reject(constants.ERROR_MSG_SYSTEM_DOWN);
            }
          },
          (err: MysqlError) => {
            logger.log(LogType.ERROR, err + '');
            return reject(constants.ERROR_MSG_ERROR_CONN_DB);
          }
        )
        .catch(error => {
          logger.log(LogType.ERROR, error + '');
          return reject(constants.ERROR_MSG_ERROR_CONN_DB);
        });
    });
  }
}
