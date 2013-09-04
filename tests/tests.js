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

  describe('Detect widgets', function () {
    it('should detect elements with a `data-sqwidget` attribute', function () {
      var elements = Sqwidget.getElements();

      expect(elements).to.be.an.instanceof(window.NodeList);
      expect(elements.length).to.eql(2);
      expect(elements[0]).to.eql(document.getElementById('test-1'));
    });

    it('should get parameters from the `data-sqwidget` attribute', function () {
      var elements = Sqwidget.getElements(),
          params1 = Sqwidget.getParameters(elements[0]),
          params2 = Sqwidget.getParameters(elements[1]);

      expect(params1).to.be.an.object;
      expect(params2).to.be.an.object;
      expect(Object.keys(params1).length).to.eql(0);
      expect(Object.keys(params2).length).to.eql(1);
      expect(params2.foo).to.eql('bar');
    });

    it('Sqwidget.ready() should run callback on DOM load', function (done) {
      Sqwidget.ready(function(){
        done();
      });

      // TODO: test when sqwidget.js included in HTML head, or above widgets
    });
  });

}(window, window.Sqwidget));
