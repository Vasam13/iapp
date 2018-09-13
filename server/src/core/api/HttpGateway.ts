import { ServerCache, LogType, Properties } from '@types';
import bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import path from 'path';
import * as core from 'express-serve-static-core';
import Utils from '@Utils';
import logger from '@logger';
import Router from './Router';

export default class Server {
  private static instance: Server;
  private app: core.Express;
  private router: Router;
  public static props: Properties;
  public static port: number;
  public static env: string;
  public static cache: ServerCache = { users: {} };

  public static getInstance(): Server {
    if (!this.instance) {
      this.instance = new Server();
    }
    return this.instance;
  }

  constructor() {
    this.app = express();
    this.router = new Router(this.app);
  }

  private config = () => {
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cors());
    this.app.use(express.static(path.join(__dirname, '/../../../public')));
  };

  public start = () => {
    logger.log(LogType.INFO, 'Starting the Server...');
    const props = (Server.props = Utils.getProps());
    let port = 5000;
    if (props.server && props.server.port) {
      port = Number(props.server.port);
    }
    Server.port = port;
    Server.env = Utils.getEnvironment();

    this.config();
    this.app.listen(port, () => {
      logger.log(
        LogType.INFO,
        `Server is UP & listening on ${port}, in ${Server.env} mode`
      );
    });
    this.router.route();
  };
}
