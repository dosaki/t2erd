const svg = require('svg-builder');

const paramUtils = require('../utils/param_utils.js');
const geometryUtils = require('../utils/geometry_utils.js');
const DiagramTable = require('./diagramTable.js');
const DiagramLayout = require('./diagramLayout.js');

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
      padding: 15,
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
    _self.connections = parser.relationships;
    _layout = new DiagramLayout(_self.tables, {layoutDefinition: parser.layoutDefinition});
  };

  const init = function (parser, params) {
    preInit(parser, params);
    _self.svg = setupDrawing(_layout, _properties);
    calculatePositions(_layout, _properties, _self.svg);
    draw(_layout, _properties, _self.svg);
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

  const setupDrawing = (layout, props) => {
    const drawing = svg.newInstance();
    const maxTableDimensions = calculateMaxTableDimensions(props.tableOptions,props.padding);
    const layoutDimensions = layout.calculateDimensions(maxTableDimensions);
    drawing.width(layoutDimensions.width).height(layoutDimensions.height);

    return drawing;
  }

  const calculatePositions = (layout, props, drawing) => {
    const maxTableDimensions = calculateMaxTableDimensions(props.tableOptions,props.padding);
    const matrix = layout.toMatrix();

    matrix.forEach((row, yi) => {
      row.forEach((table, xi) => {
        if(!!table){
          const x = xi*maxTableDimensions.width;
          const y = yi*maxTableDimensions.height;
          table.setPosition(x, y);
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

  const drawConnectors = (layout, drawing) => {
    _self.connections.forEach((connection) => {
      const table1 = _self.findDiagramTableByParsedTable(connection.table1);
      const table2 = _self.findDiagramTableByParsedTable(connection.table2);
      if(!!table1 && !!table2){
        if(table1 !== table2){
          const t1pos = table1.getClosestPerimeterCoordinate(table2.getLeveledCentrePosition());
          const t2pos = table2.getClosestPerimeterCoordinate(table1.getLeveledCentrePosition());

          const slope = geometryUtils.slope(t1pos, t2pos);
          if(geometryUtils.orientation.isMostlyDiagonal(t1pos, t2pos, 0.8)){
            //This is left here for debugging purposes.
          }
          else if(geometryUtils.orientation.isMostlyVertical(t1pos, t2pos, 2)){
            const xAverage = (t1pos.x + t2pos.x)/2;
            t1pos.x = xAverage;
            t2pos.x = xAverage;
          }
          else if(geometryUtils.orientation.isMostlyHorizontal(t1pos, t2pos, 0.5)){
            const yAverage = (t1pos.y + t2pos.y)/2;
            t1pos.y = yAverage;
            t2pos.y = yAverage;
          }

          const textSize = 16;
          const t1size = connection.t1Cardinality == "*" ? textSize*1.5: textSize;
          const t2size = connection.t2Cardinality == "*" ? textSize*1.5 : textSize;

          const adjustAmount = textSize*0.8;
          const asteriskAdjustment = textSize/2;
          const x1Adjust = t2pos.x >= t1pos.x ? adjustAmount : -1 * adjustAmount;
          const y1Adjust = (t2pos.y > t1pos.y ? adjustAmount*1.5 : -1 * adjustAmount) + (connection.t1Cardinality == "*" ? asteriskAdjustment : 0);
          const x2Adjust = t1pos.x >= t2pos.x ? adjustAmount : -1 * adjustAmount;
          const y2Adjust = (t1pos.y > t2pos.y ? adjustAmount*1.5 : -1 * adjustAmount) + (connection.t2Cardinality == "*" ? asteriskAdjustment : 0);

          drawing.text({
            x: t1pos.x + x1Adjust,
            y: t1pos.y + y1Adjust,
            'font-family': 'helvetica',
            'font-size': t1size,
            stroke : "gray",
            fill: "gray"
          }, connection.t1Cardinality);

          drawing.text({
            x: t2pos.x + x2Adjust,
            y: t2pos.y + y2Adjust,
            'font-family': 'helvetica',
            'font-size': t2size,
            stroke : "gray",
            fill: "gray"
          }, connection.t2Cardinality);

          drawing.line({
            x1: t1pos.x,
            y1: t1pos.y,
            x2: t2pos.x,
            y2: t2pos.y,
            stroke:"gray"
          });
        }
      }
    });
  }

  const draw = (layout, props, drawing) => {
    drawConnectors(layout, drawing);
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
