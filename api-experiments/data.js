(function(){
    var
        scripts = document.getElementsByTagName('script'),
        script = scripts.length ?
            scripts[scripts.length - 1] :
            null,
        dataset =
            script.dataset ||
            // .dataset is new in HTML5, so we have a fallback of the general attributes list, plucking out those attributes that are prefixed with "data-"
            (function(){
                for (
                    var
                        i=0,
                        attrs=script.attributes,
                        len=attrs.length,
                        dataset={},
                        attr;                        
                     i < len;
                     i++
                ){
                    attr = attrs[i];
                    if (attr.name.slice(0,5) === 'data-'){
                        dataset[attr.name.slice(5)] = attr.value;
                    }
                }
                return dataset;
            }());
        
        
        // **
        
        
        var demo = '', i=0;
        for (prop in dataset){
            demo += '<br />' + prop + ': ' + dataset[prop];
        }
        document.getElementById('report').innerHTML = demo;
}());
