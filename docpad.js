var path = require('path');
var _ = require('lodash');

module.exports = {
  "srcPath": ".",
  "documentsPaths": [
    "docs",
    "assets"
  ],
  "filesPaths": [
    "public"
  ],
  "layoutsPaths": [
    "layouts"
  ],
  "plugins": {
    "cleanurls": {
      "static": true
    },
    "stylus": {
      "stylusLibraries": {
        "nib": false,
        "autoprefixer-stylus": true
      },
      "stylusOptions": {
        "compress": true,
        "include css": true
      }
    },
    "browsersync": {
      "open": true,
      "ghostMode": {
          "clicks": true,
          "location": true,
          "forms": true,
          "scroll": true
        }
      }
  },
  "environments": {
    "development": {
      "stylusOptions": {
        "compress": false
      }
    }
  },
  "ignorePaths": [
    /**
     * Ignore output directory to prevent watch triggering
     * when outPath is written. This happens because srcPath
     * is the rootPath instead of a subdirectory.
     */
    path.join(process.cwd(), "out")
  ],
  "collections": {
    /**
     * Set default layout for all markdown documents.
     */
    navItems: function() {
      return this.getCollection('html')
      .findAllLive({}, [{ fullPath:1 }]);
    },
    docs: function() {
      return this.getCollection('documents')
        .findAllLive({ extension: 'md' }, [{ filename: -1 }])
        .on('add', function(model) {
          model.setMetaDefaults({ 'layout': 'default' });
        });
    }
  },
  templateData: {
    parseNavItems: function(currentPage) {
      var collection = this.getCollection("navItems").toJSON();
      var output = {};

      var getObjectAsString = function(array, posts, postIndex, depth) {
        depth = (typeof depth == 'number') ? depth+1 : 1;
        if(!array.length){
          var endNode = {
            title: posts[postIndex].title,
            url: posts[postIndex].url
          };
          return JSON.stringify(endNode);
        } else if(array.length == 1 && array[0] == '0-index.html.md') {
          var endNode = {
            title: posts[postIndex].title,
            url: posts[postIndex + 1].url,
            tag: "h"+depth
          };
          return JSON.stringify(endNode);
        } else {
          return '{"' + array[0] + '":' + getObjectAsString (array.slice(1), posts, postIndex, depth) + '}';
        }
      }

      for (var i = 0; i < collection.length; i++){
        var pathAr = collection[i].relativePath.split('/');
        var pathObj = JSON.parse(getObjectAsString(pathAr, collection, i));
        _.merge(output,pathObj);
        for (var j = 0; j < pathAr.length; j++){

        }

      }


      return output;
    }
  }
};
