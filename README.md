# Sqwidget

This is a WIP setup for helping develop widgets.


## Installation and Running


```
npm install grunt-cli -g
npm install coffee-script -g
npm install
grunt
```


## Present Setup

This is a development only setup at present. It needs build tasks etc.

On running `grunt`, three development servers are launched:

* `index.html` is loaded from `http://localhost:8000`. This is to simulate the
  third party website that will actually host the widget.
* `widget.js` is loaded from `http://localhost:8001`. This is to simulate the
  sqwidget itself being loaded from a server.
* The actual widgets that use the embed code are loaded from
  `http://localhost:8002`.

This setup ensures that we always develop with an environment that's close to
the real environment.


## To-Dos

* Add `cleanslate` or similar to `sqwidget`
* Write a couple of example widgets so that we know how they are supposed to be
  loaded. These widgets should get their data from another server (via JSONP)
  * Each widget may have CSS dependencies. Load them.
  * Look into i18n work with RequireJS for internationalisation.
* If possible, remove the dependency on jQuery.

...
