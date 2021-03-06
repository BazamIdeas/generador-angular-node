'use strict';

const fs   = require("fs");
const path = require("path");

const files = fs.readdirSync(__dirname);

files.forEach(file => {
	let name = path.basename(file, ".js");
	if (name !== "index") { exports[name] = require(`./${name}`); }
});