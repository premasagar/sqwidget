// E.g. jsonpx(htmlTemplate, 'myFunc');
 
function jsonpx(html, callbackName){
    function escape(txt){
        return txt.replace(/'/g, "\\'").replace(/(?=\n)/g, '\\');
    }

    return callbackName + "('" + escape(html) + "');";
}
