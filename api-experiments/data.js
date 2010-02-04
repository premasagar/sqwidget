(function(){
    var
        scripts = document.getElementsByTagName('script'),
        script = scripts.length ?
            scripts[scripts.length - 1] :
            null,
        data = script.dataset || (function(){
            var dataset = {};
            $.each(script.attributes, function(attr){
                if (attr.slice(0,5) === 'data-'){
                    dataset[attr.slice(5)] = attr
                }
                return attr.slice(0,5) === 'data-';
            });
            return dataset;
        }());
        
        // .dataset is new in HTML5, it requires fallback of the general attributes list, which may contain unrelated attributes, using a lopp to cycle through script attributes, to find those that start with "data-sqwidget-";
        if (!data){
            data = $.map(script.attributes, function(attr){
                return attr.slice(0,5) === 'data-sqwidget-';
            });
        }
        else {
            data = $.map(data, function(key){
                return key.slice(0,9) === 'data-sqwidget-';
            });
        }
}());
