import Utils from '@Utils';
import { Row, QueryRequest, Map, LogType } from '@types';
import Table from '@Table';
import logger from '@logger';
import APIManager from '@APIManager';
import DatabaseManager from '@DatabaseManager';
import Users from '../tables/types/UsersType';
import bcrypt from 'bcrypt';

export default class users extends Table {
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
  password: string = '';

  public async beforeQuery(queryRequest: QueryRequest) {
    if (this.actionParams) {
      if (this.actionParams.filter) {
        const filter: string = this.actionParams.filter;
      }
    }
    return Promise.resolve();
  }

  public async afterQuery(_rows: Row[]): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  public async beforeInsert(_row: Row): Promise<any> {
    return new Promise((resolve, reject) => {
      const row: Users = <Users>_row;
      this.password = Utils.generatePassword();
      Utils.encrypt(this.password, 10, (hash: string) => {
        row.passwordHash = hash;
        row.passwordChanged = 'N';
        return resolve();
      });
    });
  }

  private sendPasswordGenMail(_row: Row, re?: boolean) {
    const row: Users = <Users>_row;
    if (row.emailAddress && this.password) {
      _row.password = this.password;
      let subject = 'Your login password is generated';
      if (re) {
        subject = 'Reset password';
      }
      Utils.sendEmail(
        [row.emailAddress],
        [],
        subject,
        'Hi ' +
          row.displayName +
          ',<br/> your password is generated as <b>' +
          this.password +
          '</b><br/>' +
          'Login into your account, and reset the password<br/><br/><br/>' +
          '<i>this is an automatically generated email – please do not reply to it.</i>'
      );
    }
  }

  public async afterInsert(_row: Row): Promise<any> {
    return new Promise((resolve, reject) => {
      this.sendPasswordGenMail(_row);
      return resolve();
    });
  }

  public async beforeUpdate(_row: Row): Promise<any> {
    return new Promise((resolve, reject) => {
      const row: Users = <Users>_row;
      if (_row.$actionParams$ && _row.$actionParams$.resetPassword === 'Y') {
        this.password = Utils.generatePassword();
        Utils.encrypt(this.password, 10, (hash: string) => {
          row.passwordHash = hash;
          row.passwordChanged = 'N';
          return resolve();
        });
      } else if (row.oldPassword && row.passwordHash && row.newPassword) {
        bcrypt.compare(row.oldPassword, row.passwordHash).then(function(res) {
          if (res && row.newPassword) {
            Utils.encrypt(row.newPassword, 10, (hash: string) => {
              row.passwordHash = hash;
              row.passwordChanged = 'Y';
              delete row['oldPassword'];
              delete row['newPassword'];
              return resolve();
            });
          } else {
            reject('Incorrect password!');
          }
        });
      } else {
        return resolve();
      }
    });
  }

  public async afterUpdate(_row: Row): Promise<any> {
    return new Promise((resolve, reject) => {
      if (_row.$actionParams$ && _row.$actionParams$.resetPassword === 'Y') {
        this.sendPasswordGenMail(_row, true);
      }
      return resolve();
    });
  }

  public async beforeDelete(_row: Row): Promise<any> {
    return new Promise((resolve, reject) => {
      const row: Users = <Users>_row;
      // Write your code below

      //Don't change below line
      return resolve();
    });
  }

  public async afterDelete(_row: Row): Promise<any> {
    return new Promise((resolve, reject) => {
      const row: Users = <Users>_row;
      // Write your code below

      //Don't change below line
      return resolve();
    });
  }
}
