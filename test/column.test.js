const assert = require('assert');
const Column = require("../src/parser/column.js");

describe('Column', function() {
  describe('new Column', function() {
    it('should throw error when no Table is passed', function() {
      assert.throws(function(){new Column("test")}, Error);
    });
  });
  describe('*test', function() {
    it('should be primary key', function() {
      const column = new Column("*test", {})
      assert.equal(column.isPrimaryKey, true);
      assert.equal(column.isForeignKey, false);
    });
  });
  describe('+test', function() {
    it('should be foreign key', function() {
      const column = new Column("+test", {})
      assert.equal(column.isPrimaryKey, false);
      assert.equal(column.isForeignKey, true);
    });
  });
  describe('test', function() {
    it('should be normal column key', function() {
      const column = new Column("test", {})
      assert.equal(column.isPrimaryKey, false);
      assert.equal(column.isForeignKey, false);
    });
  });
});
