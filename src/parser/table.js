const parserUtils = require("./parser_utils.js");
const Column = require("./column.js");

const Table = function(line){
  const _self = this;

  _self.name = null;
  _self.alias = null;
  _self.columns = [];

  _self.addColumn = (line) => {
    _self.columns.push(new Column(line, _self));
  };

  const init = (line) => {
    if(!parserUtils.isTableNameDefinition(line)){
      throw new Error(`Could not find a table name in ${line}`);
    }
    let title = line.split(parserUtils.constants.TABLE_ALIAS_SEPARATOR)
    _self.name = title[0].trim().slice(1,-1).trim();
    if(title.length > 1){
      _self.alias = title[1].trim();
    }
    if(!_self.name){
      throw new Error(`Derived an empty name from ${line}`);
    }
  };


  init(line);
};


module.exports = Table;
