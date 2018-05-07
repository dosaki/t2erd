const parserUtils = require("../utils/parser_utils.js");

const Relationship = function(line){
  const _self = this;

  _self.connector = null;
  _self.table1 = null;
  _self.table2 = null;
  _self.leftCardinality = null;
  _self.rightCardinality = null;

  const init = (line) => {
    _self.connector = parserUtils.findRelationshipLine(line);
    if(!_self.connector){
      throw new Error(`Unable to find a connector in ${line}`);
    }

    _self.table1 = line.split(_self.connector)[0];
    _self.table2 = line.split(_self.connector)[1];
    _self.leftCardinality = _self.connector.split(parserUtils.constants.RELATIONSHIP_LINE)[0];
    _self.rightCardinality = _self.connector.split(parserUtils.constants.RELATIONSHIP_LINE)[1];
  };


  init(line);
}


module.exports = Relationship;
