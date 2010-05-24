// E.g. jsonpx(htmlTemplate, 'myFunc');

function jsonpx(html, callbackName, doStripwhitespace){
    function stripwhitespace(txt){
        var s = '[\\0\\t\\n\\v\\f\\r\\s]';
        return txt
            .replace(new RegExp('>' + s + '+<', 'g'), '><')
            .replace(new RegExp('(<style[^>]*>)' + s + '+(.)', 'g'), '$1$2')
            .replace(new RegExp('(<script[^>]*>)' + s + '+(.)', 'g'), '$1$2')
            .replace(new RegExp(s + '+<\/script>' + s + '*', 'g'), '</script>')
            .replace(new RegExp(s + '*<\/script>' + s + '+', 'g'), '</script>')
            .replace(new RegExp(s + '+<\/style>' + s + '*', 'g'), '</style>')
            .replace(new RegExp(s + '*<\/style>' + s + '+', 'g'), '</style>');
    }

    function escape(txt){
        return txt
            .replace(/'/g, "\\'")       // escape single quotes
            .replace(/(?=\n)/g, '\\');  // escape end of lines
    }
    
    html = escape(
        doStripwhitespace ?
            stripwhitespace(html) :
            html
    );
    
    if (callbackName){
        html = callbackName + "('" + html + "');";
    }

    return html;
}
