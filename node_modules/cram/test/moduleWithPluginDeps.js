define([
	// ensure cram can handle this comment as well as these line feeds
	'js!./notamodule.js!exports=notamodule',
	'text!./templates/snippet.html',
	'css!./tiny.css'
], function (notamodule, snippet) {
	var doc, temp, dest, node;
	doc = window.document;
	temp = doc.createElement('div');
	dest = doc.documentElement;
	temp.innerHTML = snippet;
	while ((node = temp.firstChild)) {
		dest.appendChild(temp.firstChild);
	}
});
