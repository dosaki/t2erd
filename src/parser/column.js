const parserUtils = require("./utils/parser_utils.js");

const Column = function(line, table){
  const _self = this;

  _self.name = null;
  _self.isPrimaryKey = null;
  _self.isForeignKey = null;
  _self.table = null;


  const init = (line, table) => {
    if(!table){
      throw new Error(`Cannot have a column without a table!`);
    }

    _self.table = table;
    _self.isPrimaryKey = line.startsWith(parserUtils.constants.KEY_INDICATOR.primary);
    _self.isForeignKey = line.startsWith(parserUtils.constants.KEY_INDICATOR.foreign);

    _self.name = (_self.isPrimaryKey || _self.isForeignKey) ? line.slice(1, line.length) : line;
  };


  init(line, table);
};


module.exports = Column;
