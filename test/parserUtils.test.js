const assert = require('assert');
const fs = require('fs');

const utils = require("../src/parser/parser_utils.js");

describe('ParserUtils', function() {
  describe('Detect Comments', function() {
    it('detect #', function() {
      const line = "# This is a comment";
      assert.equal(utils.isCommentLine(line), true);
    });
    it('detect new line', function() {
      const line = "\n";
      assert.equal(utils.isCommentLine(line), true);
    });

    it('detect regular text', function() {
      const line = "regular text";
      assert.equal(utils.isCommentLine(line), false);
    });

    it('detect regular text with # in the middle', function() {
      const line = "This is not a comment # This is a comment";
      assert.equal(utils.isCommentLine(line), false);
      assert.equal(utils.stripComments(line), "This is not a comment");
    });
  });

  describe('isTableDefinition', function() {
    it('Detect start of table definition', function() {
      assert.equal(utils.isTableNameDefinition("[Table]"), true);
      assert.equal(utils.isTableNameDefinition("[Table-1]"), true);
      assert.equal(utils.isTableNameDefinition("[Table 1]"), true);
      assert.equal(utils.isTableNameDefinition("[   Table 1  ]"), true);
      assert.equal(utils.isTableNameDefinition("[   Table 1]"), true);
      assert.equal(utils.isTableNameDefinition("[Table 1   ]"), true);
      assert.equal(utils.isTableNameDefinition("[Table]-a"), true);
      assert.equal(utils.isTableNameDefinition("[Table]-     a"), true);
      assert.equal(utils.isTableNameDefinition("[Table]   -  a"), true);
      assert.equal(utils.isTableNameDefinition("[Table]     -a"), true);
      assert.equal(utils.isTableNameDefinition("[Table]     -a"), true);
      assert.equal(utils.isTableNameDefinition("[Table]\t-\ta"), true);
      assert.equal(utils.isTableNameDefinition("[Table-1] - a"), true);
      assert.equal(utils.isTableNameDefinition("[Table-1] - a"), true);
      assert.equal(utils.isTableNameDefinition("[[Table-1]]"), true);
      assert.equal(utils.isTableNameDefinition("[[Table.1]]"), true);
      assert.equal(utils.isTableNameDefinition("[Table"), false);
      assert.equal(utils.isTableNameDefinition("Table]"), false);
    });
  });

  describe('isColumn', function() {
    it('Ignore non-columns', function() {
      assert.equal(utils.isColumn("", "Table"), false);
      assert.equal(utils.isColumn("[Table 2]", "Table 1"), false);
      assert.equal(utils.isColumn("column", null), false);
      assert.equal(utils.isColumn("column", undefined), false);
      assert.equal(utils.isColumn("column", ""), false);
      assert.equal(utils.isColumn("|a|b|", "Table"), false);
      assert.equal(utils.isColumn("|notcolumn", "Table"), false);
      assert.equal(utils.isColumn("t1 *--* t2", "Table"), false);
    });
    it('Detect columns', function() {
      assert.equal(utils.isColumn("column", 0), true);
      assert.equal(utils.isColumn("column", "Table"), true);
      assert.equal(utils.isColumn("column # comment", "Table"), true);
      assert.equal(utils.isColumn("*column", "Table"), true);
      assert.equal(utils.isColumn("+column", "Table"), true);
    });
  });

  describe('isRelationship', function() {
    it('Detect relationship declarations', function() {
      assert.equal(utils.isRelationship("a *--* b"), true);
      assert.equal(utils.isRelationship("a 1--1 b"), true);
      assert.equal(utils.isRelationship("a 1--* b"), true);
      assert.equal(utils.isRelationship("a *--1 b"), true);
      assert.equal(utils.isRelationship("a *-* b"), false);
      assert.equal(utils.isRelationship("a *--*b"), false);
      assert.equal(utils.isRelationship("a*--* b"), false);
      assert.equal(utils.isRelationship("a*--* b"), false);
      assert.equal(utils.isRelationship("a * -- * b"), false);
      assert.equal(utils.isRelationship("a * -- 1 b"), false);
      assert.equal(utils.isRelationship("* -- *"), false);
      assert.equal(utils.isRelationship("* -- 1"), false);
      assert.equal(utils.isRelationship("*--*"), false);
      assert.equal(utils.isRelationship("*--1"), false);
    });
  });
});
