const CentredMatrix = function(centreItem){
  _self = this;
  const _positions = [[undefined]];
  let _centre = {x:0, y:0};

  const actual = (axis, axisValue) => {
    return axisValue + _centre[axis];
  };

  const fixMatrix = (x, y) => {
    const preAdjustY = actual('y', y);
    const adjustmentY = Math.abs(preAdjustY);
    if(preAdjustY < 0){
      _centre.y += Math.abs(y + _centre.y);
      for(let i = 0; i<adjustmentY; i++){
        _positions.unshift([]);
      }
    }
    else if(preAdjustY >= _positions.length){
      for(let i = 0; i<adjustmentY; i++){
        _positions.push([]);
      }
    }
    const adjustedY = actual('y', y);

    const preAdjustX = actual('x', x);
    const adjustmentX = Math.abs(preAdjustX);
    if(preAdjustX < 0){
      _centre.x += Math.abs(x + _centre.x);
      for(let i = 0; i<adjustmentX; i++){
        _positions[adjustedY].unshift(null);
      }
    }
    else if(preAdjustX >= _positions[adjustedY].length){
      for(let i = 0; i<adjustmentX; i++){
        _positions[adjustedY].push(null);
      }
    }
  };

  const init = (centralItem) => {
    if(centreItem === undefined){
      throw new Error("Matrix needs to be initialized with a central item!")
    }
    _positions[_centre.y][_centre.x] = centreItem;
  }

  _self.push = (x, y, item) => {
    fixMatrix(x, y);
    _positions[actual('y', y)][actual('x', x)] = item;
  };

  _self.get = (x, y) => {
    const actualY = actual('y', y);
    const actualX = actual('x', x);
    if(actualY < 0 || actualY >= _positions.length){
      return undefined;
    }
    if(actualX < 0 || actualX >= _positions[actualY].length){
      return undefined;
    }

    return _positions[actualY][actualX];
  };

  _self.getPlainMatrix = () => {
    return _positions;
  }
};

module.exports = CentredMatrix;