const assert = require('assert');
const fs = require('fs');

const Parser = require("../src/parser/parser.js");

const diagram = fs.readFileSync('./test/resources/diagram.erd', 'utf8').toString();

describe('Parser', function() {
  describe('tables', function() {
    it('should have 3 tables', function() {
      let parser = new Parser(diagram);
      assert.equal(parser.tables.length, 3);
      assert.equal(parser.tables[0].name, "user");
      assert.equal(parser.tables[1].name, "user_info");
      assert.equal(parser.tables[2].name, "post");
    });

    it('should contain columns', function() {
      let parser = new Parser(diagram);
      assert.equal(parser.tables[0].columns.length, 3);
      assert.equal(parser.tables[1].columns.length, 6);
      assert.equal(parser.tables[2].columns.length, 5);
    });
  });
  describe('relationships', function(){
    it('should have 3 relationships', function() {
      let parser = new Parser(diagram);
      assert.equal(parser.relationships.length, 3);
      assert.equal(parser.relationships[0].table1, "user_info");
      assert.equal(parser.relationships[0].table2, "user");
      assert.equal(parser.relationships[1].table1, "post");
      assert.equal(parser.relationships[1].table2, "post");
      assert.equal(parser.relationships[2].table1, "post");
      assert.equal(parser.relationships[2].table2, "user");
    });
  });
});
