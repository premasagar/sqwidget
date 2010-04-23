Sqwidget.plugins.hello = function(){
    alert('Hello world');
};

// or
Sqwidget.plugin('hello', function(){
    alert('Hello world');
});

// or
Sqwidget.plugin('hello', function(){
    alert('Hello world');
}, '0.3.1');

// or
Sqwidget.plugin(
    'hello',
    
    $.extend(
        function(){
            alert('Hello world');
        },
        {
            v: '0.3.1'
        }
    )
);

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
function hello(){

}

(function(){
    // messy stuff
}());

exports.hello = hello;
// or
templateMethods = {
    hello: hello
};

hello();

// render markup template
Sqwidget.render('<p>{{hello.greeting}}</p>', {hello:{greeting: 'hi there'}});
Sqwidget.render('<p>{{hello.greeting}}</p>', {hello:hello, data:{hello:{greeting: 'hi there'}}, lang:lang.en});

exports = {
    hello:hello,
    lang:lang.en
}
Sqwidget.render('<p>{{hello.greeting}}</p>', $.extend(true, data, exports));
