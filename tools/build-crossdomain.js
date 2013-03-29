// E.g. buildTemplate(htmlTemplate, 'my-widget');

function buildTemplate(html, widgetName, doStripwhitespace){
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
            .replace(/"/g, '\\"')       // escape double quotes
            .replace(/(?=\n)/g, '\\');  // escape end of lines
    }
    
    // this is very dumb, as it only handles the most
    // basic of cases - we'd need a full blown parser to cope
    // with multiline quotes etc
    function stripComments(txt) {
        return txt
            .replace(/\s+\/\/.*/g, '');  // strip quotes      
    }
    
    html = escape(
              stripComments(
                  doStripwhitespace ?
                  stripwhitespace(html) :
                  html
    ));
    
    if (!widgetName){
        alert('No widget name provided');
        return html;
    }

    return 'Sqwidget.templateText({"type":"' + widgetName + '", "template": "' + html + '"});';
}
