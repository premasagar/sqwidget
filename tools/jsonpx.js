// E.g. jsonpx(htmlTemplate, 'myFunc');

function jsonpx(html, callbackName, stripwhitespace){
    function escape(txt){
        var s = '[\\0\\t\\n\\v\\f\\r\\s]';
        
        if (stripwhitespace){
            txt = txt
                .replace(new RegExp('>' + s + '+<', 'g'), '><')
                .replace(new RegExp('(<style[^>]*>)' + s + '+(.)', 'g'), '$1$2')
                .replace(new RegExp('(<script[^>]*>)' + s + '+(.)', 'g'), '$1$2')
                .replace(new RegExp(s + '+<\/script>' + s + '*', 'g'), '</script>')
                .replace(new RegExp(s + '*<\/script>' + s + '+', 'g'), '</script>')
                .replace(new RegExp(s + '+<\/style>' + s + '*', 'g'), '</style>')
                .replace(new RegExp(s + '*<\/style>' + s + '+', 'g'), '</style>');
        }
        txt = txt
            .replace(/'/g, "\\'")
            .replace(/(?=\n)/g, '\\');
            
        return txt;
    }

    return callbackName + "('" + escape(html) + "');";
}
