var PropertiesReader = require('properties-reader');
var shell = require('shelljs');
var fs = require('fs');

var properties = PropertiesReader('./../.properties');
var env = properties.path().env;
if (!env || env !== 'prod') {
  env = 'dev';
}
if (env === 'prod') {
  shell.echo(
    'Starting server, please refer the log file for further information'
  );
  shell.exec('node prod');
  shell.echo('Server stopped!');
} else {
  shell.echo(
    'You can not run the build in dev mode, change env=prod in .properties file, and also verify all other properties'
  );
}
