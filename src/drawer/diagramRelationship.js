const pixelDimensions = require('../utils/dimension_utils.js');
const paramUtils = require('../utils/param_utils.js');
const geometryUtils = require('../utils/geometry_utils.js');
const DiagramColumn = require('./diagramColumn.js');

const DiagramRelationship = function(relationship, table1, table2) {
  const _self = this;
  let _t1 = null;
  let _t2 = null;
  _self.connection = null;
  _self.relationship = null;

  const resolveCoordinates = (t1pos, t2pos, adjust) => {
    const slope = geometryUtils.slope(t1pos, t2pos);

    if(!!adjust){
      if (geometryUtils.orientation.isMostlyDiagonal(t1pos, t2pos, 0.8)) {
        //This is left here for debugging purposes.
      }
      else if (geometryUtils.orientation.isMostlyVertical(t1pos, t2pos, 2)) {
        const xAverage = (t1pos.x + t2pos.x) / 2;
        t1pos.x = xAverage;
        t2pos.x = xAverage;
      }
      else if (geometryUtils.orientation.isMostlyHorizontal(t1pos, t2pos, 0.5)) {
        const yAverage = (t1pos.y + t2pos.y) / 2;
        t1pos.y = yAverage;
        t2pos.y = yAverage;
      }
    }

    return {
      t1: t1pos,
      t2: t2pos
    }
  };

  const calculateTextProperties = (cardinality, t1pos, t2pos) => {
    const textSize = 16;
    const adjustAmount = textSize * 0.8;
    const asteriskAdjustment = textSize / 2;
    return {
      x: t1pos.x + (t2pos.x >= t1pos.x ? adjustAmount : -1.5 * adjustAmount),
      y: t1pos.y + ((t2pos.y > t1pos.y ? adjustAmount * 1.5 : -1 * adjustAmount) + (cardinality == "*" ? asteriskAdjustment : 0)),
      size: cardinality == "*" ? textSize * 1.5 : textSize
    }
  };

  const init = (relationship, table1, table2) => {
    _self.connection = relationship;
    _t1 = table1;
    _t2 = table2;
  };

  _self.draw = (drawing) => {
    if (!!_t1 && !!_t2) {
      const t1RawPos = _t1.getLeveledCentrePosition();
      const t2RawPos = _t2.getLeveledCentrePosition();
      if (_self.isSelfReferential()) {
        t1RawPos.x += -1000;
        t2RawPos.y += -1000;
      }
      const coordinates = resolveCoordinates(_t1.getClosestPerimeterCoordinate(t2RawPos), _t2.getClosestPerimeterCoordinate(t1RawPos), !_self.isSelfReferential());
      const t1pos = _self.isSelfReferential() ? {x: coordinates.t1.x - 20, y:coordinates.t1.y} : coordinates.t1;
      const t2pos = _self.isSelfReferential() ? {x: coordinates.t2.x, y:coordinates.t2.y - 10} : coordinates.t2;
      const t1Text = calculateTextProperties(_self.connection.t1Cardinality, t1pos, t2pos);
      const t2Text = calculateTextProperties(_self.connection.t2Cardinality, t2pos, t1pos);

      drawing.text({
        x: t1Text.x + (_self.isSelfReferential() ? -27 : 0),
        y: t1Text.y + (_self.isSelfReferential() ? 10 : 0),
        'font-family': 'Andale Mono',
        'font-size': t1Text.size,
        stroke: "gray",
        fill: "gray"
      }, _self.connection.t1Cardinality);

      drawing.text({
        x: t2Text.x + (_self.isSelfReferential() ? 20 : 0),
        y: t2Text.y + (_self.isSelfReferential() ? -5 : 0),
        'font-family': 'Andale Mono',
        'font-size': t2Text.size,
        stroke: "gray",
        fill: "gray"
      }, _self.connection.t2Cardinality);

      if (_self.isSelfReferential()) {
        drawing.line({
          x1: t2pos.x,
          y1: t2pos.y,
          x2: t2pos.x - 20,
          y2: t2pos.y,
          stroke: "gray"
        }).line({
          x1: t2pos.x - 20,
          y1: t2pos.y,
          x2: t2pos.x - 20,
          y2: t1pos.y - 20,
          stroke: "gray"
        }).line({
          x1: t2pos.x - 20,
          y1: t1pos.y - 20,
          x2: t1pos.x,
          y2: t1pos.y - 20,
          stroke: "gray"
        }).line({
          x1: t1pos.x,
          y1: t1pos.y - 20,
          x2: t1pos.x,
          y2: t1pos.y,
          stroke: "gray"
        });
      }
      else{
        drawing.line({
          x1: t1pos.x,
          y1: t1pos.y,
          x2: t2pos.x,
          y2: t2pos.y,
          stroke: "gray"
        });
      }
    }
  }

  _self.isSelfReferential = () => {
    return _t1 === _t2;
  }

  init(relationship, table1, table2);
};

module.exports = DiagramRelationship;
