const svg = require('svg-builder');

const paramUtils = require('../utils/param_utils.js');
const DiagramTable = require('./diagramTable.js');
const DiagramLayout = require('./diagramLayout.js');

const Diagram = function(parser, params){
  const _self = this;
  let _properties = {};
  let _labelFonts = {};
  _self.svg = null;
  _self.tables = [];

  const preInit = function(parser, params){
    _properties = paramUtils.resolveParams(params, {
      height: "auto",
      width: "auto",
      padding: 10,
      fontOptions: {
        font: 'Andale Mono',
        size: 12
      },
      tableOptions: {
        x: "auto",
        y: "auto",
        width: "auto",
        height: "auto",
        padding: 15,
        radius: 5,
        margin: 15
      }
    });
    _labelFonts = {
      table: {
        font: _properties.fontOptions.font,
        size: _properties.fontOptions.size * 1.4,
        bold: true,
        underlined: false
      },
      column: {
        font: _properties.fontOptions.font,
        size: _properties.fontOptions.size,
        bold: false,
        underlined: false
      },
      primaryKey: {
        font: _properties.fontOptions.font,
        size: _properties.fontOptions.size,
        bold: true,
        underlined: false
      },
      foreignKey: {
        font: _properties.fontOptions.font,
        size: _properties.fontOptions.size,
        bold: false,
        underlined: true
      }
    };
    parser.tables.forEach((table) => {
      _self.tables.push(new DiagramTable(table, parser.relationships, _properties.tableOptions, _labelFonts));
    });
  };

  const init = function (parser, params) {
    preInit(parser, params);
    const layout = new DiagramLayout(_self.tables);
    // _self.svg = draw(_properties);
    _self.svg = drawWithLayout(layout, _properties)
  };

  const calculateDimensions = (tableOptions, padding) => {
    const dimensions = {
      drawing:{
        width: padding*2,
        height: padding*2
      }
    }
    _self.tables.forEach((table) => {
      dimensions.drawing.width += table.dimensions.width + (tableOptions.margin * 2);
      dimensions.drawing.height = Math.max((table.dimensions.height * table.getParsedTable().columns.length) + (tableOptions.margin * 2), dimensions.drawing.height);
    });

    return dimensions;
  };

  const calculateMaxTableDimensions = (tableOptions, padding) => {
    const maxTableDimensions = {
      width: 0,
      height: 0
    };
    _self.tables.forEach((table) => {
      maxTableDimensions.width = Math.max(maxTableDimensions.width, table.dimensions.width + (tableOptions.margin * 2));
      maxTableDimensions.height = Math.max(maxTableDimensions.height, table.dimensions.height + (tableOptions.margin * 2));
    });

    return maxTableDimensions;
  };

  const drawWithLayout = (layout, props) => {
    const drawing = svg.newInstance();
    const maxTableDimensions = calculateMaxTableDimensions(props.tableOptions,props.padding);
    const layoutDimensions = layout.calculateDimensions(maxTableDimensions);
    drawing.width(layoutDimensions.width).height(layoutDimensions.height);
    console.log(maxTableDimensions);
    const matrix = layout.toMatrix();

    matrix.forEach((row, yi) => {
      row.forEach((table, xi) => {
        if(!!table){
          const x = xi*maxTableDimensions.width;
          const y = yi*maxTableDimensions.height;
          table.draw(drawing, x, y);

          let nextColY = y + props.tableOptions.padding + table.dimensions.labelHeight*2;
          table.columns.forEach((column) => {
            column.draw(drawing, x, nextColY, props.tableOptions.padding)
            nextColY += (table.dimensions.columnLabelHeight);
          });
        }
      });
    });

    return drawing;
  }

  const draw = (props) => {
    let drawing = svg.newInstance();
    const dimensions = calculateDimensions(props.tableOptions,props.padding);

    drawing.width(dimensions.drawing.width).height(dimensions.drawing.height);

    let nextX = props.padding + props.tableOptions.margin;
    let nextY = props.padding + props.tableOptions.margin;
    _self.tables.forEach((table) => {
      table.draw(drawing, nextX, nextY);

      let nextColY = nextY + props.tableOptions.padding + table.dimensions.labelHeight*2;
      table.columns.forEach((column) => {
        column.draw(drawing, nextX, nextColY, props.tableOptions.padding)
        nextColY += (table.dimensions.columnLabelHeight);
      })
      nextX += table.dimensions.width + props.tableOptions.margin;
      // nextY += table.dimensions.height + props.tableOptions.margin;
    });

    return drawing;
  }

  _self.toString = () => {
    return _self.svg.render();
  }

  init(parser, params);
};

module.exports = Diagram;
