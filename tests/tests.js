(function(window, Sqwidget){
  'use strict';

  var expect = chai.expect,
      assert = chai.assert;

  describe('Load library', function () {
    it('should load with window.Sqwidget a function', function () {
      expect(Sqwidget).to.be.a('function');
    });
    it('should have a version number', function () {
      expect(Sqwidget.version).to.be.a('string');
    });
  });

  describe('Browser API support (IE8+ supported)', function () {
    it('should support the browser\'s JavaScript APIs', function () {
      expect(Sqwidget.isSupported).to.be.true;
    });
  });

  describe('Initialise widgets', function () {
    it('should detect elements with a `data-sqwidget` attribute', function () {
      var elements, i, length, found;

      expect(Sqwidget.getElements).to.be.a('function');

      elements = Sqwidget.getElements();
      length = elements.length;

      expect(elements).to.be.an.instanceof(window.NodeList);
      expect(length).to.eql(1);
      expect(elements[0]).to.eql(document.getElementById('test-1'));
    });
  });

  function notDone () {
    assert.ok(false, 'Test not implemented'.toUpperCase());
  }
}(window, window.Sqwidget));