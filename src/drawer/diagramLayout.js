const CentredMatrix = require('../centredMatrix/centredMatrix.js')

const DiagramLayout = function(tables, params){
  //TODO: Use params to let people specify their own layout
  const _tables = [];
  const _positions = new CentredMatrix();
  let _centre = {x:0, y:0};

  const addToPositions = (item, x, y) => {
    if(x + _centre.x < 0){
      _centre.x += Math.abs(x + _centre.x);
    }
    if(y + _centre.y < 0){
      _centre.y += Math.abs(y + _centre.y);
    }
    let actualX = x + _centre.x;
    let actualY = y + _centre.y

    if(_positions){

    }
  }

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
    _positions[0](mostConnectedTable);
    findMostConnectedTable(mostConnectedTable.outgoingRelationships(), Object.values(_positions));

  };

  const resolveRelativePositions = (tables) => {
    let positions = resolvePositionsRelativeToTable(findMostConnectedTable(tables));

    // const otherTables = tables.filter(table => table !== mostConnectedTable);
  };

  const init = (tables) => {
    _tables = tables;
  }

  init(tables);
};

module.exports = DiagramLayout;
