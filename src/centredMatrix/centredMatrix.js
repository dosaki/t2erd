const CentredMatrix = function(centreItem){
  _self = this;
  const _positions = [[undefined]];
  let _centre = {x:0, y:0};
  let _items {};

  const actual = (axis, axisValue) => {
    return axisValue + _centre[axis];
  };

  const fixMatrix = (x, y) => {
    const preAdjustY = actual('y', y);
    const adjustmentY = Math.abs(preAdjustY);
    if(preAdjustY < 0){
      _centre.y += Math.abs(y + _centre.y);
      for(let i = 0; i<adjustmentY; i++){
        _positions.unshift([null]);
      }
    }
    else if(preAdjustY >= _positions.length){
      for(let i = 0; i<adjustmentY - (_positions.length-1); i++){
        _positions.push([null]);
      }
    }
    const adjustedY = actual('y', y);

    const preAdjustX = actual('x', x);
    const adjustmentX = Math.abs(preAdjustX);
    if(preAdjustX < 0){
      _centre.x += Math.abs(x + _centre.x);
      for(let i = 0; i<adjustmentX; i++){
        _positions.forEach(position => {
          position.unshift(null);
        });
      }
    }
    else if(preAdjustX >= _positions[adjustedY].length){
      for(let i = 0; i<adjustmentX - (_positions[adjustedY].length-1); i++){
        _positions.forEach(position => {
          if(position.length <= preAdjustX){
            position.push(null);
          }
        });
      }
    }
  };

  const init = (centralItem) => {
    if(centreItem === undefined){
      throw new Error("Matrix needs to be initialized with a central item!")
    }
    _positions[_centre.y][_centre.x] = centreItem;
  };

  const isEmpty = (item) => {
    return !(item === undefined || item === null);
  }

  _self.includes = (item) => {
    return Object.keys(_items).includes(item);
  };

  _self.coordinatesOf = (item) => {
    return _items[item];
  };

  _self.isFree = (x, y) => {
    return isEmpty(_self.get(x, y));
  };

  _self.push = (x, y, item) => {
    fixMatrix(x, y);
    _items[item] = {x:x, y:y};
    _positions[actual('y', y)][actual('x', x)] = item;

    let existingItem = _self.get(x, y)
    if(!isEmpty(existingItem)){
      delete _items[existingItem];
    }
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

  init(centreItem);
};


module.exports = CentredMatrix;
