# Sqwidget

Sqwidget is a framework for adding components to a page in a way that ensures
they are self contained and namespaced. It is great for buliding third party
widgets.


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
$ yo sqwidget
```

This will create your project for you and install all the dependencies. See your
widget in action by doing:

```
$ grunt
```

## TODO:

* Document features
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
