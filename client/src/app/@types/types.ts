import { CODE } from '@code';
import { Observable } from 'rxjs/Observable';

export interface Store {
  isBusy: boolean;
  isDirty: boolean;
  rows: Row[];
  selected: any[];
  queryAllowed: boolean;
  inserAllowed: boolean;
  updateAllowed: boolean;
  deleteAllowed: boolean;
  beforeSave: Function;
  afterSave: Function;
  whereClause: string;
  whereClauseParams: any[];
  orderByClause: string;
  // currentRow: Row;
  columnsMD: ColumnMetaData<Map>[];
  getDirtyRows(): Row[];
  onRowSelect(val: any): void;
  deleteSelected();
  clickHandler(row: Row, columnMd: ColumnMetaData<Map>): void;
  isEditable(row: Row, columnMd: ColumnMetaData<Map>): boolean;
  hasErrors(row: Row, columnMd: ColumnMetaData<Map>): boolean;
  query(): Promise<QueryResponse>;
  saveRows(rows: Row[]): Promise<DMLResponse>;
  save(): Promise<DMLResponse>;
  destroy(): void;
  insertRow(): void;
  onRowSelect(val: any);
  setCurrentColumn(rowIndex: number, columnIndex: number): void;
  getCurrentRowIndex(): number;
  getCurrentRow(): Row;
  isCurrentRow(rowIndex: number): boolean;
  isColumnTouched(rowIndex: number, columnIndex: number): boolean;
  resetCurrentColumn(): void;
}
export interface APIManager {
  query(
    tableName: string,
    alias: string,
    params?: QueryRequest
  ): Observable<QueryResponse>;
  save(
    tableName: string,
    alias: string,
    params: DMLRequest
  ): Observable<DMLResponse>;
  login(userName: string, password: string): Observable<boolean>;
  destroy(): void;
}
export interface QueryRequest {
  actionParams?: Map;
  selectParams?: string[];
  whereClause?: string;
  whereClauseParams?: any[];
  orderByClause?: string;
  customSql?: string;
  limit?: number;
  offset?: number;
}
export interface DropDownColumn {
  store: Store;
  displayColumn: string;
  valueColumn: string;
  onChange?: Function;
}
export interface TemplateConfiguration {
  onClick?: Function;
  getHTML: Function;
}
export interface LinkConfiguration {
  onClick?: Function;
  icon?: string;
  text?: string;
  html?: string;
}

export enum ColumnType {
  STRING = 'text',
  NUMBER = 'number',
  DATE = 'date',
  DROP_DOWN = 'select',
  LINK = 'link',
  TEMPLETE = 'template'
}

export interface ColumnMetaData<T> {
  column: string;
  title: string;
  type: ColumnType;
  inserAllowed?: boolean;
  updateAllowed?: boolean;
  required?: boolean;
  style?: string;
  sortable?: boolean;
  onClick?: Function;
  dropDownConfiguration?: DropDownColumn;
  visible?: Function;
  linkConfiguration?: LinkConfiguration;
  templateConfiguration?: TemplateConfiguration;
  $touched$?: boolean;
}
export interface StoreOption {
  autoQuery?: boolean;
  queryAllowed?: boolean;
  inserAllowed?: boolean;
  updateAllowed?: boolean;
  deleteAllowed?: boolean;
  whereClause?: string;
  whereClauseParams?: any[];
  orderByClause?: string;
  skipOrderBy?: boolean;
  actionsParams?: Map;
  selectParams?: string[];
}

export enum NotifType {
  INFO = 'info',
  WARNING = 'warning',
  DANGER = 'danger',
  SUCCESS = 'success',
  DEFAULT = 'default'
}

export enum NotifStyle {
  SIMPLE = 'simple',
  BAR = 'bar',
  CIRCLE = 'circle',
  FLIP = 'flip'
}

export enum NotifPosition {
  TOP = 'top',
  TOP_RIGHT = 'top-right',
  TOP_LEFT = 'top-left',
  BOTTOM = 'bottom',
  BOTTOM_RIGHT = 'bottom-right',
  BOTTOM_LEFT = 'bottom-left'
}

export interface Map {
  [key: string]: any;
}

export enum Status {
  SUCCESS = 'success',
  ERROR = 'error'
}

export enum QueryOperation {
  QUERY = 'query',
  INSERT = 'insert',
  UPDATE = 'update',
  DELETE = 'delete',
  SAVE = 'save',
  INVALID = 'invalid'
}

export interface Response {
  status: Status;
  responseCode: CODE;
  message: string;
  [key: string]: any;
}

export interface Row {
  $id$?: string;
  $status$?: Status;
  $code$?: CODE;
  $message$?: string;
  $operation$: QueryOperation;
  [key: string]: any;
  $actionParams$?: Map;
  createDate?: Date;
  createUserId?: number;
  updateDate?: Date;
  updateUserId?: number;
}

export interface UserInfo {
  userId?: number;
  userName?: string;
  displayName?: string;
  emailAddress?: string;
  avatarUrl?: string;
  sessionId?: string;
  roles?: Map[];
  functions?: Map[];
}

export interface QueryResponse {
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
}

export interface DMLRequest {
  actionParams?: Map;
  rows: Row[];
}

export interface DMLResponse {
  status: Status;
  responseCode: CODE;
  message?: string;
  table: string;
  alias: string;
  actionParams?: Map;
  wire: number;
  rows?: Row[];
}

export enum URLType {
  SALES = '/sales',
  PROJECTS = '/projects',
  CLIENTS = '/clients',
  ADMINISTRATOR = '/settings'
}
export enum RoleCategory {
  SALES = 'Sales',
  PROJECTS = 'Projects'
}

export interface State {
  isHome: string;
  state: string;
  menuLabel?: string;
  menuIcon?: string;
  roleCodes?: string[];
}

export interface AppRoute {
  path: string;
  component: any;
  data?: State;
  children?: AppRoute[];
}

export enum Roles {
  ADMINISTRATOR = 'administrator',
  MANAGEMENT = 'management',
  SALES_PERSON = 'salesperson',
  SALES_MANAGER = 'salesmanager',
  ESTIMATOR = 'estimator',
  ESTIMATION_MANAGER = 'estimationmanager',
  TEAM_LEAD = 'teamlead',
  PROJECT_MANAGER = 'projectmanager',
  DEVELOPER = 'developer',
  CHECKER = 'checker',
  ALL_USERS = 'allusers'
}

export enum Functions {
  SALES = 'sales',
  ESTIMAIONS = 'estimations',
  QUOTES = 'quotes',
  PROJECTS = 'projects',
  RFI = 'RFI',
  CCN = 'CCN',
  BFA = 'BFA'
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

export enum ProjectStatus {
  OPEN = 'Open'
}
