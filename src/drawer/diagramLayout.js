const CentredMatrix = require('../centredMatrix/centredMatrix.js')

const DiagramLayout = function(tables, params){
  //TODO: Use params to let people specify their own layout
  const _tables = [];
  const _positions = new CentredMatrix(null);

  const findMostConnectedTable = (tables, excludes) => {
    let mostConnectedTable = null;
    tables.forEach(table => {
      if(!excludes.includes(table)){
        if(!mostConnectedTable
          || table.outgoingRelationships().length > mostConnectedTable.outgoingRelationships().length){
          mostConnectedTable = table;
        }
      }
    });
    return mostConnectedTable;
  };

  const resolvePositionsRelativeToTable = (mostConnectedTable) => {
    findMostConnectedTable(mostConnectedTable.outgoingRelationships(), Object.values(_positions));
  };

  const resolveRelativePositions = (tables) => {
    let mostConnectedTable = findMostConnectedTable(tables);
    _positions.push(0,0, mostConnectedTable);
    resolvePositionsRelativeToTable(mostConnectedTable);
    // const otherTables = tables.filter(table => table !== mostConnectedTable);
  };

  const init = (tables) => {
    _tables = tables;
  }

  init(tables);
};

module.exports = DiagramLayout;
