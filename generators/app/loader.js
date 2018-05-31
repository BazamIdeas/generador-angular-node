const fs = require('fs');
const path = require('path');

const dir = __dirname + '/templates/';

const isDir = source => {
  return fs.lstatSync(source).isDirectory();
};

let dirs = [];

const getDirectories = source => {
  fs.readdirSync(source).forEach(name => {
    if (isDir(path.join(source, name))) {
      getDirectories(path.join(source, name));
    } else {
      dirs.push(path.join(source, name).split('templates\\')[1]);
    }
  });
};

getDirectories(dir);

module.exports = dirs;
