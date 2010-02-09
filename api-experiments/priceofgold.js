// core
var Sqwidget = function(){
};
Swidget.fn = Sqwidget.protoype = {
    sqwidget:0.1
};


// plugin
(function priceofgold(fn){
    $.get('priceofgold.json.js', function(priceofgold){
        fn(Sqwidget.fn.priceofgold = priceofgold);
    });
}());


// instance - e.g. mywidget.js
priceofgold(function(data){
    $('[data-sqwidget][data-priceofgold]')
        .each(function(){
            $(this).text(
                data[
                    $(this).attr('[data-priceofgold]'); // e.g. 'gbp'
                ]
            );
            
        });
});
