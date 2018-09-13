import fs from 'fs';
import util from 'util';

export default class TextUtils {
  static generateHooksTemplate(alias: string, tableName: string) {
    const hooksTemplate = 'src/core/hooks_template.txt';
    const storeBuffer: Buffer = fs.readFileSync(hooksTemplate);
    let script = storeBuffer.toString('utf8', 0, storeBuffer.length);
    return util.format(
      script,
      tableName,
      tableName,
      alias,
      tableName,
      tableName,
      tableName,
      tableName,
      tableName,
      tableName,
      tableName,
      tableName,
      tableName,
      tableName,
      tableName,
      tableName,
      tableName,
      tableName
    );
  }

  static concat(files: any, destination: string, cb: Function) {
    var async = require('async');

    async.waterfall(
      [
        async.apply(TextUtils.read, files),
        async.apply(TextUtils.write, destination)
      ],
      cb
    );
  }

  static write(destination: string, buffers: any, cb: Function) {
    require('fs').writeFile(destination, Buffer.concat(buffers), cb);
  }

  static read(files: any, cb: Function) {
    require('async').mapSeries(files, TextUtils.readFile, cb);
  }
  static readFile(file: any, cb: Function) {
    require('fs').readFile(file, cb);
  }
}
