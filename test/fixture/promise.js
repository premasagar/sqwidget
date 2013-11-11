sqwidget.define(['require', 'lib/when/when'] ,function(require, when) {
  var deferred = when.defer();

  require(['./dummy_load.js'], function(dummy) {

    var pkg = {
      Controller: function (opts) {
        opts.config.el.append("<div>PROMISE</div>");
      }
    };

    deferred.resolve(pkg);
  });

  return deferred.promise;
});


