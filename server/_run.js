var PropertiesReader = require('properties-reader');
var shell = require('shelljs');
var fs = require('fs');

var properties = PropertiesReader('./../server/.properties');
var env = properties.path().env;
if (!env || env !== 'prod') {
  env = 'dev';
}
if (env === 'prod') {
  shell.echo('Configuring for prod mode please wait...');
  if (
    !(
      fs.existsSync('./../server/dist') &&
      fs.existsSync('./../server/dist/index.js') &&
      fs.existsSync('./../server/public')
    )
  ) {
    shell.echo(
      'It seems that you have not build the source yet, please execute build-prod.sh under bin folder!'
    );
    shell.exit(0);
  }
  shell.exec('cd ./../server && npm run prod');
  shell.echo('App is in running in prod mode');
} else {
  shell.echo(
    'App is in running in dev mode,' +
      'to run production build, change env = prod in .properties file'
  );
  shell.exec('cd ./../server && npm run dev');
  shell.exec('cd ./../client && npm run start');
}
