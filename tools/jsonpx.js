// E.g. jsonpx(htmlTemplate, 'myFunc');

function jsonpx(html, callbackName, stripwhitespace){
    function escape(txt){
        var s = '[\\0\\t\\n\\v\\f\\r\\s]';
        
        if (stripwhitespace){
            txt = txt
                .replace(new RegExp('>' + s + '+<', 'g'), '><')
                .replace(new RegExp('(<style[^>]*>)' + s + '+(.)', 'g'), '$1$2')
                .replace(new RegExp('(<script[^>]*>)' + s + '+(.)', 'g'), '$1$2');
        }
        txt = txt
            .replace(/'/g, "\\'")
            .replace(/(?=\n)/g, '\\');
            
        if (stripwhitespace){
            txt = txt
                .replace(new RegExp('(;?)' + s + '+<\/script>' + s + '*', 'g'), '$1</script>')
                .replace(new RegExp('(;?)' + s + '*<\/script>' + s + '+', 'g'), '$1</script>')
                .replace(new RegExp('(}?)' + s + '+<\/style>' + s + '*', 'g'), '$1</style>')
                .replace(new RegExp('(}?)' + s + '*<\/style>' + s + '+', 'g'), '$1</style>');
        }
        return txt;
    }

    return callbackName + "('" + escape(html) + "');";
}
