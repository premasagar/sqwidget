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

    // Exit if not supported in the browser
    if (!Sqwidget.isSupported){
        return;
    }

    describe('Detect widgets', function () {
        it('should detect widgets by their `data-sqwidget` attribute', function () {
            // TODO: test when sqwidget.js included in HTML head, or above widgets
            var elements = Sqwidget.getElements();

            expect(elements).to.be.an.instanceof(window.NodeList);
            expect(elements.length).to.eql(4);
            expect(elements[0]).to.eql(document.getElementById('test-1'));
        });
    });

    describe('Parse widget settings', function () {
        it('should get parameters from the `data-sqwidget` attribute', function () {
            var elements = Sqwidget.getElements(),
                    params = Sqwidget.getParameters(elements[1]);

            expect(params).to.be.an.object;
            expect(Object.keys(params).length).to.eql(1);
        });

        it('should parse parameters, allowing optional trailing semicolon', function () {
            var params = [
                    Sqwidget.parseParameters(''),
                    Sqwidget.parseParameters('foo: bar'),
                    Sqwidget.parseParameters('foo:bar'),
                    Sqwidget.parseParameters('foo: bar;'),
                    Sqwidget.parseParameters('foo: bar ;'),
                    Sqwidget.parseParameters('foo:bar;'),
                    Sqwidget.parseParameters('foo:bar;thing:2'),
                    Sqwidget.parseParameters('foo:bar;thing:2;'),
                    Sqwidget.parseParameters('foo: bar; thing:2 ;')
                ],
                length = params.length,
                i;

            for (i=0; i<length; i++){
                expect(params[i]).to.be.an.object;

                if (i === 0){
                    expect(Object.keys(params[i]).length).to.eql(0);
                }
                else if (i < 6){
                    expect(Object.keys(params[i]).length).to.eql(1);
                    expect(params[i].foo).to.eql('bar');
                }
                else {
                    expect(Object.keys(params[i]).length).to.eql(2);
                    expect(params[i].foo).to.eql('bar');
                    expect(params[i].thing).to.eql('2');
                }
            }
        });

        it('should run callback on DOM load with Sqwidget.domReady()', function (done) {
            Sqwidget.domReady(function(){
                done();
            });
        });

        it('should run multiple callbacks with Sqwidget.domReady()', function (done) {
            var count = 0;

            Sqwidget.domReady(function(){
                count += 1;
                if (count === 3){
                    done();
                }
            });

            Sqwidget.domReady(function(){
                count += 2;
                if (count === 3){
                    done();
                }
            });
        });
    });

}(window, window.Sqwidget));
