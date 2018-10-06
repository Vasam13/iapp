import { Status } from '@types';
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
import formidable from 'formidable';
import path from 'path';
import fs from 'fs';

export const UploadHandler = (
  req: core.Request,
  res: core.Response,
  next: NextFunction
) => {
  const url = req.url;
  let response, message;
  if (url.endsWith('/pp')) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, _file) {
      if (!fields.sessionId || !fields.userId) {
        message = 'No SessionId recieved for ' + url;
        response = errorResponse(CODE.INVALID_SESSION, message);
        return moveNextError(req, next, response);
      }
      try {
        if (!Utils.isSessionValid(<string>fields.sessionId)) {
          message = 'Invalid session';
          response = errorResponse(CODE.INVALID_SESSION, message);
          return moveNextError(req, next, response);
        }
      } catch (err) {
        message = 'Invalid session';
        response = errorResponse(CODE.INVALID_SESSION, message);
        return moveNextError(req, next, response);
      }
      const filePath = _file.file.path;
      const sharp = require('sharp');
      sharp(filePath)
        .resize(128)
        .png()
        .toBuffer()
        .then((data: any) => {
          const dmlRequest: DMLRequest = {
            table: 'Users',
            alias: 'user',
            rows: [
              {
                $operation$: QueryOperation.UPDATE,
                avatarBlob: data,
                userId: fields.userId
              }
            ],
            userInfo: <UserInfo>fields
          };
          APIManager.getInstance()
            .executeUpdate(dmlRequest)
            .then((res: DMLResponse) => {
              if (
                res.rows &&
                res.rows.length > 0 &&
                res.rows[0].$status$ === Status.SUCCESS
              ) {
                response = {
                  status: Status.SUCCESS,
                  name: fields.userId + '.jpg',
                  url: ''
                };
                req.body.successResponse = response;
                next();
              } else {
                response = errorResponse(
                  CODE.INVALID_DML_OPERATION,
                  'Error saving userInfo'
                );
                return moveNextError(req, next, response);
              }
            });
        })
        .catch((err: any) => {
          logger.log(LogType.ERROR, 'Error while uploading file', err);
          response = errorResponse(
            CODE.SYSTEM_ERR,
            'Error while uploading file'
          );
          return moveNextError(req, next, response);
        });
    });
  } else if (url.endsWith('/file')) {
  } else {
    response = errorResponse(CODE.SYSTEM_ERR, 'Invalid file upload option/URL');
    return moveNextError(req, next, response);
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

const errorResponse = (code: CODE, msg: string) => {
  const response: Response = Utils.initializeErrorRespose();
  response.responseCode = code;
  response.message = msg;
  logger.log(LogType.ERROR, 'MiddleWare-UploadHandler: ' + msg);
  return response;
};
