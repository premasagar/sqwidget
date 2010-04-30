// Template syntax
<html>
<head>
<script>
// controller
widget.ready(function(){

    mybutton.click(function(){
        var id = this.id;
        
        mywidget.callApi(id, function(data){
            widget.templates.articles(data); // pass object to template, to render with
        });
    });

    return {world:'Brighton'};
});


widget.templates.lightbox(function(){
    return {world:'Paris'};
});

widget.templates.articles(function(data){ // pass function to template, as a handler for when ready to render
    function doStuff(){
        var list = '';
        $.each(data, function(i, article){
            list += '<li>' + article + '</li>';
        });
    }
    return {articles_list:doStuff()};
});
</script>

<script type="text/template" id="articles">
    <ul>{{articles_list}}</ul>
</script>

<script type="text/template" id="lightbox">
    <p>hello {{world}}</p>
    
    <div class="articles">
        {{widget.templates.articles}}
        
        <!-- when a sub-template is embedded in another sub-template, it is printed with toString() ~~~ will this work in practice? or do we need to be able to pass arguments to the template handler? -->
    </div>
</script>
</head>

<body>
    <p>hello {{world}}</p>
</body>
</html>
