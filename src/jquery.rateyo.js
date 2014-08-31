/*! rateYo - v0.0.1
* http://prrashi.github.io/rateyo/
* Copyright (c) 2014 Prashanth Pamidi; Licensed MIT */
;(function ($) {
  "use strict";

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
    starHeight: "32px",
    normalFill: "gray",
    ratedFill: "#f39c12",
    stroke: "transparent",
    strokeWidth: 0,
    numStars: 5,
    minValue: 0,
    maxValue: 5,
    padding: 5,
    rating: 0,
    onChange: null,
    onSet: null
  };

  function RateYo ($node, options) {

    this.$node = $node;

    this.node = $node.get(0);

    var that = this;

    var rating = options.rating;

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

    for (var i=0; i<options.maxValue; i++) {

      $normalGroup.append($(BASICSTAR));
      $ratedGroup.append($(BASICSTAR));
    }

    $normalGroup.find("svg")
        .attr({width: options.starWidth,
               height: options.starHeight,
               fill: options.normalFill,
               stroke: options.stroke,
               "stroke-width": options.strokeWidth});

    $ratedGroup.find("svg")
                            .attr({width: options.starWidth,
                                   height: options.starHeight,
                                   fill: options.ratedFill,
                                   stroke: options.stroke,
                                   "stroke-width": options.strokeWidth});

    var position = $normalGroup.offset(),
        nodeStartX = position.left,
        nodeEndX = nodeStartX + $normalGroup.width();

    this.getRating = function () {

      return rating;
    };

    var setRating = this.setRating = function (newValue) {

      rating = parseFloat(newValue.toFixed(1));

      showRating();

      $node.trigger("rateyo.set", {rating: rating});

      return this;
    };

    function showRating (ratingVal) {

      ratingVal = ratingVal || rating;

      var percent = (ratingVal/options.maxValue)*100;

      $ratedGroup.css("width", percent + "%");
    }

    function _calculateRating (e) {

      var pageX = e.pageX;

      var calculatedRating;

      if(pageX < nodeStartX) {

        calculatedRating = 0;
      }else if (pageX > nodeEndX) {

        calculatedRating = options.maxValue;
      }else {

        calculatedRating = ((pageX - nodeStartX)/(nodeEndX - nodeStartX))*5;
      }

      return calculatedRating;
    }

    function onMouseEnter (e) {

      var rating = parseFloat(_calculateRating(e).toFixed(1));

      showRating(rating);

      $node.trigger("rateyo.change", {rating: rating});
    }

    function onMouseLeave () {

      showRating();

      $node.trigger("rateyo.change", {rating: rating});
    }

    function onMouseClick (e) {

      var resultantRating = parseFloat(_calculateRating(e).toFixed(1));

      setRating(resultantRating);
    }

    function onChange (e, data) {

      if(options.onChange && typeof options.onChange === "function") {

        options.onChange.apply(this, [data.rating, that]);
      }
    }

    function onSet (e, data) {

      if(options.onSet && typeof options.onSet === "function") {

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
      $node.remove();
    };

    bindEvents();
    showRating();
  }

  var rateYoInstances = RateYo.prototype.collection = [];

  function getInstance (node) {

    var instance;

    $.each(rateYoInstances, function () {

      if(node === this.node){

        instance = this;
        return false;
      }
    });

    return instance;
  }

  function rateYo (options) {

    var optionsMap = {

      "rating": {

        "getter": "getRating",
        "setter": "setRating"
      }
    };

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
    }else if (args.length > 1 && args[0] === "options") {

      var option = args[1];

      if (!optionsMap[option]) {

        throw Error("Invalid Option!");
      }

      var result = [];

      var isGetter = args.length === 2;

      var existingInstance;

      if(isGetter) {

        // Getting the rating of the last instance
        existingInstance = getInstance($nodes.get($nodes.length - 1));

        if(!existingInstance) {

          throw Error("Trying to get options before even initialization");
        }

        return existingInstance[optionsMap[option].getter]();
      } else {

        var value=args[2];

        $.each($nodes, function (i, node) {

          var existingInstance = getInstance($(node).get(0));

          if(!existingInstance) {

            throw Error("Trying to set options before even initialization");
          }

          result.push(existingInstance[optionsMap[option].setter](args[2]));
        });

        return $(result);
      }
    }else {

      throw Error("Invalid Arguments");
    }

    options = $.extend(JSON.parse(JSON.stringify(DEFAULTS)), options);

    return $.each($nodes, function () {

               rateYoInstances.push(new RateYo($(this), options));
           });
  }

  $.fn.rateYo = rateYo;

}(jQuery));
