const uuidv5 = require('uuid/v5');
const uuidv4 = require('uuid/v4');
const arrayUtils = require('../utils/array_utils')

const CentredMatrix = function(centreItem) {
  const _self = this;
  const _uuid_namespace = uuidv5('t2erd.dosaki.net', uuidv5.DNS)
  const _positions = [
    [undefined]
  ];
  let _centre = {
    x: 0,
    y: 0
  };
  let _items = {};

  const itemUUID = (item) => {
    if(!item.__uuid){
      item.__uuid = !!item.name ? uuidv5(item.name, _uuid_namespace) : uuidv4();
    }
    return item.__uuid
  }

  const actual = (axis, axisValue) => {
    return axisValue + _centre[axis];
  };

  const fixMatrix = (x, y) => {
    const preAdjustY = actual('y', y);
    const adjustmentY = Math.abs(preAdjustY);
    if (preAdjustY < 0) {
      _centre.y += Math.abs(y + _centre.y);
      for (let i = 0; i < adjustmentY; i++) {
        _positions.unshift([null]);
      }
    }
    else if (preAdjustY >= _positions.length) {
      for (let i = 0; i < adjustmentY - (_positions.length - 1); i++) {
        _positions.push([null]);
      }
    }
    const adjustedY = actual('y', y);

    const preAdjustX = actual('x', x);
    const adjustmentX = Math.abs(preAdjustX);
    if (preAdjustX < 0) {
      _centre.x += Math.abs(x + _centre.x);
      for (let i = 0; i < adjustmentX; i++) {
        _positions.forEach(position => {
          position.unshift(null);
        });
      }
    }
    else if (preAdjustX >= _positions[adjustedY].length) {
      for (let i = 0; i < adjustmentX - (_positions[adjustedY].length - 1); i++) {
        _positions.forEach(position => {
          if (position.length <= preAdjustX) {
            position.push(null);
          }
        });
      }
    }
  };

  const init = (centralItem) => {
    if (centreItem === undefined) {
      throw new Error("Matrix needs to be initialized with a central item!")
    }
    _positions[_centre.y][_centre.x] = centreItem;
  };

  const isEmpty = (slot) => {
    return slot === undefined || slot === null;
  }

  const nextDirection = (direction, directionMode) => {
    const radialOrder = ["up", "up-right", "right", "down-right", "down", "down-left", "left", "up-left"];
    const crossOrder = ["up", "down", "left", "right"];
    const xOrder = ["up-left", "down-right", "up-right", "down-left"];
    const towerOrder = ["up", "right", "down", "left"];
    const bishopOrder = ["up-right", "down-right", "down-left", "up-left"];

    switch(directionMode){
      case 'clockwise':
        return arrayUtils.getNext(radialOrder, direction, true);
      case 'anticlockwise':
        return arrayUtils.getNext(radialOrder.reverse(), direction, true);
      case 'cross-clockwise':
        return arrayUtils.getNext(crossOrder, direction, true);
      case 'cross-anticlockwise':
        return arrayUtils.getNext(crossOrder.reverse(), direction, true);
      case 'x-clockwise':
        return arrayUtils.getNext(xOrder, direction, true);
      case 'x-anticlockwise':
        return arrayUtils.getNext(xOrder.reverse(), direction, true);
      case 'tower-clockwise':
        return arrayUtils.getNext(towerOrder, direction, true);
      case 'tower-anticlockwise':
        return arrayUtils.getNext(towerOrder.reverse(), direction, true);
      case 'bishop-clockwise':
        return arrayUtils.getNext(bishopOrder, direction, true);
      case 'bishop-anticlockwise':
        return arrayUtils.getNext(bishopOrder.reverse(), direction, true);
      case 'straight':
      default:
        return direction;
    }
  }

  const invertedRadialMode = (directionMode) => {
    if(directionMode.indexOf('anticlockwise') > 0) {
      return directionMode.replace('anticlockwise', 'clockwise')
    }
    return directionMode.replace('clockwise', 'anticlockwise')
  }

  _self.findFreeSpotAroundItem = (item) => {
    let coords = _self.coordinatesOf(item);
    if(!coords){
      return undefined;
    }
    return _self.findFreeSpotAround(coords.x, coords.y, false);
  };

  _self.findFreeSpotAround = (x, y, inclusive) => {
    (inclusive ? [0, 1, -1] : [1, -1]).forEach(xi => {
      [0, 1, -1].forEach(yi => {
        if (_self.isFree(x + xi, y+yi)) {
          return {
            x: x + xi,
            y: y + yi
          };
        }
      });
    });
    return null;
  };

  _self.findClosestFreeSpotToItem = (item, direction, radialMode) => {
    let coords = _self.coordinatesOf(item);
    if(!coords){
      return undefined;
    }
    return _self.findClosestFreeSpot(coords.x, coords.y, direction, radialMode);
  };

  _self.findClosestFreeSpot = (x, y, initialDirection, radialMode, preserveInitial) => {
    if(!_self.isFree(x,y)){
      let direction = preserveInitial ? initialDirection : nextDirection(initialDirection, radialMode);
      switch(direction){
        case 'down':
          return _self.findClosestFreeSpot(x, y+1, direction, radialMode);
        case 'up':
          return _self.findClosestFreeSpot(x, y-1, direction, radialMode);
        case 'left':
          return _self.findClosestFreeSpot(x-1, y, direction, radialMode);
        case 'up-right':
          return _self.findClosestFreeSpot(x+1, y-1, direction, radialMode);
        case 'up-left':
          return _self.findClosestFreeSpot(x-1, y-1, direction, radialMode);
        case 'down-right':
          return _self.findClosestFreeSpot(x+1, y+1, direction, radialMode);
        case 'down-left':
          return _self.findClosestFreeSpot(x-1, y+1, direction, radialMode);
        case 'right':
        default:
          return _self.findClosestFreeSpot(x+1, y, 'right');
      }
    }
    return {x:x, y:y};
  };

  _self.items = (actual) => {
    if(!!actual){
      return Object.values(_items).map(i => i.item);
    }
    return Object.keys(_items);
  };

  _self.includes = (item) => {
    if(!item.__uuid){
      return false;
    }
    return _self.items().includes(item.__uuid);
  };

  _self.coordinatesOf = (item) => {
    if(!item.__uuid){
      return undefined;
    }
    return _items[item.__uuid];
  };

  _self.isFree = (x, y) => {
    return isEmpty(_self.get(x, y));
  };

  _self.push = (x, y, item) => {
    fixMatrix(x, y);
    _items[itemUUID(item)] = {
      x: x,
      y: y,
      item: item
    };
    let existingItem = _self.get(x, y);
    _positions[actual('y', y)][actual('x', x)] = item;

    if (!isEmpty(existingItem)) {
      delete _items[existingItem.__uuid];
    }
  };

  _self.get = (x, y) => {
    const actualY = actual('y', y);
    const actualX = actual('x', x);
    if (actualY < 0 || actualY >= _positions.length) {
      return undefined;
    }
    if (actualX < 0 || actualX >= _positions[actualY].length) {
      return undefined;
    }

    return _positions[actualY][actualX];
  };

  _self.getPlainMatrix = () => {
    return _positions;
  }

  _self.getWidth = () => {
    return _positions[0].length;
  }

  _self.getHeight = () => {
    return _positions.length;
  }

  _self.getItems = () => {
    _positions.reduce((acc, val) => acc.concat(val), []).filter((item) => item !== null);
  }

  init(centreItem);
};


module.exports = CentredMatrix;
