const pixelDimensions = require('../utils/dimension_utils.js');
const paramUtils = require('../utils/param_utils.js');
const DiagramColumn = require('./diagramColumn.js');

const DiagramTable = function(table, tableOptions, fontOptions){
  const _self = this;
  let _table = null;
  let _options = null;
  _self.dimensions = null;
  _self.position = null;
  _self.title = null;
  _self.columns = null

  const init = function (table, tableOptions, fontOptions) {
    _table = table;
    _options = tableOptions;
    _fonts = fontOptions;
    _self.name = table.name;
    _self.dimensions = calculateDimensions();
    _self.position = {
      x: !!tableOptions.x && !paramUtils.isAuto(tableOptions.x) ? tableOptions.x : null,
      y: !!tableOptions.y && !paramUtils.isAuto(tableOptions.y) ? tableOptions.y : null
    };
    _self.columns = [];
    table.columns.forEach((column) => {
      _self.columns.push(new DiagramColumn(column, _self, fontOptions));
    });
  };

  const findLongestName = () => {
    let longest = _table.name.length;
    let name = _table.name;
    _table.columns.forEach((column) => {
      if(column.name.length > longest){
        name = column.name;
        longest = column.name.length;
      }
    });

    return name;
  };

  const calculateDimensions = () => {
    const maxWidth = Math.max(pixelDimensions(_table.name, _fonts.table).width, pixelDimensions(findLongestName(_table), _fonts.column).width)
    return {
      width: !!_options.width && !paramUtils.isAuto(_options.width) ? _options.width : ((_options.padding*2) + maxWidth),
      height: !!_options.height && !paramUtils.isAuto(_options.height) ? _options.height : ((_options.padding*2) + pixelDimensions("O", _fonts.table).height + (pixelDimensions("O", _fonts.primaryKey).height*_table.columns.length)), //can cheat because we're using a monospace font.
      labelHeight: pixelDimensions("O", _fonts.table).height,
      columnLabelHeight: pixelDimensions("O", _fonts.primaryKey).height
    };
  };

  _self.getParsedTable = () => {
    return _table;
  };

  _self.draw = (drawing, x, y) => {
    const _x = !!_self.position.x ? _self.position.x : x;
    const _y = !!_self.position.y ? _self.position.y : y
    drawing.rect({
      x: _x,
      y: _y,
      width: _self.dimensions.width,
      height: _self.dimensions.height,
      rx: _options.radius,
      ry: _options.radius,
      fill: "white",
      stroke: "gray"
    });

    let colY = _y + _options.padding*1.5;
    drawing.text({
      x: _x + _options.padding,
      y: colY,
      'font-family': _fonts.table.font,
      'font-size': _fonts.table.size,
      fill: "black",
      stroke: _fonts.table.bold ? "black" : "none"
    }, _self.name);
    drawing.line({
      x1: _x,
      y1: colY + (_self.dimensions.labelHeight*0.75),
      x2: _x + _self.dimensions.width,
      y2: colY + (_self.dimensions.labelHeight*0.75),
      stroke:"gray"
    });
  };

  init(table, tableOptions, fontOptions);
};

module.exports = DiagramTable;
