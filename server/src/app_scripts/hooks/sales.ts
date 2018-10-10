import Utils from '@Utils';
import { LeadStatus } from './../../core/data/types';
import { Row, QueryRequest, Map, LogType, DMLRequest } from '@types';
import Table from '@Table';
import logger from '@logger';
import APIManager from '@APIManager';
import DatabaseManager from '@DatabaseManager';
import Sales from '../tables/types/SalesType';
import GenerateQuotePDF from './GenerateQuotePDF';

export default class sales extends Table {
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
  api: APIManager = APIManager.getInstance();
  // db: DatabaseManager = DatabaseManager.getInstance();

  public async beforeQuery(queryRequest: QueryRequest) {
    return new Promise((resolve, reject) => {
      if (
        queryRequest.actionParams &&
        queryRequest.actionParams.generateQuotePDF &&
        queryRequest.actionParams.generateQuotePDF === 'Y' &&
        queryRequest.actionParams.salesId
      ) {
        GenerateQuotePDF.generate(queryRequest.actionParams.salesId).then(
          res => {
            this.skipQuery = true;
            return resolve();
          }
        );
      } else {
        return resolve();
      }
    });
  }

  public async afterQuery(_rows: Row[]): Promise<any> {
    return new Promise((resolve, reject) => {
      return resolve();
    });
  }

  public async beforeInsert(_row: Row): Promise<any> {
    return new Promise((resolve, reject) => {
      const row: Sales = <Sales>_row;
      // Write your code below

      //Don't change below line
      return resolve();
    });
  }

  public async afterInsert(_row: Row): Promise<any> {
    return new Promise((resolve, reject) => {
      const row: Sales = <Sales>_row;
      // Write your code

      //Don't change below line
      return resolve();
    });
  }

  public async beforeUpdate(_row: Row): Promise<any> {
    return new Promise((resolve, reject) => {
      const row: Sales = <Sales>_row;
      // Write your code below

      //Don't change below line
      return resolve();
    });
  }

  public async afterUpdate(_row: Row): Promise<any> {
    return new Promise((resolve, reject) => {
      const row: Sales = <Sales>_row;
      return resolve();
    });
  }

  public async beforeDelete(_row: Row): Promise<any> {
    return new Promise((resolve, reject) => {
      const row: Sales = <Sales>_row;
      // Write your code below

      //Don't change below line
      return resolve();
    });
  }

  public async afterDelete(_row: Row): Promise<any> {
    return new Promise((resolve, reject) => {
      const row: Sales = <Sales>_row;
      // Write your code below

      //Don't change below line
      return resolve();
    });
  }
}
