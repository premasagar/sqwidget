# Sqwidget

Sqwidget is a framework for adding components to a page in a way that ensures
they are self contained and namespaced. It is great for buliding third party
widgets.


A typical embed code looks like the following:

```
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


## Getting Started

The easiest way to get started with using Sqwidget in your project is to use the
Yeoman generator that bulids out a project layout for you.

First, install Yeoman using:

```
$ npm install -g yo
```

Next, install the sqwidget-generator:

```
$ npm install -g generator-sqwidget
```

Finally, initiate your project in a new directory where you want to create your
widget:

```
$ mkdir my-awesome-project
$ cd my-awesome-project
$ yo sqwidget
```

This will create your project for you and install all the dependencies. See your
widget in action by doing:

```
$ grunt
```

## TODO:

* Document generator and defaults like Ractive, RequireJS, Cleanslate.


## Development

Building sqwidget

```
npm install grunt-cli -g
npm install bower -g
bower install
npm install
grunt test

```
