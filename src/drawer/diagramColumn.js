const pixelDimensions = require('../utils/dimension_utils.js');

const DiagramColumn = function(parsedColumn, table, fontOptions, style){
  const _self = this;
  let _column = null;
  let _table = null;
  let _font = null;
  let _style = null;
  _self.name = null;

  const init = function (parsedColumn, table, fontOptions, style) {
    _column = parsedColumn;
    _table = table;
    _font = parsedColumn.isPrimaryKey ? (fontOptions.primaryKey) : (parsedColumn.isForeignKey ? fontOptions.foreignKey : fontOptions.column);
    _style = style;
    _self.name = parsedColumn.name;
  };

  _self.draw = (drawing, x, y, padding) => {
    const textColour = (_style && _style.properties && _style.properties.color) || "black"
    drawing.text({
      x: x + padding,
      y: y,
      'font-family': _font.font,
      'font-size': _font.size,
      fill: textColour,
      stroke: _font.bold ? textColour : "none"
    }, _self.name);
    if(_font.underlined){
      drawing.line({
        x1: x + padding,
        y1: y + (_table.dimensions.columnLabelHeight/3) - 2,
        x2: x + pixelDimensions(_self.name, _font).width,
        y2: y + (_table.dimensions.columnLabelHeight/3) - 2,
        stroke: textColour
      });
    }
  }

  init(parsedColumn, table, fontOptions, style);
}

module.exports = DiagramColumn;
