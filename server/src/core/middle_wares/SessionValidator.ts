import * as core from 'express-serve-static-core';
import { NextFunction } from 'connect';
import Utils from '@Utils';
import { CODE } from '@Codes';
import { Response, LogType, Map, UserInfo } from '@types';
import logger from '@logger';
import * as jwt from 'jsonwebtoken';
import Server from '@HttpGateway';

export const SessionValidator = (
  req: core.Request,
  res: core.Response,
  next: NextFunction
) => {
  if (req.body.errorResponse) {
    return next();
  }
  let responseCode: CODE = CODE.SUCCESS;
  const sessionId = req.body.sessionId;
  const props = Server.props;
  let salt = Utils.getJWTSecret();
  let userId: number = -1;
  try {
    var token = <Map>jwt.verify(sessionId, salt);
    if (!token.id) {
      responseCode = CODE.INVALID_SESSION;
    }
    userId = Number(token.id);
    logger.log(LogType.INFO, 'Server session validated for #' + token.id);
  } catch (err) {
    responseCode = CODE.INVALID_SESSION;
  }
  if (responseCode !== CODE.SUCCESS) {
    return moveNextError(req, next, errorResponse(responseCode));
  }
  const cachedUser = Server.cache.users[userId];
  if (!cachedUser) {
    Utils.queryUser(userId)
      .then((result: Map | void) => {
        if (result) {
          moveNext(req, next, <UserInfo>result);
        } else {
          return moveNextError(req, next, errorResponse(responseCode));
        }
      })
      .catch(error => {
        return moveNextError(req, next, errorResponse(responseCode));
      });
  } else {
    return moveNext(req, next, cachedUser);
  }
};

const moveNextError = (
  req: core.Request,
  next: NextFunction,
  response: Response
) => {
  req.body.errorResponse = response;
  next();
};

const moveNext = (
  req: core.Request,
  next: NextFunction,
  userInfo: UserInfo
) => {
  req.body.userInfo = userInfo;
  next();
};
const errorResponse = (code: CODE) => {
  const response: Response = Utils.initializeErrorRespose();
  response.responseCode = CODE.ERROR;
  const message = 'Session expires, please login and try again';
  response.message = message;
  logger.log(LogType.ERROR, 'MiddleWare-SessionValidator: ' + message);
  return response;
};
