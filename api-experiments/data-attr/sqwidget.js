(function(){

    /*!
    * Dataset
    *   github.com/premasagar/mishmash/tree/master/dataset/
    *
    */         
    function dataset(elem){
        return elem.dataset ||
            (function(){
                for (
                    var
                        dataset = {},
                        attrs = elem.attributes,
                        i = attrs.length,
                        attr, attrName;
                     i;
                     i--
                ){
                    attr = attrs[i-1];
                    attrName = attr.name;
                    if (attrName.slice(0,5) === 'data-'){
                        dataset[attrName.slice(5)] = attr.value;
                    }
                }
                return dataset;
                // NOTE: this is a read-only hash. If you need to set a data property, where the browser does not support the 'dataset' object, then use: elem.setAttribute('data-' + name, value);
            }());
    }
    
    // **
    
    // Find the <script> element that called this script, then grab its dataset object.
    var
        scripts = document.getElementsByTagName('script'),
        elem = scripts[scripts.length-1],
        data = dataset(elem);
        
        // **
        
    // Write out the results
    var demo = '', prop;
    for (prop in data){
        if (data.hasOwnProperty(prop)){
            demo += '<br />' + prop + ': ' + data[prop];
        }
    }
    document.getElementById('report').innerHTML = demo;
}());

/*jslint browser: true, devel: true, onevar: true, undef: true, eqeqeq: true, bitwise: true, regexp: true, strict: true, newcap: true, immed: true */
