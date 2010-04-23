Sqwidget.plugins.hello = function(){
    alert('Hello world');
};

// or

Sqwidget.plugin('hello', function(){
    alert('Hello world');
});

// or

Sqwidget.plugin({
    hello: function(){

    }
);

// or

Sqwidget.plugin('hello', function(){
    alert('Hello world');
    Sqwidget.plugins.nitelite('<p>blah</p>');
    nitelite('<p>blah</p>');
}, [
    'nitelite',
    'myplugin.js'
]);

//

// controller
hello();

// render markup template
Sqwidget.render('<p>{{hello.greeting}}</p>', {hello:{greeting: 'hi there'}});
