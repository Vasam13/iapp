import { EmailProps, Users } from './../data/types';
import { CODE } from '@Codes';
import { UserInfo, Map, Properties, HttpRequestParams } from '@types';
import PropertiesReader from 'properties-reader';
import { QueryRequest, DMLResponse, QueryOperation, Response } from '@types';
import { Row, LogType, Status } from '@types';
import { QueryResponse, DMLRequest, PKInfo } from '@types';
import { Store } from '../../app_scripts/Store';
import Table from '@Table';
import logger from '@logger';
import DatabaseManager from '@DatabaseManager';
import bcrypt from 'bcrypt';
import fs from 'fs';
import util from 'util';
import TextUtils from './TextUtils';
import * as jwt from 'jsonwebtoken';
import path from 'path';
import nodemailer from 'nodemailer';
import UsersType from 'app_scripts/tables/types/UsersType';

export default class Utils {
  static cachedProperties: Properties;
  static cachedUsers: UsersType[];

  static getUserById = (userId: number): Promise<UsersType> => {
    return new Promise((resolve, reject) => {
      Utils.getUsers()
        .then(users => {
          for (var i = 0; i < users.length; i++) {
            if (users[i].userId === userId) {
              return resolve(users[i]);
            }
          }
          resolve();
        })
        .catch(err => reject(err));
    });
  };

  static getUsers = (): Promise<UsersType[]> => {
    return new Promise((resolve, reject) => {
      if (Utils.cachedUsers) {
        resolve(Utils.cachedUsers);
      } else {
        Utils.queryUsers()
          .then(rows => {
            Utils.cachedUsers = <UsersType[]>rows;
            resolve(Utils.cachedUsers);
          })
          .catch(err => reject(err));
      }
    });
  };
  static getProps = (): Properties => {
    if (!Utils.cachedProperties) {
      const reader = PropertiesReader('./../.properties');
      Utils.cachedProperties = <any>reader.path();
      logger.log(LogType.INFO, 'Properties are cached');
      logger.log(LogType.INFO, 'Properties: ', Utils.cachedProperties);
    }
    return Utils.cachedProperties;
  };

  static getEnvironment = (): string => {
    let env = 'dev';
    const props = Utils.cachedProperties;
    if (props && props.env) {
      env = props.env;
    }
    return env;
  };

  static getAssetsPath() {
    return '/assets/';
  }

  static getAssetsRelativePath() {
    let dirPath;
    const serverPath = this.getAssetsPath();
    if (Utils.getEnvironment() === 'prod') {
      dirPath = path.join(__dirname, '/../../../public/', serverPath);
    } else {
      dirPath = path.join(__dirname, '/../../../../client/src/', serverPath);
    }
    return dirPath;
  }

  static getInstanceOf(className: string): Table | void {
    className = className.toLowerCase();
    if (Store[className]) {
      return new Store[className]();
    }
  }

  static parseString(str: string, row: Row) {
    Object.keys(row).forEach(key => {
      const occur = '#{s*' + key + 's*}';
      str.replace(new RegExp(occur, 'g'), row[key]);
    });
    return str;
  }

  static performEmailAction(emailAction: Map, row: Row) {
    let subject = emailAction.subject;
    subject = Utils.parseString(subject, row);
    let body = emailAction.body;
    body = Utils.parseString(body, row);
    let toList: string[] = [],
      ccList: string[] = [];
    if (emailAction.toEmails) {
      toList = (<string>emailAction.toEmails).split('$');
    }
    if (emailAction.ccEmails) {
      ccList = (<string>emailAction.ccEmails).split('$');
    }
    if (toList && toList.length > 0) {
      Utils.sendEmail(toList, ccList, subject, body);
    }
  }

  static async queryEmailAction(
    table: string,
    event: string
  ): Promise<Row | void> {
    const sql: string =
      'SELECT * FROM EMAIL_ACTIONS WHERE lower(DATASOURCE) = ? AND EVENT = ? AND ACTIVE = ?';
    try {
      const rows: Row[] = <Row[]>(
        await DatabaseManager.getInstance().executeQuery(
          QueryOperation.QUERY,
          sql,
          [table.toLowerCase(), event, 'Y']
        )
      );
      if (rows && rows.length > 0) {
        return rows[0];
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  static queryUserByName(userName: string): Promise<Row | void> {
    return new Promise(async (resolve, reject) => {
      const sql: string = Utils.getUserSelectClause() + ' WHERE USER_NAME = ? ';
      try {
        const rows: Row[] = <Row[]>(
          await DatabaseManager.getInstance().executeQuery(
            QueryOperation.QUERY,
            sql,
            [userName]
          )
        );
        if (rows && rows.length > 0) {
          return resolve(rows[0]);
        }else {
          return resolve();
        }
      } catch (error) {
        return reject(error);
      }
    });
  }

  static queryUserRoles(userId: number): Promise<Row[]> {
    return new Promise(resolve => {
      const sql: string =
        'SELECT * FROM ROLES WHERE ROLE_ID IN (SELECT ROLE_ID FROM' +
        ' USER_ROLES WHERE USER_ID = ?)';
      try {
        DatabaseManager.getInstance()
          .executeQuery(QueryOperation.QUERY, sql, [userId])
          .then(res => {
            resolve(<Row[]>res);
          });
      } catch (error) {
        return Promise.reject(error);
      }
    });
  }

  static async fillUserInfo(userInfo: Map) {
    const roles: Row[] = await Utils.queryUserRoles(userInfo.userId);
    userInfo.roles = roles;
    return Promise.resolve(userInfo);
  }

  static getInitialUserInfo(): UserInfo {
    return {
      userId: -1,
      userName: '',
      displayName: '',
      emailAddress: '',
      avatarUrl: '',
      sessionId: ''
    };
  }
  static getUserSelectClause() {
    return 'select user_id, user_name, display_Name, email_address,password_Changed, password_hash from users';
  }
  static async queryUsers(): Promise<Row[] | void> {
    const sql: string =
      Utils.getUserSelectClause() + ' where deleted is null or deleted <> ?';
    try {
      const rows: Row[] = <Row[]>(
        await DatabaseManager.getInstance().executeQuery(
          QueryOperation.QUERY,
          sql,
          ['Y']
        )
      );
      return rows;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  static queryUser(userId: number): Promise<Row | void> {
    return new Promise(async (resolve, reject) => {
      const sql: string = Utils.getUserSelectClause() + ' WHERE USER_ID = ? ';
      let rows: Row[];
      try {
        rows = <Row[]>(
          await DatabaseManager.getInstance().executeQuery(
            QueryOperation.QUERY,
            sql,
            [userId]
          )
        );
      } catch (err) {
        return reject(err);
      }
      if (rows && rows.length > 0) {
        return resolve(rows[0]);
      }
    });
  }

  static dMLUpdateOf(dMLRequest: DMLRequest, instance: Table) {
    instance.actionParams = dMLRequest.actionParams;
    instance.table = dMLRequest.table;
    instance.alias = dMLRequest.alias;
    instance.userId = dMLRequest.userInfo.userId;
    instance.rows = dMLRequest.rows;
    instance.toatalRows = dMLRequest.rows.length;
  }

  static queryUpdateOf(queryRequest: QueryRequest, instance: Table) {
    instance.actionParams = queryRequest.actionParams;
    instance.table = queryRequest.table;
    instance.alias = queryRequest.alias;
    instance.userId = queryRequest.userInfo.userId;
  }

  static getReservedWords = (): string[] => {
    return ['$status$', '$message$', '$operation$', '$id$', '$actionParams$'];
  };

  static isReservedWord = (str: string): boolean => {
    return str.startsWith('$') && str.endsWith('$');
    // return !(Utils.getReservedWords().indexOf(str) === -1);
  };
  static _toCamelCase(str: string) {
    if (Utils.isReservedWord(str)) {
      return str;
    }
    str = str.substring(0, 1).toLowerCase() + str.substring(1);
    return str.replace(/_([a-z])/gi, function($0, $1) {
      return $1.toUpperCase();
    });
  }
  static toCamelCase(str: string | Row[]): string | Row[] {
    if (str instanceof Array) {
      const _rows: Row[] = [];
      (<Array<Row>>str).forEach((row: Row) => {
        const _row: Row = {
          $status$: row.$status$,
          $operation$: row.$operation$
        };
        Object.keys(row).forEach(key => {
          const _key: string = Utils._toCamelCase(key);
          _row[_key] = row[key];
        });
        _rows.push(_row);
      });
      return _rows;
    }
    return Utils._toCamelCase(str);
  }

  static inverseCamelCase(str: string): string {
    if (str.indexOf('_') > -1) return str;
    str = str.replace(/([a-z][A-Z])/g, function(g) {
      return g[0] + '_' + g[1].toLowerCase();
    });
    return str.replace(/([0-9][A-Z])/g, function(g) {
      return g[0] + '_' + g[1].toLowerCase();
    });
  }

  static getQueryRequest(bodyParams: Map): QueryRequest {
    const queryRequest: QueryRequest = {
      table: bodyParams.table,
      alias: bodyParams.alias,
      actionParams: bodyParams.actionParams,
      selectParams: bodyParams.selectParams,
      whereClause: bodyParams.whereClause,
      whereClauseParams: bodyParams.whereClauseParams,
      orderByClause: bodyParams.orderByClause,
      limit: bodyParams.limit,
      offset: bodyParams.offset,
      userInfo: bodyParams.userInfo
    };
    return queryRequest;
  }

  static getDMLRequest(bodyParams: Map): DMLRequest {
    if (bodyParams.rows && bodyParams.rows.length > 0) {
      bodyParams.rows.forEach((row: any) => {
        row.$operation$ = Utils.getQueryOperation(row);
      });
    }
    const dmlRequest: DMLRequest = {
      table: bodyParams.table,
      alias: bodyParams.alias,
      actionParams: bodyParams.actionParams,
      rows: bodyParams.rows,
      userInfo: bodyParams.userInfo
    };
    return dmlRequest;
  }

  static getInitialQueryResponse(queryRequest: QueryRequest): QueryResponse {
    return {
      status: Status.ERROR,
      responseCode: CODE.INVALID_API_OPERATION,
      table: queryRequest.table,
      alias: queryRequest.alias,
      rows: [],
      sql: '',
      params: [],
      wire: 0
    };
  }

  static getInitialDMLResponse(dMLRequest: DMLRequest): DMLResponse {
    return {
      table: dMLRequest.table,
      alias: dMLRequest.alias,
      wire: 0
    };
  }

  static parseInsertParams(table: string, row: Row): Map {
    let sql = 'INSERT INTO ' + Utils.inverseCamelCase(table) + ' (';
    let values = ' values (';
    const params = [];
    for (const key in row) {
      if (Utils.isReservedWord(key)) continue;
      if (row.hasOwnProperty(key)) {
        sql += '`' + Utils.inverseCamelCase(key) + '`,';
        values += '?,';
        params.push(row[key]);
      }
    }
    if (sql.endsWith(',')) {
      sql = sql.substr(0, sql.length - 1);
    }
    if (values.endsWith(',')) {
      values = values.substr(0, values.length - 1);
    }
    sql += ')' + values + ') ';
    return { sql, params };
  }

  static parseUpdateParams(table: string, row: Row, pkInfo: PKInfo): Map {
    let sql = 'UPDATE ' + Utils.inverseCamelCase(table) + ' SET ';
    const params = [];
    for (const key in row) {
      if (Utils.isReservedWord(key)) continue;
      if (row.hasOwnProperty(key)) {
        sql += '`' + Utils.inverseCamelCase(key) + '`=?,';
        params.push(row[key]);
      }
    }
    if (sql.endsWith(',')) {
      sql = sql.substr(0, sql.length - 1);
    }
    sql += ' WHERE ' + Utils.inverseCamelCase(pkInfo.key) + ' = ?';
    params.push(row[pkInfo.key]);
    return { sql, params };
  }

  static parseDeleteParams(table: string, row: Row, pkInfo: PKInfo): Map {
    let sql = 'DELETE FROM ' + Utils.inverseCamelCase(table);
    const params = [];
    sql += ' WHERE ' + Utils.inverseCamelCase(pkInfo.key) + ' = ?';
    params.push(row[pkInfo.key]);
    return { sql, params };
  }

  static async getPrimaryKeyInfo(table: string): Promise<PKInfo | void> {
    const db = DatabaseManager.getInstance();
    const sql: string = 'SHOW COLUMNS FROM ' + Utils.inverseCamelCase(table);
    const rows: Row[] = <Row[]>await db.executeQuery(QueryOperation.QUERY, sql);
    let key = undefined;
    let type: string = '';
    let autoIncrement: boolean = false;
    rows.forEach(row => {
      if (row.key && row.key.toLowerCase() === 'pri') {
        key = <string>Utils.toCamelCase(row.field);
        type = row.type;
        if (type.indexOf('int') > -1) {
          type = 'number';
        } else if (type.indexOf('date') > -1) {
          type = 'Date';
        } else {
          type = 'string';
        }
        if (row.extra && row.extra.toLowerCase() === 'auto_increment') {
          autoIncrement = true;
        }
      }
    });
    if (key) {
      return Promise.resolve({
        key,
        type,
        autoIncrement
      });
    } else {
      return Promise.resolve();
    }
  }

  static parseQueryParams(queryParams: QueryRequest): Promise<string> {
    return new Promise(async (resolve, reject) => {
      let columns: Map = {};
      try {
        columns = await Utils.getTableColmns(queryParams.table);
      } catch (err) {
        return reject(err);
      }
      let sql = 'SELECT ';
      if (queryParams.selectParams) {
        queryParams.selectParams.forEach(param => {
          sql += '`' + Utils.inverseCamelCase(param) + '`,';
        });
      } else {
        Object.keys(columns).forEach((key: string) => {
          if (columns[key] !== 'blob') {
            sql += '`' + Utils.inverseCamelCase(key) + '`,';
          }
        });
      }
      if (sql.endsWith(',')) {
        sql = sql.substring(0, sql.length - 1);
      }
      sql += ' FROM ' + Utils.inverseCamelCase(queryParams.table);
      if (queryParams.whereClause) {
        sql += ' WHERE ' + queryParams.whereClause;
      }
      if (queryParams.orderByClause) {
        sql += ' ORDER BY ' + queryParams.orderByClause;
      }
      if (queryParams.limit) {
        sql += ' LIMIT ' + queryParams.limit;
      }
      if (queryParams.offset) {
        sql += ' OFFSET ' + queryParams.offset;
      }
      return resolve(sql);
    });
  }

  static logSQLResponse(response: QueryResponse) {
    logger.log(LogType.INFO, 'Execution done in ' + response.wire + ' sec');
    logger.log(LogType.INFO, 'Result: ', response);
  }

  static logSQLResponse2(response: DMLResponse) {
    logger.log(LogType.INFO, 'Execution done in ' + response.wire + ' sec');
    logger.log(LogType.INFO, 'Result: ', response);
  }

  static logSQLError(sql: string, message: string) {
    logger.log(LogType.ERROR, 'Error while executing query ' + sql);
    logger.log(LogType.ERROR, message);
  }

  static getTableScriptTemplate(module: string, columns: Map) {
    let template = 'export enum %sTable {\n';
    for (const name in columns) {
      if (columns.hasOwnProperty(name)) {
        const _s = util.format("   %s = '%s',\n", name, name);
        template += _s;
      }
    }
    template = template.trim();
    if (template.endsWith(',')) {
      template = template.substring(0, template.length - 1);
    }
    template += '\n }';
    return util.format(template, module);
  }

  static getTypeScriptTemplate(module: string, columns: Map) {
    let template = 'export default class %sType {\n constructor(\n';
    for (const name in columns) {
      if (columns.hasOwnProperty(name)) {
        const type = columns[name];
        const _s = util.format('   public %s?: %s,\n', name, type);
        template += _s;
      }
    }
    template = template.trim();
    if (template.endsWith(',')) {
      template = template.substring(0, template.length - 1);
    }
    template += ',\n   public $operation$?: string) {} \n }';
    return util.format(template, module);
  }

  static async getTables(): Promise<string[]> {
    const db = DatabaseManager.getInstance();
    const sql: string = 'SHOW TABLES';
    const rows: Row[] = <Row[]>await db.executeQuery(QueryOperation.QUERY, sql);
    if (!rows || rows.length == 0) {
      console.log('No tables are found!!!');
      return Promise.resolve([]);
    }
    const tables: string[] = [];
    rows.forEach(row => {
      if (row.tablesInIapp) {
        let table: string = <string>Utils.toCamelCase(row.tablesInIapp);
        table = table.substr(0, 1).toUpperCase() + table.substr(1);
        tables.push(table);
      }
    });
    return tables;
  }

  static async getTableColmns(table: string): Promise<Map> {
    const db = DatabaseManager.getInstance();
    table = Utils.inverseCamelCase(table);
    const sql: string = 'SHOW COLUMNS FROM ' + table;
    let rows: Row[];
    try {
      rows = <Row[]>await db.executeQuery(QueryOperation.QUERY, sql);
    } catch (err) {
      return Promise.reject(err);
    }
    const _columns: Map = {};
    if (!rows || rows.length == 0) {
      console.log('No columns are found!!!');
      return Promise.resolve({});
    }
    rows.forEach(row => {
      const name: string = <string>Utils.toCamelCase(row.field);
      let type: string = row.type;
      if (type.indexOf('int') > -1) {
        type = 'number';
      } else if (type.indexOf('date') > -1) {
        type = 'Date';
      } else if (type.indexOf('varchar') > -1) {
        type = 'string';
      }
      _columns[name] = type;
    });
    return Promise.resolve(_columns);
  }

  static generateAppScriptsCMD() {
    if (process.argv.length < 4) {
      console.log('Invalid number of args');
      return;
    }
    let table, alias, arg2: string, arg3: string;
    arg2 = process.argv[2];
    arg3 = process.argv[3];
    if (arg2 && arg2.startsWith('table=')) {
      table = arg2.substr(6);
    }
    if (arg2 && arg2.startsWith('alias=')) {
      alias = arg2.substr(6);
    }
    if (arg3 && arg3.startsWith('table=')) {
      table = arg3.substr(6);
    }
    if (arg3 && arg3.startsWith('alias=')) {
      alias = arg3.substr(6);
    }
    if (!table || !alias) {
      console.log('Invalid args, required table=tableName alias=aliasName');
      return;
    }
    this.generateAppScripts(table, alias);
  }

  static async generateDBAppScripts() {
    const tables: string[] = await Utils.getTables();
    for (let i = 0; i < tables.length; i++) {
      const table = tables[i];
      await this.generateAppScripts(table, table);
    }
    console.log('App Scripts for the database are generated');
  }
  static async generateAppScripts(tableName: string, alias: string) {
    const _columns: Map = await Utils.getTableColmns(tableName);
    if (_columns.length === 0) return Promise.resolve();
    tableName = <string>this.toCamelCase(tableName);
    tableName =
      tableName.substring(0, 1).toUpperCase() + tableName.substring(1);
    const typesFile = 'src/app_scripts/tables/types/' + tableName + 'Type.ts';
    const script: string = this.getTypeScriptTemplate(tableName, _columns);
    if (fs.existsSync(typesFile)) {
      fs.unlinkSync(typesFile);
    }
    fs.openSync(typesFile, 'w');
    fs.writeFileSync(typesFile, script);

    const tablesFile = 'src/app_scripts/tables/' + tableName + 'Table.ts';
    const tableScript: string = this.getTableScriptTemplate(
      tableName,
      _columns
    );
    if (fs.existsSync(tablesFile)) {
      fs.unlinkSync(tablesFile);
    }
    fs.openSync(tablesFile, 'w');
    fs.writeFileSync(tablesFile, tableScript);

    alias = alias.toLowerCase();
    const aliasFile = 'src/app_scripts/hooks/' + alias + '.ts';
    const aliasScript: string = TextUtils.generateHooksTemplate(
      alias,
      tableName
    );
    if (fs.existsSync(aliasFile)) {
      fs.unlinkSync(aliasFile);
    }
    fs.openSync(aliasFile, 'w');
    fs.writeFileSync(aliasFile, aliasScript);
    const storeFile = 'src/app_scripts/Store.ts';
    const storeBuffer: Buffer = fs.readFileSync(storeFile);
    let storeScript = storeBuffer.toString('utf8', 0, storeBuffer.length);
    const _import = util.format("import %s from './hooks/%s';", alias, alias);
    if (storeScript.indexOf(_import) === -1) {
      storeScript = _import + '\n' + storeScript;
      storeScript = storeScript.trim();
      storeScript = storeScript.substr(0, storeScript.length - 2);
      storeScript = storeScript.trim();
      storeScript += '\n  ' + alias + ',\n}';
      fs.writeFileSync(storeFile, storeScript);
    }
    console.log('App Script for ' + tableName + ' is generated');
  }

  static getQueryOperation(row: Row): QueryOperation {
    if (!row || !row.$operation$) return QueryOperation.INVALID;
    let opcode;
    switch (row.$operation$) {
      case 'insert':
        opcode = QueryOperation.INSERT;
        break;
      case 'update':
        opcode = QueryOperation.UPDATE;
        break;
      case 'delete':
        opcode = QueryOperation.DELETE;
      case 'save':
        opcode = QueryOperation.DELETE;
        break;
      case 'query':
        opcode = QueryOperation.QUERY;
        break;
      default:
        opcode = QueryOperation.INVALID;
        break;
    }
    return opcode;
  }

  static getAction(url: string): QueryOperation | void {
    if (url.indexOf('/api/') === -1 || url.length < 6) {
      return;
    }
    url = url.replace('/api/', '');
    url = url.substring(0, url.indexOf('/'));
    let opcode;
    switch (url) {
      case 'save':
        opcode = QueryOperation.SAVE;
        break;
      case 'query':
        opcode = QueryOperation.QUERY;
        break;
      default:
        break;
    }
    return opcode;
  }

  static isValiadAPIRequest(url: string) {
    // ---- /api/operation/table/alias
    return url.startsWith('/api/') && url.split('/').length - 1 === 4;
  }

  static initializeErrorRespose(): Response {
    return {
      status: Status.ERROR,
      responseCode: CODE.INVALID_API_REQUEST,
      message: ''
    };
  }

  static getTable(url: string): string | void {
    url = url.replace('/api/', '');
    url = url.substring(url.indexOf('/') + 1);
    let table: string;
    if (url.indexOf('/') === -1) return;
    return url.substring(0, url.indexOf('/'));
  }

  static getAlias(url: string): string | void {
    url = url.replace('/api/', '');
    url = url.substring(url.indexOf('/') + 1);
    return url.substring(url.indexOf('/') + 1);
  }

  static encrypt(str: string, saltRounds: 10, callback: Function) {
    bcrypt.hash(str, saltRounds, function(err, hash) {
      callback(hash);
    });
  }

  static getJWTTimeout(): number {
    let time: number = 3600;
    const props = Utils.getProps();
    if (props.server && props.server.session && props.server.session.timeout) {
      time = props.server.session.timeout;
    }
    return Number(time);
  }

  static getJWTSecret(): string {
    let salt = 'iapp';
    const props = Utils.getProps();
    if (props.server && props.server.session && props.server.session.salt) {
      salt = props.server.session.salt;
    }
    return salt;
  }

  static getSession(sessionId: string): Map {
    let salt = Utils.getJWTSecret();
    return <Map>jwt.verify(sessionId, salt);
  }

  static isSessionValid(sessionId: string) {
    const token = this.getSession(sessionId);
    if (token.id) {
      return true;
    }
    return false;
  }

  static generatePassword(): string {
    const passwordGenerator = require('password-generator');
    return passwordGenerator();
  }

  static getMailTransporter(emailProps: EmailProps) {
    const secure = emailProps.secure === 'true' ? true : false;
    const trans: Map = {
      service: emailProps.service,
      host: emailProps.host,
      secure,
      port: Number(emailProps.port),
      auth: {
        user: emailProps.user,
        pass: emailProps.password
      }
    };
    return trans;
  }

  static getOSType() {
    var os = require('os')
      .type()
      .toLowerCase();
    let headerImg;
    if (os.indexOf('win') > -1) {
      return 'windows';
    }
    return 'linux';
  }

  static toDay() {
    var d = new Date();
    return d.getMonth() + 1 + '-' + d.getDate() + '-' + d.getFullYear();
  }

  static sendEmail(
    toList: string[],
    ccList: string[],
    subject: string,
    body: string
  ) {
    const props: Properties = this.getProps();
    if (props.server && props.server.email) {
      const emailProps = props.server.email;
      if (
        emailProps.from === 'test@email.com' ||
        emailProps.user === 'test@email.com' ||
        emailProps.password === 'testemailpassword'
      ) {
        logger.log(
          LogType.ERROR,
          'Email sending skipped, Email props are not changed from test email'
        );
      } else {
        logger.log(
          LogType.DEBUG,
          'Sending email from ' + emailProps.from + ' to ' + toList
        );
        const transporter = nodemailer.createTransport(
          this.getMailTransporter(emailProps)
        );
        const mailOptions = {
          from: emailProps.from,
          to: toList,
          cc: ccList,
          subject,
          html: body
        };
        transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            logger.log(LogType.ERROR, 'Error while sending email,' + error);
          } else {
            logger.log(LogType.DEBUG, 'Email sent to ' + toList);
          }
        });
      }
    } else {
      logger.log(
        LogType.ERROR,
        'Email sending skipped, No Email properties are defined'
      );
    }
  }
}
