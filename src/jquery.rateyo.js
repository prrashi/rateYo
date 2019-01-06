import {
  DEFAULTS
} from "./constants";

import RateYo from "./index";

;(function ($) {
  "use strict";

  RateYo.prototype.collection = [];

  function getInstance (node, collection) {

    /*
     * Given a HTML element (node) and a collection of RateYo instances,
     * this function will search through the collection and return the matched
     * instance having the node
     */

    var instance;

    $.each(collection, function () {

      if(node === this.node){

        instance = this;
        return false;
      }
    });

    return instance;
  }

  function deleteInstance (node, collection) {

    /*
     * Given a HTML element (node) and a collection of RateYo instances,
     * this function will search through the collection and delete the
     * instance having the node, and return the modified collection
     */

    $.each(collection, function (index) {

      if (node === this.node) {

        var firstPart = collection.slice(0, index),
            secondPart = collection.slice(index+1, collection.length);

        collection = firstPart.concat(secondPart);

        return false;
      }
    });

    return collection;
  }

  function _rateYo (options) {

    var rateYoInstances = RateYo.prototype.collection;

    /* jshint validthis:true */
    var $nodes = $(this);

    if($nodes.length === 0) {

      return $nodes;
    }

    var args = Array.prototype.slice.apply(arguments, []);

    if (args.length === 0) {

      //If args length is 0, Initialize the UI with default settings
      options = args[0] = {};
    }else if (args.length === 1 && typeof args[0] === "object") {

      //If an Object is specified as first argument, it is considered as options
      options = args[0];
    }else if (args.length >= 1 && typeof args[0] === "string") {

      /*
       * if there is only one argument, and if its a string, it is supposed to be a
       * method name, if more than one argument is specified, the remaining arguments
       * except the first argument, will be passed as a params to the specified method
       */

      var methodName = args[0],
          params = args.slice(1);

      var result = [];

      $.each($nodes, function (i, node) {

        var existingInstance = getInstance(node, rateYoInstances);

        if(!existingInstance) {

          throw Error("Trying to set options before even initialization");
        }

        var method = existingInstance[methodName];

        if (!method) {

          throw Error("Method " + methodName + " does not exist!");
        }

        var returnVal = method.apply(existingInstance, params);

        result.push(returnVal);
      });

      /*
       * If the plugin in being called on only one jQuery Element, return only the
       * first value, to support chaining.
       */
      result = result.length === 1? result[0]: result;

      return result;
    }else {

      throw Error("Invalid Arguments");
    }

    /*
     * if only options are passed, extend default options, and if the plugin is not
     * initialized on a particular jQuery element, initalize RateYo on it
     */
    options = $.extend({}, DEFAULTS, options);

    return $.each($nodes, function () {

               var existingInstance = getInstance(this, rateYoInstances);

               if (existingInstance) {

                 return existingInstance;
               }

               var $node = $(this),
                   dataAttrs = {},
                   optionsCopy = $.extend({}, options);

               $.each($node.data(), function (key, value) {

                 if (key.indexOf("rateyo") !== 0) {

                   return;
                 }

                 var optionName = key.replace(/^rateyo/, "");

                 optionName = optionName[0].toLowerCase() + optionName.slice(1);

                 dataAttrs[optionName] = value;

                 delete optionsCopy[optionName];
               });

               return new RateYo(this, $.extend({}, dataAttrs, optionsCopy));
           });
  }

  function rateYo () {

    /* jshint validthis:true */
    return _rateYo.apply(this, Array.prototype.slice.apply(arguments, []));
  }

  $.fn.rateYo = rateYo;

}(window.jQuery));
