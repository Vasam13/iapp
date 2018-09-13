import logger from '@logger';
import { Response, LogType, UserInfo, Row, Map } from '@types';
import Utils from '@Utils';
import { CODE } from '@Codes';
import * as core from 'express-serve-static-core';
import { NextFunction } from 'connect';
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import uuid from 'uuid';

export const SignIn = (
  req: core.Request,
  res: core.Response,
  next: NextFunction
) => {
  const saltRounds = 10;
  const userName = req.body.userName;
  const password = req.body.password;
  let msg: string;
  let response;
  if (!userName || !password) {
    msg = 'Invlid user/password, please verify';
    response = errorResponse(CODE.INVALID_USER_PASS, msg);
    return moveNextError(req, next, response);
  }
  try {
    Utils.queryUserByName(userName)
      .then((result: Row | void) => {
        if (!result || !result.passwordHash) {
          response = errorResponse(
            CODE.INVALID_USER_PASS,
            "User doesn't exists"
          );
          return moveNextError(req, next, response);
        }
        bcrypt.compare(password, result.passwordHash).then(function(res) {
          if (res) {
            const userInfo: Map = {};
            let _u: UserInfo = Utils.getInitialUserInfo();
            Object.keys(_u).forEach(key => {
              userInfo[key] = result[key];
            });
            const secret = Utils.getJWTSecret();
            const timeout = Utils.getJWTTimeout();
            const sessionId = jwt.sign(
              {
                id: userInfo.userId
              },
              secret,
              { expiresIn: timeout }
            );
            userInfo.sessionId = sessionId;
            Utils.fillUserInfo(userInfo).then((userFullInfo: Map) => {
              return moveNext(req, next, <UserInfo>userFullInfo);
            });
          } else {
            response = errorResponse(
              CODE.INVALID_USER_PASS,
              'Incorrect password'
            );
            return moveNextError(req, next, response);
          }
        });
      })
      .catch(error => {
        response = errorResponse(CODE.SYSTEM_ERR, error);
        return moveNextError(req, next, response);
      });
  } catch (error) {
    response = errorResponse(
      CODE.SYSTEM_ERR,
      'It seems system got some errors, please contact your Administator'
    );
    return moveNextError(req, next, response);
  }
};

const moveNext = (
  req: core.Request,
  next: NextFunction,
  userInfo: UserInfo
) => {
  req.body.userInfo = userInfo;
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
  response.responseCode = code;
  response.message = msg;
  logger.log(LogType.ERROR, 'MiddleWare-SignInMW: ' + msg);
  return response;
};
