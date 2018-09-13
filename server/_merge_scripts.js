function concat(files, destination, cb) {
  var async = require('async');

  async.waterfall(
    [async.apply(read, files), async.apply(write, destination)],
    cb
  );
}

function write(destination, buffers, cb) {
  require('fs').writeFile(destination, Buffer.concat(buffers), cb);
}

function read(files, cb) {
  require('async').mapSeries(files, readFile, cb);

  function readFile(file, cb) {
    require('fs').readFile(file, cb);
  }
}

concat(
  [
    './scripts/sales.sql',
    './scripts/projects.sql',
    './scripts/countries.sql',
    './scripts/states.sql'
  ],
  './../iapp/scripts/script.sql',
  function(err) {
    if (err) throw err;
    console.log('Scripts megred & copied');
  }
);
