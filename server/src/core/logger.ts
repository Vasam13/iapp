import Utils from '@Utils';
import { LogType } from '@types';
import winston, { format, Logger } from 'winston';

export default class logger {
  static _logger: Logger;

  private static initLogger() {
    if (this._logger) return;
    const props = Utils.getProps();
    let logLevel = LogType.INFO;
    if (props && props.logger) {
      logLevel = props.logger.level;
    }
    this._logger = winston.createLogger({
      level: logLevel,
      format: format.combine(format.timestamp(), format.json()),
      transports: [
        new winston.transports.File({
          filename: './../logs/iapp.log'
        })
      ]
    });
    if (Utils.getEnvironment() === 'dev') {
      this._logger.clear();
      this._logger.add(
        new winston.transports.Console({
          format: winston.format.simple()
        })
      );
    }
    this._logger.log(
      LogType.INFO,
      'Logger is initialized with log level ' + logLevel,
      null
    );
  }

  public static log(level: LogType, messaage: string, object?: any) {
    this.initLogger();
    this._logger.log(level, messaage, object, null);
  }
}
