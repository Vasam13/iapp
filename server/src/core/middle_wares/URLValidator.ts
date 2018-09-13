import * as core from 'express-serve-static-core';
import { NextFunction } from 'connect';
import Utils from '@Utils';
import { CODE } from '@Codes';
import { Response, LogType, QueryOperation } from '@types';
import logger from '@logger';

export const URLValidator = (
  req: core.Request,
  res: core.Response,
  next: NextFunction
) => {
  const url = req.url;
  const paramsLength = Object.keys(req.body).length;
  let responseCode: CODE = CODE.SUCCESS;
  let message: string = '';
  if (!Utils.isValiadAPIRequest(url) || paramsLength === 0) {
    responseCode = CODE.INVALID_API_REQUEST;
    message = 'Invalid API request ' + url;
  }
  if (!req.body.sessionId) {
    responseCode = CODE.INVALID_SESSION;
    message = 'No SessionId recieved for ' + url;
  }
  const action: QueryOperation | void = Utils.getAction(url);
  const table: string | void = Utils.getTable(url);
  const alias: string | void = Utils.getAlias(url);
  if (!action || !table || !alias) {
    responseCode = CODE.INVALID_API_REQUEST;
    message = 'Invalid API request, not enough parameters ' + url;
  }
  if (responseCode !== CODE.SUCCESS) {
    const response: Response = Utils.initializeErrorRespose();
    response.responseCode = responseCode;
    response.message = message;
    logger.log(LogType.ERROR, 'MiddleWare-APIValidator: ' + message);
    req.body.errorResponse = response;
    return next();
  }
  req.body.table = table;
  req.body.alias = alias;
  req.body.action = action;
  return next();
};
