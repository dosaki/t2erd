#!/usr/bin/env node

'use strict';

// Text to ERD
const minimist = require('minimist');
const Parser = require("./parser/parser.js");
const Diagram = require("./drawer/diagram.js");
const fs = require('fs');

const argv = minimist(process.argv.slice(2));
const input = argv.i;

if(!!input){
  fs.readFile(input, 'utf8', (err, data) => {
    if (err) throw err;

    const diagram = new Diagram(new Parser(data), {});
    const svgCode = diagram.toString();
    console.log(svgCode);
  });
}

module.exports = (inputText, params) => {
  return new Diagram(new Parser(inputText), (!!params ? params : {})).toString();
}
