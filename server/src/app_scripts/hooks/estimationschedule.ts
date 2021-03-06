import { Row, QueryRequest, Map, LogType } from '@types';
import Table from '@Table';
import logger from '@logger';
import APIManager from '@APIManager';
import DatabaseManager from '@DatabaseManager';
import EstimationSchedule from '../tables/types/EstimationScheduleType';

export default class estimationschedule extends Table {
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
    // Write your code below

    //Don't change below line
    return Promise.resolve();
  }

  public async afterQuery(_row: Row) {
    const row: EstimationSchedule = <EstimationSchedule>_row;
    // Write your code below

    //Don't change below line
    return Promise.resolve();
  }

  public async beforeInsert(_row: Row) {
    const row: EstimationSchedule = <EstimationSchedule>_row;
    // Write your code below

    //Don't change below line
    return Promise.resolve();
  }

  public async afterInsert(_row: Row) {
    const row: EstimationSchedule = <EstimationSchedule>_row;
    // Write your code

    //Don't change below line
    return Promise.resolve();
  }

  public async beforeUpdate(_row: Row) {
    const row: EstimationSchedule = <EstimationSchedule>_row;
    // Write your code below

    //Don't change below line
    return Promise.resolve();
  }

  public async afterUpdate(_row: Row) {
    const row: EstimationSchedule = <EstimationSchedule>_row;
    // Write your code below

    //Don't change below line
    return Promise.resolve();
  }

  public async beforeDelete(_row: Row) {
    const row: EstimationSchedule = <EstimationSchedule>_row;
    // Write your code below

    //Don't change below line
    return Promise.resolve();
  }

  public async afterDelete(_row: Row) {
    const row: EstimationSchedule = <EstimationSchedule>_row;
    // Write your code below

    //Don't change below line
    return Promise.resolve();
  }
}
