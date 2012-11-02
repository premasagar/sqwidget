(function(globals){
    "use strict";
    var assert = globals.chai.assert,
        sqwidget = globals.Sqwidget,
        minVersion = "1.4.2",
        latestVersion = "1.8.2";

    describe('Sqwidget JQuery Dependency', function(){
        describe("Sqwidget's JQuery Object", function(){
            var jquery = Sqwidget.jQueryIsLoaded(minVersion);
            it('should be loaded', function(){
                assert.ok(jquery, "JQuery object not loaded");
            });
            it('should be version 1.8.2', function(){
                assert.ok(jquery.fn, "fn property not present");
                assert.ok(jquery.fn.jquery, "jquery property not present");
                assert.equal(jquery.fn.jquery, latestVersion);
            });
        });
    });
})(this);