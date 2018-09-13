import { QueryRequest, Row, Map } from '@types';

export default class Table {
  skipQuery: boolean = false;
  skipInsert: boolean = false;
  skipUpdate: boolean = false;
  skipDelete: boolean = false;
  rowIndex: number = -1;
  rows: Row[] = [];
  toatalRows: number = -1;
  actionParams?: Map = {};
  sessionId: string = '';
  userId?: number;
  table: string = '';
  alias: string = '';

  public async beforeQuery(queryRequest: QueryRequest): Promise<any> {}
  public async afterQuery(row: Row): Promise<void> {}
  public async beforeInsert(row: Row): Promise<void> {}
  public async afterInsert(row: Row): Promise<void> {}
  public async beforeUpdate(row: Row): Promise<void> {}
  public async afterUpdate(row: Row): Promise<void> {}
  public async beforeDelete(row: Row): Promise<void> {}
  public async afterDelete(row: Row): Promise<void> {}
}
