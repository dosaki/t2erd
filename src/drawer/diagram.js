const svg = require('svg-builder');
const pixelWidth = require('string-pixel-width');

const Diagram = function(parser, params){
  const _self = this;
  const prop = (property, defaultValue) => {
    return (!!property || property === 0) ? property : defaultValue;
  };
  const properties = {
    height: prop(params.height, "auto"),
    width: prop(params.width, "auto"),
    padding: prop(params.padding, 10),
    fontOptions: prop(params.fontOptions, {
      font: 'Andale Mono',
      size: 12
    }),
    tableOptions: prop(params.tableOptions, {
      padding: 15,
      radius: 15,
      margin: 15
    })
  };

  const labelFonts = {
    table: {
      font: properties.fontOptions.font,
      size: properties.fontOptions.size * 1.4,
      bold: true,
      underlined: false
    },
    column: {
      font: properties.fontOptions.font,
      size: properties.fontOptions.size,
      bold: false,
      underlined: false
    },
    primaryKey: {
      font: properties.fontOptions.font,
      size: properties.fontOptions.size,
      bold: true,
      underlined: false
    },
    foreignKey: {
      font: properties.fontOptions.font,
      size: properties.fontOptions.size,
      bold: false,
      underlined: true
    }
  }

  _self.svg = null;

  const findLongestName = (table) => {
    let longest = table.name.length;
    let name = table.name;
    table.columns.forEach((column) => {
      if(column.name.length > longest){
        name = column.name;
        longest = column.name.length;
      }
    });

    return name;
  }

  const calculateDimensions = (tables, tableOptions, padding, font) => {
    const dimensions = {
      drawing:{
        width: padding*2,
        height: padding*2
      },
      tables:{}
    }
    tables.forEach((table) => {
      const tableDimensions = {
        width: (tableOptions.padding*2) + pixelWidth(table.name, labelFonts.table) + pixelWidth(findLongestName(table), labelFonts.column),
        height: (tableOptions.padding*2) + pixelWidth("O", labelFonts.table) + ((pixelWidth("O", labelFonts.primaryKey)*table.columns.length)), //can cheat because we're using a monospace font.
        labelHeight: pixelWidth("O", labelFonts.table),
        columnLabelHeight: pixelWidth("O", labelFonts.primaryKey)
      };
      tableDimensions.width += tableOptions.padding*2;
      tableDimensions.height += tableOptions.padding*2;
      dimensions.drawing.width += tableDimensions.width + (tableOptions.margin * 2);
      dimensions.drawing.height = Math.max((tableDimensions.height * table.columns.length) + (tableOptions.margin * 2), dimensions.drawing.height);
      dimensions.tables[table.name] = tableDimensions;
    });

    return dimensions;
  }

  const draw = (parser, props) => {
    const columnGapRatio = 2;
    let drawing = svg.newInstance();

    const dimensions = calculateDimensions(
      parser.tables,
      props.tableOptions,
      props.padding,
      props.fontOptions);

    drawing.width(dimensions.drawing.width).height(dimensions.drawing.height);

    let nextX = props.padding + props.tableOptions.margin;
    let nextY = props.padding + props.tableOptions.margin;
    parser.tables.forEach((table) => {
      const tableDimensions = dimensions.tables[table.name];
      drawing.rect({
        x: nextX,
        y: nextY,
        width: tableDimensions.width,
        height: tableDimensions.height,
        rx: props.tableOptions.radius,
        ry: props.tableOptions.radius,
        fill: "white",
        stroke: "gray"
      });

      let nextColY = nextY + props.tableOptions.padding;
      drawing.text({
        x: nextX + props.tableOptions.padding,
        y: nextColY,
        'font-family': labelFonts.table.font,
        'font-size': labelFonts.table.size,
        fill: "black",
        stroke: labelFonts.table.bold ? "black" : "none"
      }, table.name);
      drawing.line({
        x1: nextX,
        y1: nextColY + (dimensions.tables[table.name].labelHeight/2),
        x2: nextX + tableDimensions.width,
        y2: nextColY + (dimensions.tables[table.name].labelHeight/2),
        stroke:"black"
      });
      nextColY += (dimensions.tables[table.name].labelHeight*columnGapRatio);

      table.columns.forEach((column) => {
        let font = column.isPrimaryKey ? (labelFonts.primaryKey) : (column.isForeignKey ? labelFonts.foreignKey : labelFonts.column);
        drawing.text({
          x: nextX + props.tableOptions.padding,
          y: nextColY,
          'font-family': font.font,
          'font-size': font.size,
          fill: "black",
          stroke: font.bold ? "black" : "none"
        }, column.name);
        if(font.underlined){
          drawing.line({
            x1: nextX + props.tableOptions.padding,
            y1: nextColY + (dimensions.tables[table.name].columnLabelHeight/2),
            x2: nextX + pixelWidth(column.name, font),
            y2: nextColY + (dimensions.tables[table.name].columnLabelHeight/2),
            stroke:"black"
          });
        }
        nextColY += (dimensions.tables[table.name].columnLabelHeight*columnGapRatio);
      })
      nextX += tableDimensions.width + props.tableOptions.margin;
      // nextY += tableDimensions.height + props.tableOptions.margin;
    });

    return drawing;
  }

  const init = function (parser, properties) {
    _self.svg = draw(parser, properties);
  };

  _self.toString = () => {
    return _self.svg.render();
  }

  init(parser, properties);
};

module.exports = Diagram;
