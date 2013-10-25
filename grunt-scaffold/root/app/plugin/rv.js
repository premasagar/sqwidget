/*global define, XMLHttpRequest */

define( [ './_fetchText', 'Ractive' ], function ( text, Ractive ) {

  'use strict';
  var buildMap = {};

  return {
    load: function ( name, req, onload, config ) {
      var filename;

      // add .html extension
      filename = name + ( ( name.substr( -5 ) !== '.html' ) ? '.html' : '' );

      text( req.toUrl( filename ), function ( template ) {
        var result = Ractive.parse( template );

        if ( config.isBuild ) {
          buildMap[ name ] = result;
        }

        onload( result );
      }, onload.error );
    },

    write: function ( pluginName, name, write ) {
      if ( buildMap[ name ] === undefined ) {
        throw 'Could not parse template ' + name;
      }

      write( 'define("' + pluginName + '!' + name + '",function(){return ' + JSON.stringify( buildMap[ name ] ) + ';})' );
    }
  };

});
