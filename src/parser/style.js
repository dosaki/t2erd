const deepmerge = require('deepmerge');
const parserUtils = require("./parser_utils.js");

const Style = function(table, line){
  const _self = this;
  let _styleLines = [];
  _self.table = null;
  _self.properties = {};

  const init = (table, line) => {
    if(table !== 0 && !table){
      throw new Error(`Styles must belong to a table ${line}`);
    }
    _self.table = table;
    if(!!line){
      if(parserUtils.isInlineStyleDefinition(line.trim(), table)){
        const trimmedLines = line.trim().slice(1,-1).trim();
        _styleLines = trimmedLines.split(parserUtils.constants.STYLING_PROPERTY_DELIMITER);
      }
    }
  };

  const isValidProperty = (property) => {
    const keyValue = property.trim().split(parserUtils.constants.STYLING_PROPERTY_KEY_VALUE_DELIMITER);
    return keyValue.length == 2 && keyValue[0].trim() !== "" && keyValue[1].trim() !== "";
  }

  _self.add = (line) => {
    if(isValidProperty(line)){
      _styleLines.push(line);
    }
  }

  _self.parse = () => {
    _self.properties = {};
    _styleLines.forEach((property) => {
      if(isValidProperty(property)){
        const splitProperty = property.split(parserUtils.constants.STYLING_PROPERTY_KEY_VALUE_DELIMITER);
        _self.properties[splitProperty[0]] = splitProperty[1].replace(parserUtils.constants.STYLING_PROPERTY_DELIMITER, '');
      }
    });
    return _self;
  }

  _self.merge = (style) => {
    _self.properties = deepmerge(_self.properties, style.properties);
    return _self;
  };

  init(table, line);
}

module.exports = Style;
