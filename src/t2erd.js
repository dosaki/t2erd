#!/usr/bin/env node

'use strict';

// Text to ERD
const minimist = require('minimist');
const Parser = require("./parser/parser.js");
const Diagram = require("./drawer/diagram.js");
const svgToImg = require("svg-to-img");
const fs = require('fs');

const argv = minimist(process.argv.slice(2));

const input = argv.i;
const output = argv.o;

if(!!input){
  fs.readFile(input, 'utf8', (err, data) => {
    if (err) throw err;

    const diagram = new Diagram(new Parser(data), {});
    const svgCode = diagram.toString();
    console.log(svgCode);
    (async () => {
      const image = await svgToImg.from(svgCode).toPng({
        path: output
      });
    })();
  });
}

module.exports = (inputText, params) => {
  return new Diagram(new Parser(inputText), (!!params ? params : {})).toString();
}
