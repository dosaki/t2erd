const assert = require('assert');
const CentredMatrix = require("../src/centredMatrix/centredMatrix.js");

describe('CentredMatrix', function() {
  it('should get undefined', function() {
    const matrix = new CentredMatrix();
    assert.equal(matrix.get(0,0), undefined);
  });
  it('should expand to fit new elements', function() {
    const matrix = new CentredMatrix();
    matrix.push(0,0,   "Centre");
    matrix.push(1,0,   "Right");
    matrix.push(-1,0,  "Left");
    matrix.push(0,1,   "Bottom");
    matrix.push(1,1,   "Bottom Right");
    matrix.push(-1,1,  "Bottom Left");
    matrix.push(0,-1,  "Top");
    matrix.push(1,-1,  "Top Right");
    matrix.push(-1,-1, "Top Left");
    assert.equal(matrix.get(0,0),   "Centre");
    assert.equal(matrix.get(1,0),   "Right");
    assert.equal(matrix.get(-1,0),  "Left");
    assert.equal(matrix.get(0,1),   "Bottom");
    assert.equal(matrix.get(1,1),   "Bottom Right");
    assert.equal(matrix.get(-1,1),  "Bottom Left");
    assert.equal(matrix.get(0,-1),  "Top");
    assert.equal(matrix.get(1,-1),  "Top Right");
    assert.equal(matrix.get(-1,-1), "Top Left");
  });
  it('should not have extra spaces unless they were previously created', function() {
    const matrix = new CentredMatrix();
    matrix.push(0,-1,  "Top");
    matrix.push(1,0,   "Right");
    matrix.push(1,-1,  "Top Right");
    matrix.push(0,0,   "Centre");
    matrix.push(-1,0,  "Left");
    matrix.push(1,1,   "Bottom Right");
    matrix.push(0,1,   "Bottom");
    matrix.push(-1,1,  "Bottom Left");
    matrix.push(-1,-1, "Top Left");
    vanillaMatrix = matrix.getPlainMatrix();
    console.log(vanillaMatrix);
    assert.equal(vanillaMatrix.length, 3);
    assert.equal(vanillaMatrix[0].length, 3);
    assert.equal(vanillaMatrix[1].length, 3);
    assert.equal(vanillaMatrix[2].length, 3);
  });

});
