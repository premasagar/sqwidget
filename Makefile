PATH := ./node_modules/.bin:${PATH}

.PHONY : init bower build test dist publish

init: bower
	npm install

build:
	grunt build

test:
	grunt test

bower:
	bower install

dist:
	grunt dist

publish: dist
	npm publish
