A Simple template for a sqwidget application. Includes Ractive as a basis for rendering


##Installing

```
npm install -g volo
volo create purge/sqwidget-template

```

Install new plugins with

`volo add user/repo`

TEMPORARY, after install (i'll package my own require-css)

```
mkdir app/lib/require-css/css
cp app/lib/require-css/css-builder.js app/lib/require-css/css/
cp app/lib/require-css/normalize.js app/lib/require-css/css/
```

When you're done

`make`

and the widget build will be found inside dist/package

You can test at any time

`npm install -g http-server`

Run

`http-server`

And point your browser at `http://localhost:8080/app/index.html`


