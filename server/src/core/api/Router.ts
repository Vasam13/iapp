import Utils from '@Utils';
import DatabaseManager from '@DatabaseManager';
import { LogType, Map, QueryOperation, Row } from '@types';
import * as core from 'express-serve-static-core';
import { URLValidator } from 'core/middle_wares/URLValidator';
import { SessionValidator } from 'core/middle_wares/SessionValidator';
import { APIRouter } from 'core/middle_wares/APIRouter';
import { SignIn } from 'core/middle_wares/SignInMW';
import { UploadHandler } from 'core/middle_wares/UploadHandler';
import path from 'path';
import logger from '@logger';
import stream from 'stream';

export default class Router {
  private app: core.Express;

  constructor(app: core.Express) {
    this.app = app;
  }

  public route() {
    this.app.get('/', function(req, res, next) {
      console.log(__dirname);
      return res
        .status(200)
        .sendFile(path.join(__dirname + '/../../../public/index.html'));
    });
    this.app.post('/api/login', SignIn, (req, res, next) => {
      if (req.body.errorResponse) {
        return res.send(req.body.errorResponse);
      }
      if (req.body.userInfo) {
        return res.send(req.body.userInfo);
      }
    });
    this.app.get('/api/download/*', function(req, res) {
      let url = req.url.replace('/api/download/', '');
      const params: Map = {};
      url = Buffer.from(url, 'base64').toString('ascii');
      url.split('&').forEach(element => {
        const _p = element.split('=');
        params[_p[0]] = _p[1];
      });
      if (!params.ds || !params.column || !params.pk || !params.pkv) {
        return res.send('Missing datasource details!');
      }
      if (!params.type) {
        return res.send('Missing type');
      }
      const sql =
        'SELECT ' +
        Utils.inverseCamelCase(params.column) +
        ' FROM ' +
        Utils.inverseCamelCase(params.ds) +
        ' WHERE ' +
        Utils.inverseCamelCase(params.pk) +
        ' = ' +
        params.pkv;
      const db = DatabaseManager.getInstance();
      db.executeQuery(QueryOperation.QUERY, sql).then(_rows => {
        const rows: Row[] = _rows;
        if (!rows || rows.length == 0) {
          return res.send('No row is found');
        }
        const _bffr = rows[0][params.column];
        if (!_bffr) {
          return res.send('No content is found');
        }
        const fileContents = Buffer.from(_bffr, 'base64');
        const readStream = new stream.PassThrough();
        readStream.end(fileContents);
        let disp = 'download';
        if (params.export && params.export === 'view') {
          disp = 'inline';
        }
        res.set(
          'Content-disposition',
          disp + '; filename=' + params.pkv + '.' + params.type
        );
        res.set('Content-Type', 'application/pdf');
        readStream.pipe(res);
      });
    });
    this.app.post('/api/upload/*', UploadHandler, (req, res, next) => {
      logger.log(
        LogType.INFO,
        'Server Request is completed for ' + req.body.userInfo
      );
      if (req.body.errorResponse) {
        logger.log(LogType.ERROR, req.body.errorResponse);
        return res.send(req.body.errorResponse);
      }
      if (req.body.successResponse) {
        logger.log(LogType.INFO, req.body.successResponse);
        return res.send(req.body.successResponse);
      }
    });
    this.app.post(
      '/api/*',
      URLValidator,
      SessionValidator,
      APIRouter,
      (req, res, next) => {
        logger.log(
          LogType.INFO,
          'Server Request is completed for ' + req.body.userInfo
        );
        if (req.body.errorResponse) {
          logger.log(LogType.ERROR, req.body.errorResponse);
          return res.send(req.body.errorResponse);
        }
        if (req.body.successResponse) {
          logger.log(LogType.INFO, req.body.successResponse);
          return res.send(req.body.successResponse);
        }
      }
    );
  }
}
