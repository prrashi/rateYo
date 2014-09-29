/*! rateYo - v1.0
* http://prrashi.github.io/rateyo/
* Copyright (c) 2014 Prashanth Pamidi; Licensed MIT */
;(function ($) {
  "use strict";

  /* The basic svg string required to generate stars
   */
  var BASICSTAR = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"+
                  "<svg version=\"1.1\" id=\"Layer_1\""+
                        "xmlns=\"http://www.w3.org/2000/svg\""+
                        "viewBox=\"0 12.705 512 486.59\""+
                        "x=\"0px\" y=\"0px\""+
                        "xml:space=\"preserve\">"+
                    "<polygon id=\"star-icon\""+
                              "points=\"256.814,12.705 317.205,198.566"+
                                      " 512.631,198.566 354.529,313.435 "+
                                      "414.918,499.295 256.814,384.427 "+
                                      "98.713,499.295 159.102,313.435 "+
                                      "1,198.566 196.426,198.566 \"/>"+
                  "</svg>";

  var DEFAULTS = {

    starWidth: "32px",
    normalFill: "gray",
    ratedFill: "#f39c12",
    numStars: 5,
    minValue: 0,
    maxValue: 5,
    precision: 1,
    rating: 0,
    onChange: null,
    onSet: null
  };

  function checkPercision (value, minValue, maxValue) {

    /* its like comparing 0.00 with 0 which is true*/
    if (value === minValue) {

      value = minValue;
    }
    else if(value === maxValue) {

      value = maxValue;
    }

    return value;
  }

  function checkBounds (value, minValue, maxValue) {

    var isValid = value >= minValue && value <= maxValue;

    if(!isValid){

        throw Error("Invalid Rating, expected value between "+ minValue +
                    " and " + maxValue);
    }

    return value;
  }

  function getInstance (node, collection) {

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

  /* The Contructor, whose instances are used by plugin itself,
   * to set and get values
   */
  function RateYo ($node, options) {

    this.$node = $node;

    this.node = $node.get(0);

    var that = this;

    var rating = options.rating;

    // In the current version, the width and height of the star
    // should be the same
    options.starHeight = options.starWidth;

    var isPercentage = false,
        maxValue = options.maxValue,
        minValue = options.minValue;

    if (typeof rating === "string") {

      if (rating[rating.length - 1] === "%") {

        isPercentage = true;
        rating = rating.substr(0, rating.length - 1);
        maxValue=100;
        minValue = 0;
      }

      rating = parseInt(rating);

      checkBounds(rating, minValue, maxValue);
    }

    var containerWidth = parseInt(options.starWidth.replace("px","").trim());

    containerWidth = containerWidth*options.numStars;

    $node.addClass("jq-ry-container")
         .width(containerWidth);

    var $groupWrapper = $("<div/>").addClass("jq-ry-group-wrapper")
                                   .appendTo($node);

    var $normalGroup = $("<div/>").addClass("jq-ry-normal-group")
                                  .addClass("jq-ry-group")
                                  .appendTo($groupWrapper);

    var $ratedGroup = $("<div/>").addClass("jq-ry-rated-group")
                                 .addClass("jq-ry-group")
                                 .appendTo($groupWrapper);

    for (var i=0; i<options.numStars; i++) {

      $normalGroup.append($(BASICSTAR));
      $ratedGroup.append($(BASICSTAR));
    }

    $normalGroup.find("svg")
                .attr({width: options.starWidth,
                       height: options.starHeight,
                       fill: options.normalFill});

    $ratedGroup.find("svg")
               .attr({width: options.starWidth,
                      height: options.starHeight,
                      fill: options.ratedFill});

    this.getRating = function () {

      return rating;
    };

    this.setRating = function (newValue) {

      if (typeof newValue === "string") {

        if (newValue[newValue.length - 1] === "%") {

          newValue = newValue.substr(0, newValue.length - 1);
        }

        newValue = parseFloat(newValue);
      }

      checkBounds(newValue, minValue, maxValue);

      rating = parseFloat(newValue.toFixed(options.precision));

      checkPercision(parseFloat(rating), minValue, maxValue);

      showRating();

      $node.trigger("rateyo.set", {rating: rating});

      return this;
    };

    function showRating (ratingVal) {

      if(ratingVal === undefined){

        ratingVal = rating;
      }

      var percent = ((ratingVal - minValue)/(maxValue - minValue))*100;

      $ratedGroup.css("width", percent + "%");
    }

    function calculateRating (e) {

      var position = $normalGroup.offset(),
        nodeStartX = position.left,
        nodeEndX = nodeStartX + $normalGroup.width();

      var pageX = e.pageX;

      var calculatedRating;

      if(pageX < nodeStartX) {

        calculatedRating = minValue;
      }else if (pageX > nodeEndX) {

        calculatedRating = maxValue;
      }else {

        calculatedRating = ((pageX - nodeStartX)/(nodeEndX - nodeStartX))*(maxValue - minValue);
        calculatedRating = minValue + calculatedRating;
      }

      return calculatedRating;
    }

    function onMouseEnter (e) {

      var rating = calculateRating(e).toFixed(options.precision);
      rating = checkPercision(parseFloat(rating), minValue, maxValue);

      showRating(rating);

      $node.trigger("rateyo.change", {rating: rating});
    }

    function onMouseLeave () {

      showRating();

      $node.trigger("rateyo.change", {rating: rating});
    }

    function onMouseClick (e) {

      var resultantRating = calculateRating(e).toFixed(options.precision);
      resultantRating = parseFloat(resultantRating);

      that.setRating(resultantRating);
    }

    function onChange (e, data) {

      if(options.onChange && typeof options.onChange === "function") {

        /* jshint validthis:true */
        options.onChange.apply(this, [data.rating, that]);
      }
    }

    function onSet (e, data) {

      if(options.onSet && typeof options.onSet === "function") {

        /* jshint validthis:true */
        options.onSet.apply(this, [data.rating, that]);
      }
    }

    function bindEvents () {

      $node.on("mousemove", onMouseEnter)
           .on("mouseenter", onMouseEnter)
           .on("mouseleave", onMouseLeave)
           .on("click", onMouseClick)
           .on("rateyo.change", onChange)
           .on("rateyo.set", onSet);
    }

    function unbindEvents () {

      $node.off("mousemove", onMouseEnter)
           .off("mouseenter", onMouseEnter)
           .off("mouseleave", onMouseLeave)
           .off("click", onMouseClick)
           .off("rateyo.change", onChange)
           .on("rateyo.set", onSet);
    }

    this.destroy = function () {

      unbindEvents();

      RateYo.prototype.collection = deleteInstance($node.get(0),
                                                   this.collection);

      $node.removeClass("jq-ry-container").children().remove();

      return $node;
    };

    bindEvents();
    this.setRating(rating);
  }

  RateYo.prototype.collection = [];

  function _rateYo (options) {

    var rateYoInstances = RateYo.prototype.collection;

    var optionsMap = {

      "rating": {

        "getter": "getRating",
        "setter": "setRating"
      },
      "destroy": {

        "getter": "destroy"
      }
    };

    /* jshint validthis:true */
    var $nodes = $(this);

    if($nodes.length === 0) {

      return $nodes;
    }

    var args = Array.prototype.slice.apply(arguments, []);

    if (args.length === 0) {

      //Setting Options to empty
      options = args[0] = {};
    }else if (args.length === 1 && typeof args[0] === "object") {

      //Setting options to first argument
      options = args[0];
    }else if (args.length > 1 && args[0] === "method") {

      var option = args[1];

      if (!optionsMap[option]) {

        throw Error("Invalid Option!");
      }

      var result = [];

      var isGetter = args.length === 2;

      var existingInstance;

      var method; //Method of the RateYo that is to be called

      if(isGetter) {

        // Getting the last instance
        existingInstance = getInstance($nodes.get($nodes.length - 1),
                                       rateYoInstances);

        if(!existingInstance) {

          throw Error("Trying to get options before even initialization");
        }

        method = existingInstance[optionsMap[option].getter];

        if (!method) {

          throw Error("Method " + option + " does not exist!");
        }

        return method.apply(existingInstance, []);
      } else {

        var value=args[2];

        $.each($nodes, function (i, node) {

          var existingInstance = getInstance($(node).get(0),
                                             rateYoInstances);

          if(!existingInstance) {

            throw Error("Trying to set options before even initialization");
          }

          method = existingInstance[optionsMap[option].setter];

          if (!method) {

            throw Error("Method " + option + " does not exist!");
          }

          method.apply(existingInstance, [value]);

          result.push(existingInstance.node);
        });

        return $(result);
      }
    }else {

      throw Error("Invalid Arguments");
    }

    options = $.extend(JSON.parse(JSON.stringify(DEFAULTS)), options);

    return $.each($nodes, function () {

               var existingInstance = getInstance(this, rateYoInstances);

               if (existingInstance) {

                 return;
               }

               rateYoInstances.push(new RateYo($(this), options));
           });
  }

  function rateYo () {

    /* jshint validthis:true */
    return _rateYo.apply(this, Array.prototype.slice.apply(arguments, []));
  }

  $.fn.rateYo = rateYo;

}(jQuery));
