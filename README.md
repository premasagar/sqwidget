# Sqwidget

Sqwidget is a framework for adding components to a page in a way that ensures
they are self contained and namespaced. It is great for buliding third party
widgets.


A typical embed code looks like the following:

```html
<div data-sqwidget data-sqwidget-url="//example.com/my-widget"></div>
<script src="//example.com/sqwidget.js"></script>
```

## Features

1. Easy configurations and customisations: An embed code can have any number of
   optional parameters that are passed to the constructer your widget.
2. Sandboxed JavaScript: All your JS is completely sandboxed from the rest of
   page not allowing you to leak any globals by default. It uses RequireJS to
   call your widget.
3. Widgets are RequireJS modules.
4. Yeoman Generator: A Yeoman generator allows you to scaffold your widget very 
   quickly. The scaffold includes some libraries that we've found great for
   building high-performance widgets:
    1. RactiveJS
    2. Lodash
    3. RequireJS
    
The only hard dependency is RequireJS, since sqwidget expects to find a RequireJS
module to initialise.

## Getting Started

The easiest way to get started with using Sqwidget in your project is to use the
Yeoman generator that builds a project layout for you.

First, install Yeoman using:

```bash
$ npm install -g yo
```

Next, install the sqwidget-generator:

```bash
$ npm install -g generator-sqwidget
```

Finally, initiate your project in a new directory where you want to create your
widget:

```bash
$ mkdir my-awesome-project
$ cd my-awesome-project
$ yo sqwidget
```

This will create your project for you and install all the dependencies. See your
widget in action by doing:

```bash
$ grunt
```

## The Basic Widget

At the minimum, your widget will have a `src/main.js` which is a RequireJS
module. This module should return a function that accepts one `options`
parameter (object).

Example:

```javascript

define([], function() {
    return function(options) {
        // DOM element to append your content is available at options.el
        // Config params are available at options.config
    };
});

```

### Configuration and Custom Parameters

The embed code can also accept any number of parameters like:

```html
<div data-sqwidget data-sqwidget-url="//example.com/my-widget"
    data-sqwidget-title="My Title" data-sqwidget-user="johndoe"
    data-sqwidget-age="20"></div>
```

All parameters that begin with `data-sqwidget-` will be passed to the function
called in your widget during initialisation. 

In this case, the `options` object from above will have a `config` object that
looks like:

```javascript
options = {
    el: <DOM NODE>,
    config = {
        "title": "My Title",
        "user": "johndoe",
        "age": "20"
    },
    ...
```

## Development

Building sqwidget

```bash
npm install grunt-cli -g
npm install bower -g
bower install
npm install
grunt test

```
