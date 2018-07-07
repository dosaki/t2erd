const CentredMatrix = require('../centredMatrix/centredMatrix.js')

const DiagramLayout = function(tables, params){
  const _self = this;
  const _layout = new CentredMatrix(null);
  let _tables = [];

  const findMostConnectedTable = (tables, excludes) => {
    let mostConnectedTable = null;
    const _excludes = !!excludes ? excludes : [];
    tables.forEach(table => {
      if(!_excludes.includes(table)){
        if(!mostConnectedTable
          || table.outgoingRelationshipTables(tables).length > mostConnectedTable.outgoingRelationshipTables(tables).length){
          mostConnectedTable = table;
        }
      }
    });
    return mostConnectedTable;
  };

  const resolveConnectedTables = (mostConnectedTable, tables) => {
    let table = findMostConnectedTable(mostConnectedTable.outgoingRelationshipTables(tables), _layout);
    while(!!table){
      const freeSpot = _layout.findClosestFreeSpotToItem(mostConnectedTable, "right", "cross-clockwise", true);
      if(!freeSpot){
        throw new Error("ERROR: Unable to find a nearby free spot!");
      }
      _layout.push(freeSpot.x, freeSpot.y, table);
      resolveConnectedTables(table);
      table = findMostConnectedTable(mostConnectedTable.outgoingRelationshipTables(tables), _layout);
    }
  };

  const resolveRelativePositions = (tables) => {
    let mostConnectedTable = findMostConnectedTable(tables);
    let coords = _layout.findClosestFreeSpot(0,0);

    _layout.push(coords.x,coords.y, mostConnectedTable);
    resolveConnectedTables(mostConnectedTable, tables);

    const otherTables = tables.filter(table => !_layout.includes(table));
    if(!!otherTables && otherTables.length > 0){
      resolveRelativePositions(otherTables);
    }
  };

  const init = (tables, params) => {
    _tables = tables;
    if(!!params && !!params.layoutDefinition && params.layoutDefinition.length > 0){
      params.layoutDefinition.forEach((row, yind) => {
        row.forEach((nameOrAlias, xind) => {
          const table = _tables.filter((table) => {
            return table.name === nameOrAlias || table.alias === nameOrAlias;
          });
          if(table.length > 1){
            throw new Error(`Duplicate table name or alias reference: "${nameOrAlias}"!`)
          }
          else if(table.length === 1){
            _layout.push(xind, yind, table[0]);
          }
        });
      });
    }
    else {
      resolveRelativePositions(_tables);
    }
  };

  _self.calculateDimensions = (maxTableDimensions) => {
    return {
      width: _layout.getWidth() * maxTableDimensions.width,
      height: _layout.getHeight() * maxTableDimensions.height
    };
  };

  _self.asString = (detailed) => {
    let matrix = _layout.getPlainMatrix();
    let printMatrix = [[]];
    for(let xi=0; xi<matrix[0].length; xi++){
      for(let yi=0; yi<matrix.length; yi++){
        if(!printMatrix[yi]){
          printMatrix[yi] = []
        }
        const item = matrix[yi][xi];
        printMatrix[yi][xi] = (!!item ? (detailed ? item.toString() : "O") : " ")
      }
    }

    let toPrint = [];
    for(let yi=0; yi<printMatrix.length; yi++){
        toPrint.push(printMatrix[yi].join(' | '))
    }
    return toPrint.join('\n');
  };

  _self.toMatrix = () => {
    return _layout.getPlainMatrix();
  };

  _self.getAllTables = () => {
    return _tables;
  }

  init(tables, params);
};

module.exports = DiagramLayout;
