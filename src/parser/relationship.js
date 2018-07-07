const parserUtils = require("./parser_utils.js");

const Relationship = function(line){
  const _self = this;

  _self.connector = null;
  _self.table1 = null;
  _self.table2 = null;
  _self.t1Cardinality = null;
  _self.t2Cardinality = null;

  const init = (line) => {
    _self.connector = parserUtils.findRelationshipLine(line);
    if(!_self.connector){
      throw new Error(`Unable to find a connector in ${line}`);
    }

    _self.table1 = line.split(_self.connector)[0];
    _self.table2 = line.split(_self.connector)[1];
    _self.t1Cardinality = _self.connector.split(parserUtils.constants.RELATIONSHIP_LINE)[0].trim();
    _self.t2Cardinality = _self.connector.split(parserUtils.constants.RELATIONSHIP_LINE)[1].trim();
  };

  _self.equals = (connector) => {
    return connector.table1 === _self.table1
      && connector.table2 === _self.table2
      && connector.t1Cardinality === _self.t1Cardinality
      && connector.t2Cardinality === _self.t2Cardinality
  }

  init(line);
}


module.exports = Relationship;
