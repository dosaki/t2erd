const svg = require('svg-builder');

const paramUtils = require('../utils/param_utils.js');
const geometryUtils = require('../utils/geometry_utils.js');
const DiagramTable = require('./diagramTable.js');
const DiagramLayout = require('./diagramLayout.js');
const DiagramRelationship = require('./diagramRelationship.js');

const Diagram = function(parser, params){
  const _self = this;
  let _properties = {};
  let _labelFonts = {};
  let _layout = null;
  _self.svg = null;
  _self.tables = [];
  _self.connections = [];

  const preInit = function(parser, params){
    _properties = paramUtils.resolveParams(params, {
      height: "auto",
      width: "auto",
      padding: 40,
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
        margin: 45
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
    parser.relationships.forEach((connection) => {
      const table1 = _self.findDiagramTableByParsedTable(connection.table1);
      const table2 = _self.findDiagramTableByParsedTable(connection.table2);
      _self.connections.push(new DiagramRelationship(connection, table1, table2));
    });
    _layout = new DiagramLayout(_self.tables, {layoutDefinition: parser.layoutDefinition});
  };

  const init = function (parser, params) {
    preInit(parser, params);
    _self.svg = setupDrawing(_layout, _properties);
    calculatePositions(_layout, _properties, _self.svg);
    draw(_layout, _properties, _self.svg);
  };

  const calculateMaxTableDimensions = (tableOptions) => {
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

  const setupDrawing = (layout, props) => {
    const drawing = svg.newInstance();
    const maxTableDimensions = calculateMaxTableDimensions(props.tableOptions,props.padding);
    const layoutDimensions = layout.calculateDimensions(maxTableDimensions);
    drawing.width(layoutDimensions.width+props.padding).height(layoutDimensions.height+props.padding);

    return drawing;
  }

  const calculatePositions = (layout, props, drawing) => {
    const maxTableDimensions = calculateMaxTableDimensions(props.tableOptions);
    const matrix = layout.toMatrix();

    matrix.forEach((row, yi) => {
      row.forEach((table, xi) => {
        if(!!table){
          const x = xi*maxTableDimensions.width;
          const y = yi*maxTableDimensions.height;
          table.setPosition((props.padding/2) + x, (props.padding/2) + y);
        }
      });
    });

    return drawing;
  }

  const drawTables = (layout, props, drawing) => {
    const matrix = layout.toMatrix();

    matrix.forEach((row, yi) => {
      row.forEach((table, xi) => {
        if(!!table){
          const x = table.position.x;
          const y = table.position.y;
          table.draw(drawing);
          let nextColY = y + props.tableOptions.padding + table.dimensions.labelHeight*2;
          table.columns.forEach((column) => {
            column.draw(drawing, x, nextColY, props.tableOptions.padding)
            nextColY += (table.dimensions.columnLabelHeight);
          });
        }
      });
    });
  }

  const drawConnectors = (drawing) => {
    _self.connections.forEach((connection) => {
      connection.draw(drawing);
    });
  }

  const draw = (layout, props, drawing) => {
    drawConnectors(drawing);
    drawTables(layout, props, drawing);
  }

  _self.findDiagramTableByParsedTable = (parsedTable) => {
    const tables = _self.tables.filter((dTable) => {
      return dTable.getParsedTable().name === parsedTable
    });
    return tables.length > 0 ? tables[0] : null;
  }

  _self.toString = () => {
    return _self.svg.render();
  }

  init(parser, params);
};

module.exports = Diagram;
