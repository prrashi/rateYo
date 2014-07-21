/*! rateYo - v0.0.1
* http://prrashi.github.io/rateyo/
* Copyright (c) 2014 Prashanth Pamidi; Licensed MIT */
;(function ($) {
  "use strict";

  var BASICSTAR = '<?xml version="1.0" encoding="utf-8"?>'+
                  '<svg version="1.1" id="Layer_1"'+
                        'xmlns="http://www.w3.org/2000/svg"'+
                        'viewBox="0 12.705 512 486.59"'+
                        'x="0px" y="0px"'+
                        'xml:space="preserve">'+
                    '<polygon id="star-icon"'+
                              'points="256.814,12.705 317.205,198.566'+
                                      ' 512.631,198.566 354.529,313.435 '+
                                      '414.918,499.295 256.814,384.427 '+
                                      '98.713,499.295 159.102,313.435 '+
                                      '1,198.566 196.426,198.566 "/>'+
                  '</svg>';

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
    onEnter: null,
    onClick: null,
    onLeave: null
  };

  function RateYo ($node, options) {

    this.$node = $node;

    var that = this;

    var rating = options.rating;

    var containerWidth = parseInt(options.starWidth.replace("px","").trim());

    containerWidth = containerWidth*options.numStars;

    $node.addClass('jq-ry-container')
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

    var $nomalSVGs = $normalGroup.find("svg")
                             .attr({width: options.starWidth,
                                    height: options.starHeight,
                                    fill: options.normalFill,
                                    stroke: options.stroke,
                                    "stroke-width": options.strokeWidth});

    var $ratedSVGs = $ratedGroup.find("svg")
                            .attr({width: options.starWidth,
                                   height: options.starHeight,
                                   fill: options.ratedFill,
                                   stroke: options.stroke,
                                   "stroke-width": options.strokeWidth});

    var containerHeight = $node.height();

    var position = $normalGroup.offset(),
        nodeStartX = position.left,
        nodeStartY = position.top,
        nodeEndX = nodeStartX + $normalGroup.width(),
        nodeEndY = nodeStartY + containerHeight;

    function getRating () {

      return rating;
    }

    function setRating (new_value) {

      rating = new_value;
    }

    function showRating (ratingVal) {

      ratingVal = ratingVal || rating;

      var percent = (ratingVal/options.maxValue)*100;

      $ratedGroup.css("width", percent + "%");
    }

    function _calculateRating (e) {

      var pageX = e.pageX,
          pageY = e.pageY;

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

    function onMouseMove (e) {

      var rating = _calculateRating(e);

      showRating(rating);

      if(options.onEnter && typeof options.onEnter === "function") {

        options.onEnter.apply($node, [rating.toFixed(1), that]);
      }
    }

    function onMouseEnter (e) {

      showRating(_calculateRating(e));
    }

    function onMouseLeave (e) {

      showRating();

      if(options.onLeave && typeof options.onLeave === "function") {

        options.onLeave.apply($node, [rating, that]);
      }
    }

    function onMouseClick (e) {

      var resultantRating = _calculateRating(e).toFixed(1);

      setRating(resultantRating);

      showRating();

      if(options.onClick && typeof options.onClick === "function") {

        options.onClick.apply($node, [resultantRating, that]);
      }
    };

    function bindEvents () {

      $node.on("mousemove", onMouseMove)
           .on("mouseenter", onMouseEnter)
           .on("mouseleave", onMouseLeave)
           .on("click", onMouseClick);
    }

    function unbindEvents () {

      $node.off("mousemove", onMouseMove)
           .off("mouseenter", onMouseEnter)
           .off("mouseleave", onMouseLeave)
           .off("click", onMouseClick);
    }

    this.destroy = function () {

      unbindEvents();
      $node.remove();
    };

    bindEvents();
    showRating();
  }

  var rateYoInstances = RateYo.prototype.collection = [];

  function rateYo (options) {

    options = options || {};

    options = $.extend(JSON.parse(JSON.stringify(DEFAULTS)), options);

    var $nodes = $(this);

    return $.each($nodes, function () {

      rateYoInstances.push(new RateYo($(this), options));
    });
  }

  $.fn.rateYo = rateYo;

}(jQuery));
