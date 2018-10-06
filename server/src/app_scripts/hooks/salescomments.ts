import Utils from '@Utils';
import Table from '@Table';
import {
  Row,
  QueryRequest,
  Map,
  LogType,
  DMLRequest,
  QueryOperation
} from '@types';
import UsersType from '../tables/types/UsersType';

export default class salescomments extends Table {
  // Below are the variables you can use, their values will be updated at runtime
  // this.skipQuery: boolean;
  // this.skipInsert: boolean;
  // this.skipUpdate: boolean;
  // this.skipDelete: boolean;
  // this.rowIndex: number;
  // this.rows: Row[];
  // this.toatalRows: number;
  // this.actionParams?: Map|void;
  // this.sessionId: string;
  // this.userId: number;
  // this.table: string;
  // this.alias: string;
  // Logging Eg. logger logger.log(LogType.ERROR, 'Your message...', optional Map);
  // api: APIManager = APIManager.getInstance();
  // db: DatabaseManager = DatabaseManager.getInstance();

  public async beforeQuery(queryRequest: QueryRequest) {
    return new Promise((resolve, reject) => {
      queryRequest.customSql =
        'SELECT id, comment, create_date, create_user_id from sales_comments where sales_id = ? ' +
        'group by create_date, create_user_id, id, comment order by create_date desc';
      return resolve();
    });
  }
  moment: any;
  public async afterQuery(_rows: Row[]): Promise<any> {
    return new Promise((resolve, reject) => {
      Utils.getUsers().then((users: UsersType[]) => {
        _rows.forEach(_row => {
          if (!this.moment) {
            this.moment = require('moment');
          }
          const date = this.moment(_row.createDate);
          const time = date.format('HH:mm a');
          _row.group = date.format('MMMM') + ' ' + date.format('DD');
          _row.time = time;
          users.forEach(user => {
            if (user.userId === _row.createUserId) {
              _row.userName = user.userName;
            }
          });
        });
        resolve();
      });
    });
  }

  public async beforeInsert(_row: Row): Promise<any> {
    return new Promise((resolve, reject) => {
      return resolve();
    });
  }

  public async afterInsert(_row: Row): Promise<any> {
    return new Promise((resolve, reject) => {
      return resolve();
    });
  }

  public async beforeUpdate(_row: Row): Promise<any> {
    return new Promise((resolve, reject) => {
      return resolve();
    });
  }

  public async afterUpdate(_row: Row): Promise<any> {
    return new Promise((resolve, reject) => {
      return resolve();
    });
  }

  public async beforeDelete(_row: Row): Promise<any> {
    return new Promise((resolve, reject) => {
      return resolve();
    });
  }

  public async afterDelete(_row: Row): Promise<any> {
    return new Promise((resolve, reject) => {
      return resolve();
    });
  }
}
