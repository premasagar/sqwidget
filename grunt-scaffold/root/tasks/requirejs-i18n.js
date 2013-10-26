var _ = require('underscore');

module.exports = function (grunt) {
  grunt.registerMultiTask("requirejs-i18n", "Assemble rjs i18n files from source yaml", function () {

    var options = this.options({ encoding: "utf8", default_lang: "en-gb" });
    var template = grunt.file.read('tasks/lang.js.tmpl');
    var src = grunt.file.readYAML(options.src, { encoding: options.encoding });

    _.each(src, function(val, lang) {
      var dir = lang + '/',
          trans = { root: val };

      if(lang === options.default_lang) {
        //add all the sub languages too
        _.each(_.keys(src), function(lang) { trans[lang] = true; });
        delete trans[lang];
        dir = '';
      }
      var gen = grunt.template.process(template, { data: { json: JSON.stringify(trans) } });
      grunt.file.write(options.dest + dir + 'strings.js', gen);

    });
  });
};
