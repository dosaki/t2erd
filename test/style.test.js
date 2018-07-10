const assert = require('assert');
const Style = require("../src/parser/style.js");

describe('Style', function() {
  describe('new Style', function() {
    it('should throw error when no Table is passed', function() {
      assert.throws(function(){new Style()}, Error);
    });

    it('with inline style', function() {
      assert.equal(Object.keys(new Style({name:"Mock Table"}, "").parse().properties).length, 0);
      assert.equal(Object.keys(new Style({name:"Mock Table"}, "{}").parse().properties).length, 0);
      assert.equal(Object.keys(new Style({name:"Mock Table"}, "{a:1}").parse().properties).length, 1);
      assert.equal(Object.keys(new Style({name:"Mock Table"}, "{a:1;}").parse().properties).length, 1);
      assert.equal(Object.keys(new Style({name:"Mock Table"}, "{a:1;b:2}").parse().properties).length, 2);
      assert.equal(Object.keys(new Style({name:"Mock Table"}, "{a:1;b:2").parse().properties).length, 0);
    });

    it('without inline style', function() {
      const style = new Style({name:"Mock Table"});
      assert.equal(Object.keys(style.parse().properties).length, 0);
      style.add(""); assert.equal(Object.keys(style.parse().properties).length, 0);
      style.add("a:1"); assert.equal(Object.keys(style.parse().properties).length, 1);
      style.add("a"); assert.equal(Object.keys(style.parse().properties).length, 1);
      style.add("b:2"); assert.equal(Object.keys(style.parse().properties).length, 2);
      style.add(":1"); assert.equal(Object.keys(style.parse().properties).length, 2);
      style.add("a:"); assert.equal(Object.keys(style.parse().properties).length, 2);
      style.add("c:3"); assert.equal(Object.keys(style.parse().properties).length, 3);
    });
  });
});
