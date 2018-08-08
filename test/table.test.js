const assert = require('assert');
const Table = require("../src/parser/table.js");

describe('Table', function() {
  describe('new Table', function() {
    it('should throw error when a non-table definition line is passed', function() {
      assert.throws(function(){new Table()}, Error);
      assert.throws(function(){new Table("table")}, Error);
    });

    it('should make a new table with a long alias', function() {
      var table = new Table("[table] - abc");
      assert.equal(table.name, "table");
      assert.equal(table.alias, "abc");
    });

    it('should make a new table with a single-char alias', function() {
      var table = new Table("[table] - t");
      assert.equal(table.name, "table");
      assert.equal(table.alias, "t");
    });
  });
});
