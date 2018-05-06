const parserUtils = require("./utils/parser_utils.js");
const Column = require("./column.js");

const Table = function(line){
  const _self = this;

  _self.name = null;
  _self.columns = [];

  _self.addColumn = (line) => {
    _self.columns.push(new Column(line, _self));
  };

  const init = (line) => {
    if(!parserUtils.isTableNameDefinition(line)){
      throw new Error(`Could not find a table name in ${line}`);
    }
    _self.name = line.slice(1,-1);
    if(!_self.name){
      throw new Error(`Derived an empty name from ${line}`);
    }
  };


  init(line);
};


module.exports = Table;
