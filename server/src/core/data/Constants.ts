import { QueryOperation } from '@types';

export const ERROR_MSG_SYSTEM_DOWN =
  'System is down, please try again later or contact your Administrator';

export const ERROR_MSG_ERROR_CONN_DB = 'Error while connecting database';

export const ERR_PRE_QUERY = 'Before Query Exception:';

export const ERR_POST_QUERY = 'Afeter Query Exception:';

export const ERR_WHIL_QUERY = (op: QueryOperation) => `Error while query: `;

export const ERR_NO_PK_DEF = 'No Primary key defination found';

export const ERR_DATA_NO_PK = 'Data should contains primary key value';

export const ERR_BEFR_DML = (op: QueryOperation) => `Before ${op} Exception:`;

export const ERR_AFTR_DML = (op: QueryOperation) => `After ${op} Exception:`;

export const ERR_WHIL_DML = (op: QueryOperation) => `Exception while ${op}:`;

export const ERR_MISSING_AUDIT_COLUMNS = 'Missing audit columns to perform ';

export const ERR_INVLD_OPTION = 'Invliad operation specified ';

export const ERR_NOT_ENGH_DATA = 'Not enough data to perform save operation';

export const MSG_REQ_COMPLTED = 'Server request completed for';

export const MSG_QUERY_START = 'Query Execution starts, user #';

export const MSG_DML_START = 'DML Execution starts, user #';

export const ERR_CANT_QUERY = "Operation shouldn't query";
