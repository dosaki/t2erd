const assert = require('assert');
const fs = require('fs');

const utils = require("../src/parser/utils/parser_utils.js");

describe('ParserUtils', function() {
  describe('isCommentLine', function() {
    it('detect #', function() {
      let line = "# This is a comment";
      assert.equal(utils.isCommentLine(line), true);
    });

    it('detect new line', function() {
      let line = "\n";
      assert.equal(utils.isCommentLine(line), true);
    });

    it('detect regular text', function() {
      let line = "regular text";
      assert.equal(utils.isCommentLine(line), false);
    });

    it('detect regular text with # in the middle', function() {
      let line = "regular # text";
      assert.equal(utils.isCommentLine(line), false);
    });
  });
});
