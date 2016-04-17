/*****
* rateYo - v2.1.0
* http://prrashi.github.io/rateyo/
* Copyright (c) 2014 Prashanth Pamidi; Licensed MIT
*****/

;(function ($) {
  "use strict";

  /* The basic svg string required to generate stars
   */
  var BASICSTAR = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"+
                  "<svg version=\"1.1\""+
                        "xmlns=\"http://www.w3.org/2000/svg\""+
                        "viewBox=\"0 12.705 512 486.59\""+
                        "x=\"0px\" y=\"0px\""+
                        "xml:space=\"preserve\">"+
                    "<polygon "+
                              "points=\"256.814,12.705 317.205,198.566"+
                                      " 512.631,198.566 354.529,313.435 "+
                                      "414.918,499.295 256.814,384.427 "+
                                      "98.713,499.295 159.102,313.435 "+
                                      "1,198.566 196.426,198.566 \"/>"+
                  "</svg>";

  var DEFAULTS = {

    starWidth : "32px",
    normalFill: "gray",
    ratedFill : "#f39c12",
    numStars  : 5,
    maxValue  : 5,
    precision : 1,
    rating    : 0,
    fullStar  : false,
    halfStar  : false,
    readOnly  : false,
    spacing   : "0px",
    multiColor: null,
    onInit    : null,
    onChange  : null,
    onSet     : null
  };

  //Default colors for multi-color rating
  var MULTICOLOR_OPTIONS = {

    startColor: "#c0392b", //red
    endColor  : "#f1c40f"  //yellow
  };

  function checkPrecision (value, minValue, maxValue) {

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

  function isDefined(value) {

    return typeof value !== "undefined";
  }

  var hexRegex = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;

  var hexToRGB = function (hex) {

    if (!hexRegex.test(hex)) {

      return null;
    }

    var hexValues = hexRegex.exec(hex),
	r = parseInt(hexValues[1], 16),
	g = parseInt(hexValues[2], 16),
	b = parseInt(hexValues[3], 16);

    return {r:r, g:g, b:b};
  };

  function getPick(startVal, endVal, pick) {

    var newVal = (endVal - startVal)*(pick/100);
 
    newVal = Math.round(startVal + newVal).toString(16);

    if (newVal.length === 1) {

	newVal = "0" + newVal;
    }

    return newVal;
  }

  function pickColor (startColor, endColor, pick) {

    /*
     * @param: `pick` is the percentage of `endColor` to be
     *         mixed with the `startColor`
     */

    if (!startColor || !endColor) {

      return null;
    }

    pick = isDefined(pick)? pick : 0;

    startColor = hexToRGB(startColor);
    endColor = hexToRGB(endColor);

    var r = getPick(startColor.r, endColor.r, pick),
        b = getPick(startColor.b, endColor.b, pick),
        g = getPick(startColor.g, endColor.g, pick);

    return "#" + r + g + b;
  }

  /* The Contructor, whose instances are used by plugin itself,
   * to set and get values
   */
  function RateYo ($node, options) {

    this.$node = $node;

    this.node = $node.get(0);

    var that = this;

    $node.addClass("jq-ry-container");

    var $groupWrapper = $("<div/>").addClass("jq-ry-group-wrapper")
                                   .appendTo($node);

    var $normalGroup = $("<div/>").addClass("jq-ry-normal-group")
                                  .addClass("jq-ry-group")
                                  .appendTo($groupWrapper);

    var $ratedGroup = $("<div/>").addClass("jq-ry-rated-group")
                                 .addClass("jq-ry-group")
                                 .appendTo($groupWrapper);

    var step, starWidth, percentOfStar, spacing,
        percentOfSpacing, containerWidth, minValue = 0;

    var currentRating = options.rating;

    var isInitialized = false;

    function showRating (ratingVal) {

      if (!isDefined(ratingVal)) {

        ratingVal = options.rating;
      }

      currentRating = ratingVal;

      var numStarsToShow = ratingVal/step;

      var percent = numStarsToShow*percentOfStar;

      if (numStarsToShow > 1) {

        percent += (Math.ceil(numStarsToShow) - 1)*percentOfSpacing;
      }

      setRatedFill(options.ratedFill);

      $ratedGroup.css("width", percent + "%");
    }

    function setContainerWidth () {

      containerWidth = starWidth*options.numStars;

      containerWidth += spacing*(options.numStars - 1);

      percentOfStar = (starWidth/containerWidth)*100;

      percentOfSpacing = (spacing/containerWidth)*100;

      $node.width(containerWidth);

      showRating();
    }

    function setStarWidth (newWidth) {

      // In the current version, the width and height of the star
      // should be the same
      var starHeight = options.starWidth = newWidth;

      starWidth = parseFloat(options.starWidth.replace("px", ""));
 
      $normalGroup.find("svg")
                  .attr({width : options.starWidth,
                         height: starHeight});

      $ratedGroup.find("svg")
                 .attr({width : options.starWidth,
                        height: starHeight});

      setContainerWidth();
       
      return $node;
    }

    function setSpacing (newSpacing) {
      
      options.spacing = newSpacing;

      spacing = parseFloat(options.spacing.replace("px", ""));

      $normalGroup.find("svg:not(:first-child)")
                  .css({"margin-left": newSpacing});

      $ratedGroup.find("svg:not(:first-child)")
                 .css({"margin-left": newSpacing}); 

      setContainerWidth();

      return $node;
    }

    function setNormalFill (newFill) {

      options.normalFill = newFill;

      $normalGroup.find("svg").attr({fill: options.normalFill});

      return $node;
    }

    /* Store the recent `ratedFill` option in a variable
     * so that if multiColor is unset, we can use the color
     * in this variable
     */
    var ratedFill = options.ratedFill;

    function setRatedFill (newFill) {

      if (options.multiColor) {

        var percentCovered = currentRating - options.minValue;
        percentCovered = (percentCovered/options.maxValue)*100;

        var colorOpts  = options.multiColor,
            startColor = colorOpts.startColor || MULTICOLOR_OPTIONS.startColor,
            endColor   = colorOpts.endColor || MULTICOLOR_OPTIONS.endColor;

        newFill = pickColor(startColor, endColor, percentCovered);
      } else {

        ratedFill = newFill;
      }

      options.ratedFill = newFill;

      $ratedGroup.find("svg").attr({fill: options.ratedFill});

      return $node;
    }

    function setMultiColor (colorOptions) {

      options.multiColor = colorOptions;

      /* set the recently set `ratedFill` option,
       * if multiColor Options are unset
       */
      setRatedFill(colorOptions ? colorOptions : ratedFill);
    }

    function setNumStars (newValue) {

      options.numStars = newValue;

      step = options.maxValue/options.numStars;

      $normalGroup.empty();
      $ratedGroup.empty();

      for (var i=0; i<options.numStars; i++) {

        $normalGroup.append($(BASICSTAR));
        $ratedGroup.append($(BASICSTAR));
      }

      setStarWidth(options.starWidth);
      setNormalFill(options.normalFill);
      setSpacing(options.spacing);

      showRating();

      return $node;
    }

    function setMaxValue (newValue) {

      options.maxValue = newValue;

      step = options.maxValue/options.numStars;

      if (options.rating > newValue) {
      
        setRating(newValue); 
      }

      showRating();

      return $node;
    }

    function setPrecision (newValue) {

      options.precision = newValue;

      setRating(options.rating);

      return $node;
    }

    function setHalfStar (newValue) {

      options.halfStar = newValue;

      return $node;
    }

    function setFullStar (newValue) {
    
      options.fullStar = newValue;

      return $node;
    }

    function round (value) {
      
      var remainder = value%step,
          halfStep = step/2,
          isHalfStar = options.halfStar,
          isFullStar = options.fullStar;

      if (!isFullStar && !isHalfStar) {
      
        return value;  
      }

      if (isFullStar || (isHalfStar && remainder > halfStep)) {
      
        value += step - remainder;
      } else {
      
        value = value - remainder;
        
        if (remainder > 0) {
          
          value += halfStep;
        }
      }

      return value;
    }

    function calculateRating (e) {

      var position = $normalGroup.offset(),
          nodeStartX = position.left,
          nodeEndX = nodeStartX + $normalGroup.width();

      var maxValue = options.maxValue;

      var pageX = e.pageX;

      var calculatedRating = 0;

      if(pageX < nodeStartX) {

        calculatedRating = minValue;
      }else if (pageX > nodeEndX) {

        calculatedRating = maxValue;
      }else {

        var calcPrcnt = ((pageX - nodeStartX)/(nodeEndX - nodeStartX));

        if (spacing > 0) {

          calcPrcnt *= 100;

          var remPrcnt = calcPrcnt;

          while (remPrcnt > 0) {
            
            if (remPrcnt > percentOfStar) {

              calculatedRating += step;
              remPrcnt -= (percentOfStar + percentOfSpacing);
            } else {

              calculatedRating += remPrcnt/percentOfStar*step;
              remPrcnt = 0;
            }  
          }
        } else {
        
          calculatedRating = calcPrcnt * (options.maxValue);  
        }

        calculatedRating = round(calculatedRating);
      }

      return calculatedRating;
    }

    function onMouseEnter (e) {

      var rating = calculateRating(e).toFixed(options.precision);

      var maxValue = options.maxValue;

      rating = checkPrecision(parseFloat(rating), minValue, maxValue);

      showRating(rating);

      $node.trigger("rateyo.change", {rating: rating});
    }

    function onMouseLeave () {

      showRating();

      $node.trigger("rateyo.change", {rating: options.rating});
    }

    function onMouseClick (e) {

      var resultantRating = calculateRating(e).toFixed(options.precision);
      resultantRating = parseFloat(resultantRating);

      that.rating(resultantRating);
    }
    
    function onInit(e, data) {
      
      if(options.onInit && typeof options.onInit === "function") {
        
        /* jshint validthis:true */
        options.onInit.apply(this, [data.rating, that]);
      }
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
           .on("rateyo.init", onInit)
           .on("rateyo.change", onChange)
           .on("rateyo.set", onSet);
    }

    function unbindEvents () {

      $node.off("mousemove", onMouseEnter)
           .off("mouseenter", onMouseEnter)
           .off("mouseleave", onMouseLeave)
           .off("click", onMouseClick)
           .off("rateyo.init", onInit)
           .off("rateyo.change", onChange)
           .off("rateyo.set", onSet);
    }

    function setReadOnly (newValue) {

      options.readOnly = newValue;

      $node.attr("readonly", true);

      unbindEvents();

      if (!newValue) {

        $node.removeAttr("readonly");

        bindEvents();
      }

      return $node;
    }

    function setRating (newValue) {

      var rating = newValue;

      var maxValue = options.maxValue;

      if (typeof rating === "string") {

        if (rating[rating.length - 1] === "%") {

          rating = rating.substr(0, rating.length - 1);
          maxValue = 100;

          setMaxValue(maxValue);
        }

        rating = parseFloat(rating);
      }

      checkBounds(rating, minValue, maxValue);

      rating = parseFloat(rating.toFixed(options.precision));

      checkPrecision(parseFloat(rating), minValue, maxValue);

      options.rating = rating;

      showRating();

      if (isInitialized) {

        $node.trigger("rateyo.set", {rating: rating});
      }

      return $node;
    }

    function setOnInit (method) {

      options.onInit = method;

      return $node;
    }

    function setOnSet (method) {

      options.onSet = method;

      return $node;
    }

    function setOnChange (method) {

      options.onChange = method;

      return $node;
    }

    this.rating = function (newValue) {

      if (!isDefined(newValue)) {

        return options.rating;
      }

      setRating(newValue);

      return $node;
    };

    this.destroy = function () {

      if (!options.readOnly) {

        unbindEvents();
      }

      RateYo.prototype.collection = deleteInstance($node.get(0),
                                                   this.collection);

      $node.removeClass("jq-ry-container").children().remove();

      return $node;
    };

    this.method = function (methodName) {

      if (!methodName) {

        throw Error("Method name not specified!");
      }

      if (!isDefined(this[methodName])) {

        throw Error("Method " + methodName + " doesn't exist!");
      }

      var args = Array.prototype.slice.apply(arguments, []),
          params = args.slice(1),
          method = this[methodName];

      return method.apply(this, params);
    };

    this.option = function (optionName, param) {

      if (!isDefined(optionName)) {

        return options;
      }

      var method;

      switch (optionName) {

        case "starWidth":

          method = setStarWidth;
          break;
        case "numStars":

          method = setNumStars;
          break;
        case "normalFill":

          method = setNormalFill;
          break;
        case "ratedFill":

          method = setRatedFill;
          break;
        case "multiColor":

          method = setMultiColor;
          break;
        case "maxValue":

          method = setMaxValue;
          break;
        case "precision":

          method = setPrecision;
          break;
        case "rating":

          method = setRating;
          break;
        case "halfStar":

          method = setHalfStar;
          break;
        case "fullStar":
        
          method = setFullStar;
          break;
        case "readOnly":

          method = setReadOnly;
          break;
        case "spacing":
        
          method = setSpacing;
          break;
        case "onInit":
          
          method = setOnInit;
          break;
        case "onSet":

          method = setOnSet;
          break;
        case "onChange":

          method = setOnChange;
          break;
        default:

          throw Error("No such option as " + optionName);
      }

      return isDefined(param) ? method(param) : options[optionName];
    };

    setNumStars(options.numStars);
    setReadOnly(options.readOnly);

    this.collection.push(this);
    this.rating(options.rating, true);

    isInitialized = true;
    $node.trigger("rateyo.init", {rating: options.rating});
  }

  RateYo.prototype.collection = [];

  window.RateYo = RateYo;

  function _rateYo (options) {

    var rateYoInstances = RateYo.prototype.collection;

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
    }else if (args.length >= 1 && typeof args[0] === "string") {

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

      result = result.length === 1? result[0]: $(result);

      return result;
    }else {

      throw Error("Invalid Arguments");
    }

    options = $.extend({}, DEFAULTS, options);

    return $.each($nodes, function () {

               var existingInstance = getInstance(this, rateYoInstances);

               if (!existingInstance) {

                 return new RateYo($(this), $.extend({}, options));
               }
           });
  }

  function rateYo () {

    /* jshint validthis:true */
    return _rateYo.apply(this, Array.prototype.slice.apply(arguments, []));
  }

  $.fn.rateYo = rateYo;

}(jQuery));
