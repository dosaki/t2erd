const parseUtils = require("../utils/parser_utils.js");
const Table = require("./table.js")
const Relationship = require("./relationship.js")

const Parser = function(text){
  const _self = this;

  let currentTable = null;
  _self.tables = [];
  _self.relationships = [];

  const parse = function(text) {
    const lines = text.split('\n');

    lines.forEach(function(rawLine){
      const line = rawLine.trim();
      if(!parseUtils.isCommentLine(line)){
        if(parseUtils.isTableNameDefinition(line)){
          currentTable = new Table(line);
          _self.tables.push(currentTable);
        }
        else if(parseUtils.isRelationship(line)){
          _self.relationships.push(new Relationship(line));
        }
        else if(parseUtils.isColumn(line, currentTable)){
          currentTable.addColumn(line)
        }
        else {
          console.warn(`Unable to determine what this line is: ${line}`);
        }
      }
    });
  };

  const init = function (text) {
    parse(text);
  };

  init(text);
};

module.exports = Parser;
