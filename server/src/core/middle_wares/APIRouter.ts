import * as core from 'express-serve-static-core';
import { NextFunction } from 'connect';
import Utils from '@Utils';
import { CODE } from '@Codes';
import { Response, LogType, DMLRequest, UserInfo } from '@types';
import { QueryOperation, QueryRequest, QueryResponse } from '@types';
import { DMLResponse } from '@types';
import logger from '@logger';
import APIManager from '@APIManager';
import * as constants from '@constants';

export const APIRouter = (
  req: core.Request,
  res: core.Response,
  next: NextFunction
) => {
  if (req.body.errorResponse) {
    return next();
  }
  const action = req.body.action;
  const bodyParams = req.body;
  const userInfo: UserInfo = bodyParams.userInfo;
  if (action === QueryOperation.QUERY) {
    const queryRequest: QueryRequest = Utils.getQueryRequest(bodyParams);
    APIManager.getInstance()
      .executeQuery(queryRequest)
      .then((response: QueryResponse) => {
        logger.log(LogType.INFO, constants.MSG_REQ_COMPLTED, userInfo);
        return res.send(response);
      });
  } else if (action === QueryOperation.SAVE) {
    if (!bodyParams.rows || !(bodyParams.rows.length > 0)) {
      const msg: string = constants.ERR_NOT_ENGH_DATA;
      const response: Response = errorResponse(CODE.INVALID_DML_DATA, msg);
      return moveNextError(req, next, response);
    }
    const dmlRequest: DMLRequest = Utils.getDMLRequest(bodyParams);
    APIManager.getInstance()
      .executeUpdate(dmlRequest)
      .then((response: DMLResponse) => {
        return moveNext(req, next, response);
      });
  } else {
    const msg: string = 'Invalid Operation  ' + req.url;
    const response: Response = errorResponse(CODE.INVALID_API_OPERATION, msg);
    return moveNextError(req, next, response);
  }
};

const moveNext = (req: core.Request, next: NextFunction, response: any) => {
  req.body.successResponse = response;
  next();
};

const moveNextError = (
  req: core.Request,
  next: NextFunction,
  response: Response
) => {
  req.body.errorResponse = response;
  next();
};

const errorResponse = (code: CODE, msg: string) => {
  const response: Response = Utils.initializeErrorRespose();
  response.responseCode = CODE.ERROR;
  response.message = msg;
  logger.log(LogType.ERROR, 'MiddleWare-APIRouter: ' + msg);
  return response;
};
