import { CODE } from './ResponseCodes';

export type DB = {
  type: string;
  version: string;
  name: string;
  host: string;
  port: number;
  user: string;
  password: string;
  connectionPoolLimit: number;
};

export type HttpRequestParams = {
  table: string;
  alias: string;
};

export enum QueryOperation {
  QUERY = 'query',
  INSERT = 'insert',
  UPDATE = 'update',
  DELETE = 'delete',
  SAVE = 'save',
  INVALID = 'invalid'
}
export type QueryRequest = {
  table: string;
  alias: string;
  actionParams?: Map;
  selectParams?: string[];
  whereClause?: string;
  whereClauseParams?: any[];
  orderByClause?: string;
  customSql?: string;
  limit?: number;
  offset?: number;
  userInfo: UserInfo;
};

export type QueryResponse = {
  table: string;
  alias: string;
  actionParams?: Map;
  wire: number;
  sql: string;
  params: any[];
  status: Status;
  responseCode: CODE;
  message?: string;
  rows: Row[];
};

export type Row = {
  $status$?: Status;
  $code$?: CODE;
  $message$?: string;
  $operation$?: QueryOperation;
  $actionParams$?: Map;
  [key: string]: any;
  createDate?: Date;
  createUserId?: number;
  updateDate?: Date;
  updateUserId?: number;
};

export type DMLRequest = {
  table: string;
  alias: string;
  actionParams?: Map;
  rows: Row[];
  userInfo: UserInfo;
};

export type DMLResponse = {
  table: string;
  alias: string;
  actionParams?: Map;
  wire: number;
  rows?: Row[];
};

export type UploadResponse = {
  status: Status;
  message: string;
  url: string;
};

export type UserInfo = {
  userId?: number;
  userName?: string;
  displayName?: string;
  emailAddress?: string;
  avatarUrl?: string;
  sessionId?: string;
};

export type PKInfo = {
  key: string;
  type: string;
  autoIncrement: boolean;
};

export type Response = {
  status: Status;
  responseCode: CODE;
  message: string;
};

export type LogContent = {
  level: LogType;
  messaage: string;
};

export type Users = {
  [id: number]: UserInfo;
};

export type ServerCache = {
  users: Users;
};

export type SessionProps = {
  salt: string;
  timeout: number;
};

export type EmailProps = {
  service: string;
  secure: string;
  host: string;
  port: string;
  user: string;
  password: string;
  from: string;
};
export type ServerProps = {
  port: string;
  session: SessionProps;
  email: EmailProps;
};

export type Properties = {
  env?: string;
  db?: DB;
  logger?: LogContent;
  server?: ServerProps;
};

export type Map = {
  [key: string]: any;
};

export enum LogType {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  VERBOSE = 'verbose',
  DEBUG = 'debug',
  SILLY = 'silly'
}

export enum Status {
  SUCCESS = 'success',
  ERROR = 'error'
}

export enum LeadStatus {
  DRAFT = 'Draft',
  OPEN = 'Open',
  REQUEST_FOR_ESTIMATION = 'For Estimation',
  ESTIMATED = 'Estimated',
  REQUEST_FOR_QUOTATION = 'For Quotation',
  QUOTED = 'Quoted',
  CLOSED_WIN = 'Closed, Win',
  CLOSED_LOSE = 'Closed, Lose'
}
