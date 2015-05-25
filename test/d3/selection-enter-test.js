var tape = require("tape"),
    jsdom = require("jsdom"),
    selection = require("../../lib/d3/selection");

tape("selection.enter initially returns an empty selection", function(test) {
  var document = jsdom.jsdom("<h1>hello</h1>"),
      s = selection.select(document.body),
      e = s.enter();
  test.ok(e instanceof selection);
  test.equal(e._depth, 1);
  test.ok(Array.isArray(e._root));
  test.equal(e._root.length, 1);
  test.ok(!(0 in e._root));
  test.equal(e._root._parent, null);
  test.equal(e._enter, null);
  test.equal(e._exit, null);
  test.equal(e._root._update, s._root);
  test.equal(s._root._enter, e._root);
  test.end();
});

tape("selection.select moves enter nodes to the update selection", function(test) {
  var document = jsdom.jsdom(),
      nodes = [],
      update = selection.select(document.body).selectAll("p").data([0, 1, 2]),
      enter = update.enter();
  test.equal(enter._root.length, 1);
  test.equal(enter._root[0].length, 3);
  test.equal(enter._root[0][0].__data__, 0);
  test.equal(enter._root[0][1].__data__, 1);
  test.equal(enter._root[0][2].__data__, 2);
  test.equal(update._root.length, 1);
  test.equal(update._root[0].length, 3);
  test.equal(update._root[0][0], undefined);
  test.equal(update._root[0][1], undefined);
  test.equal(update._root[0][2], undefined);
  enter.select(function() { var p = this.appendChild(document.createElement("P")); nodes.push(p); return p; });
  test.equal(enter._root.length, 1);
  test.equal(enter._root[0].length, 3);
  test.equal(enter._root[0][0], undefined);
  test.equal(enter._root[0][1], undefined);
  test.equal(enter._root[0][2], undefined);
  test.equal(update._root.length, 1);
  test.equal(update._root[0].length, 3);
  test.equal(update._root[0][0], nodes[0]);
  test.equal(update._root[0][1], nodes[1]);
  test.equal(update._root[0][2], nodes[2]);
  test.equal(update._root[0][0].__data__, 0);
  test.equal(update._root[0][1].__data__, 1);
  test.equal(update._root[0][2].__data__, 2);
  test.end();
});

tape("selection.append inserts enter nodes before following update nodes", function(test) {
  var document = jsdom.jsdom();
  selection.select(document.body).selectAll("p").data([1, 3]).enter().append("p");
  var p = document.querySelectorAll("p");
  test.equal(p.length, 2);
  test.equal(p[0].__data__, 1);
  test.equal(p[1].__data__, 3);
  selection.select(document.body).selectAll("p").data([0, 1, 2, 3, 4], function(d) { return d; }).enter().append("p");
  var p = document.querySelectorAll("p");
  test.equal(p.length, 5);
  test.equal(p[0].__data__, 0);
  test.equal(p[1].__data__, 1);
  test.equal(p[2].__data__, 2);
  test.equal(p[3].__data__, 3);
  test.equal(p[4].__data__, 4);
  test.end();
});