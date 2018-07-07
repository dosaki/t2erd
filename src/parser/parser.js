const parseUtils = require("./parser_utils.js");
const Table = require("./table.js")
const Relationship = require("./relationship.js")

const Parser = function(text){
  const _self = this;

  let currentTable = null;
  _self.tables = [];
  _self.relationships = [];
  _self.layoutDefinition = []

  const parse = function(text) {
    const lines = text.split('\n');

    lines.forEach(function(rawLine){
      const lineWithComments = rawLine.trim();
      if(!parseUtils.isCommentLine(lineWithComments)){
        const line = parseUtils.stripComments(lineWithComments);
        if(parseUtils.isTableNameDefinition(line)){
          currentTable = new Table(line);
          _self.tables.push(currentTable);
        }
        else if(parseUtils.isRelationship(line)){
          _self.relationships.push(new Relationship(line));
        }
        else if(parseUtils.isLayoutLine(line)){
          _self.layoutDefinition.push(line.slice(1,-1).trim().split(parseUtils.constants.LAYOUT_LINE))
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

  _self.layoutIsDefined = () => {
    return _self.layoutLines.length > 0;
  }

  init(text);
};

module.exports = Parser;
