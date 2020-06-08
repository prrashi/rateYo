import {
  BASICSTAR,
  DEFAULTS,
  MULTICOLOR_OPTIONS
} from "./constants.js";

import {
  isMobileBrowser,
  checkPrecision,
  checkBounds,
  isDefined,
  getColor
} from "./utils.js";

import "./styles.scss";

import $ from "./$.js";

const instanceMap = new WeakMap();

function RateYo (node, options={}) {

  if (!(this instanceof RateYo)) {

    return new RateYo(node, options);
  }

  if (instanceMap.has(node)) {

    return instanceMap.get(node);
  }

  var that = this;

  this.node = node;

  const $node = $(node);

  options = {...DEFAULTS, ...options, ...$node.dataAttrOptions()};

  // Remove any stuff that is present inside the container, and add the plugin class
  $node.empty().addClass("jq-ry-container");

  /*
   * Basically the plugin displays the rating using two rows of stars lying one above
   * the other, the row that is on the top represents the actual rating, and the one
   * behind acts just like a background.
   *
   * `$groupWrapper`: is an element that wraps both the rows
   * `$normalGroup`: is the container for row of stars thats behind and
   *                 acts as background
   * `$ratedGroup`: is the container for row of stars that display the actual rating.
   *
   * The rating is displayed by adjusting the width of `$ratedGroup`
   */
  var $groupWrapper = $(document.createElement("div"))
                        .addClass("jq-ry-group-wrapper")
                        .appendTo($node);

  var $normalGroup = $(document.createElement("div"))
                       .addClass("jq-ry-normal-group")
                       .addClass("jq-ry-group")
                       .appendTo($groupWrapper);

  var $ratedGroup = $(document.createElement("div"))
                      .addClass("jq-ry-rated-group")
                      .addClass("jq-ry-group")
                      .appendTo($groupWrapper);

  /*
   * Variable `step`: store the value of the rating for each star
   *                  eg: if `maxValue` is 5 and `numStars` is 5, value of each star
   *                      is 1.
   * Variable `starWidth`: stores the decimal value of width of star in units of px
   * Variable `percentOfStar`: stores the percentage of width each star takes w.r.t
   *                           the container
   * Variable `spacing`: stores the decimal value of the spacing between stars
   *                     in the units of px
   * Variable `percentOfSpacing`: stores the percentage of width of the spacing
   *                              between stars w.r.t the container
   */
  var step, starWidth, percentOfStar, spacing,
      percentOfSpacing, containerWidth, minValue = 0;

  /*
   * `currentRating` contains rating that is being displayed at the latest point of
   * time.
   *
   * When ever you hover over the plugin UI, the rating value changes
   * according to the place where you point the cursor, currentRating contains
   * the current value of rating that is being shown in the UI
   */
  var currentRating = options.rating;

  // A flag to store if the plugin is already being displayed in the UI
  var isInitialized = false;

  function showRating (ratingVal) {

    /*
     * The function is responsible for displaying the rating by changing
     * the width of `$ratedGroup`
     */

    if (!isDefined(ratingVal)) {

      ratingVal = options.rating;
    }

    // Storing the value that is being shown in `currentRating`.
    currentRating = ratingVal;

    var numStarsToShow = ratingVal / step;

    // calculating the percentage of width of $ratedGroup with respect to its parent
    var percent = numStarsToShow * percentOfStar;

    if (numStarsToShow > 1) {

      // adding the percentage of space that is taken by the gap the stars
      percent += (Math.ceil(numStarsToShow) - 1) * percentOfSpacing;
    }

    setRatedFill(options.ratedFill);

    percent = options.rtl ? 100 - percent : percent;

    if (percent < 0) {

      percent = 0;
    } else if (percent > 100) {

      percent = 100;
    }

    $ratedGroup.css("width", percent + "%");
  }

  function setContainerWidth () {

    /*
     * Set the width of the `this.node` based on the width of each star and
     * the space between them
     */

    containerWidth = starWidth * options.numStars +
                     spacing * (options.numStars - 1);

    percentOfStar = (starWidth / containerWidth) * 100;

    percentOfSpacing = (spacing / containerWidth) * 100;

    $node.width(containerWidth);

    showRating();
  }

  function setStarWidth (newWidth) {

    /*
     * Set the width and height of each SVG star, called whenever one changes the
     * `starWidth` option
     */

    // The width and height of the star should be the same
    var starHeight = options.starWidth = newWidth;

    starWidth = window.parseFloat(options.starWidth.replace("px", ""));

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

    /*
     * Set spacing between the SVG stars, called whenever one changes
     * the `spacing` option
     */

    options.spacing = newSpacing;

    spacing = parseFloat(options.spacing.replace("px", ""));

    $normalGroup.find("svg:not(:first-child)")
                .css(`margin-left`, newSpacing);

    $ratedGroup.find("svg:not(:first-child)")
               .css("margin-left", newSpacing);

    setContainerWidth();

    return $node;
  }

  function setNormalFill (newFill) {

    /*
     * Set the background fill of the Stars, called whenever one changes the
     * `normalFill` option
     */

    options.normalFill = newFill;

    var $svgs = (options.rtl ? $ratedGroup : $normalGroup).find("svg");

    $svgs.attr({fill: options.normalFill});

    return $node;
  }

  /*
   * Store the recent `ratedFill` option in a variable
   * so that if multiColor is unset, we can use the perviously set `ratedFill`
   * from this variable
   */
  var ratedFill = options.ratedFill;

  function setRatedFill (newFill) {

    /*
     * Set ratedFill of the stars, called when one changes the `ratedFill` option
     */

    /*
     * If `multiColor` option is set, `newFill` variable is dynamically set
     * based on the rating, what ever set as parameter will be discarded
     */
    if (options.multiColor) {

      var ratingDiff = currentRating - minValue,
          percentCovered = (ratingDiff/options.maxValue)*100;

      var colorOpts  = options.multiColor || {},
          startColor = colorOpts.startColor || MULTICOLOR_OPTIONS.startColor,
          endColor   = colorOpts.endColor || MULTICOLOR_OPTIONS.endColor;

      newFill = getColor(startColor, endColor, percentCovered);
    } else {

      ratedFill = newFill;
    }

    options.ratedFill = newFill;

    var $svgs = (options.rtl ? $normalGroup : $ratedGroup).find("svg");

    $svgs.attr({fill: options.ratedFill});

    return $node;
  }

  function setRtl (newValue) {

    newValue = !!newValue;

    options.rtl = newValue;

    setNormalFill(options.normalFill);
    showRating();
  }

  function setMultiColor (colorOptions) {

    /*
     * called whenever one changes the `multiColor` option
     */

    options.multiColor = colorOptions;

    // set the recently set `ratedFill` option, if multiColor Options are unset
    setRatedFill(colorOptions ? colorOptions : ratedFill);
  }

  function setNumStars (newValue) {

    /*
     * Set the number of stars to use to display the rating, called whenever one
     * changes the `numStars` option
     */

    options.numStars = newValue;

    step = options.maxValue/options.numStars;

    $normalGroup.empty();
    $ratedGroup.empty();

    for (var i=0; i<options.numStars; i++) {

      $(options.starSvg || BASICSTAR).appendTo($normalGroup);
      $(options.starSvg || BASICSTAR).appendTo($ratedGroup);
    }

    setStarWidth(options.starWidth);
    setNormalFill(options.normalFill);
    setSpacing(options.spacing);

    showRating();

    return $node;
  }

  function setMaxValue (newValue) {

    /*
     * set the Maximum Value of rating to be allowed, called whenever
     * one changes the `maxValue` option
     */

    options.maxValue = newValue;

    step = options.maxValue/options.numStars;

    if (options.rating > newValue) {

      setRating(newValue);
    }

    showRating();

    return $node;
  }

  function setPrecision (newValue) {

    /*
     * Set the precision of the rating value, called if one changes the
     * `precision` option
     */

    options.precision = newValue;

    setRating(options.rating);

    return $node;
  }

  function setHalfStar (newValue) {

    /*
     * This function will be called if one changes the `halfStar` option
     */

    options.halfStar = newValue;

    return $node;
  }

  function setFullStar (newValue) {

    /*
     * This function will be called if one changes the `fullStar` option
     */

    options.fullStar = newValue;

    return $node;
  }

  function round (value) {

    /*
     * Rounds the value of rating if `halfStar` or `fullStar` options are chosen
     */

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

    /*
     * Calculates and returns the rating based on the position of cursor w.r.t the
     * plugin container
     */

    var position = $normalGroup.offset(),
        nodeStartX = position.left,
        nodeEndX = nodeStartX + $normalGroup.width();

    var maxValue = options.maxValue;

    // The x-coordinate(position) of the mouse pointer w.r.t page
    var pageX = e.pageX;

    var calculatedRating = 0;

    // If the mouse pointer is to the left of the container
    if(pageX < nodeStartX) {

      calculatedRating = minValue;
    }else if (pageX > nodeEndX) { // If the mouse pointer is right of the container

      calculatedRating = maxValue;
    }else { // If the mouse pointer is inside the continer

      /*
       * The fraction of width covered by the pointer w.r.t to the total width
       * of the container.
       */
      var calcPrcnt = ((pageX - nodeStartX)/(nodeEndX - nodeStartX));

      if (spacing > 0) {

        /*
         * If there is spacing between stars, take the percentage of width covered
         * and subtract the percentage of width covered by stars and spacing, to find
         * how many stars are covered, the number of stars covered is the rating
         *
         * TODO: I strongly feel that this logic can be improved!, Please help!
         */
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

        /*
         * If there is not spacing between stars, the fraction of width covered per
         * `maxValue` is the rating
         */
        calculatedRating = calcPrcnt * (options.maxValue);
      }

      // Round the rating if `halfStar` or `fullStar` options are chosen
      calculatedRating = round(calculatedRating);
    }

    if (options.rtl) {

      calculatedRating = maxValue - calculatedRating;
    }

    return parseFloat(calculatedRating);
  }

  function setReadOnly (newValue) {

    /*
     * UnBinds mouse event handlers, called when whenever one changes the
     * `readOnly` option
     */

    options.readOnly = newValue;

    $node.attr({"readonly": true});

    unbindEvents();

    if (!newValue) {

      $node.removeAttr("readonly");

      bindEvents();
    }

    return $node;
  }

  function setRating (newValue) {

    /*
     * Sets the rating of the Plugin, Called when option `rating` is changed
     * or, when `rating` method is called
     */

    var rating = newValue;

    var maxValue = options.maxValue;

    if (typeof rating === "string") {

      // If rating is given in percentage, maxValue should be 100
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

    /*
     * set what method to be called on Initialization
     */

    options.onInit = method;

    return $node;
  }

  function setOnSet (method) {

    /*
     * set what method to be called when rating is set
     */

    options.onSet = method;

    return $node;
  }

  function setOnChange (method) {

    /*
     * set what method to be called rating in the UI is changed
     */

    options.onChange = method;

    return $node;
  }

  this.rating = function (newValue) {

    /*
     * rating getter/setter
     */

    if (!isDefined(newValue)) {

      return options.rating;
    }

    setRating(newValue);

    return $node;
  };

  this.destroy = function () {

    /*
     * Removes the Rating UI by clearing the content, and removing the custom classes
     */

    if (!options.readOnly) {

      unbindEvents();
    }

    instanceMap.delete(node);

    $node.removeClass("jq-ry-container").children().remove();

    return $node;
  };

  this.method = function (methodName) {

    /*
     * Method to call the methods of RateYo Instance
     */

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

    /*
     * Method to get/set Options
     */

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
      case "rtl":

        method = setRtl;
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

  function onMouseEnter (e) {
    if (!options.hover) {
      return;
    }
    /*
     * If the Mouse Pointer is inside the container, calculate and show the rating
     * in UI
     */

    var rating = calculateRating(e).toFixed(options.precision);

    var maxValue = options.maxValue;

    rating = checkPrecision(parseFloat(rating), minValue, maxValue);

    showRating(rating);

    $node.trigger("rateyo.change", {rating: rating});
  }

  function onMouseLeave () {
    if (isMobileBrowser() || !options.hover) {
      return;
    }

    /*
     * If mouse leaves, revert the rating in UI to previously set rating,
     * when empty value is passed to showRating, it will take the previously set
     * rating
     */

    showRating();

    $node.trigger("rateyo.change", {rating: options.rating});
  }

  function onMouseClick (e) {

    /*
     * On clicking the mouse inside the container, calculate and set the rating
     */

    var resultantRating = calculateRating(e).toFixed(options.precision);
    resultantRating = parseFloat(resultantRating);

    that.rating(resultantRating);
  }

  function onInit(e, data) {

    if(options.onInit && typeof options.onInit === "function") {

      options.onInit.apply(this, [data.rating, that]);
    }
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

  setNumStars(options.numStars);
  setReadOnly(options.readOnly);

  if (options.rtl) {

    setRtl(options.rtl);
  }

  instanceMap.set(node, this);
  this.rating(options.rating, true);

  isInitialized = true;
  $node.trigger("rateyo.init", {rating: options.rating});
}

Object.defineProperty(RateYo.prototype, "on", {
  value: function on (eventName, handler) {

    $(this.node).on(eventName, handler);

    return this;
  }
});

Object.defineProperty(RateYo.prototype, "off", {
  value: function off (eventName, handler) {

    $(this.node).off(eventName, handler);

    return this;
  }
});

Object.defineProperty(RateYo, "has", {
  value: function has (node) {

    return instanceMap.has(node);
  }
});

Object.defineProperty(RateYo, "get", {
  value: function get (node) {

    return instanceMap.get(node);
  }
});

Object.defineProperty(RateYo, "_$", {
  get () {
    return $;
  }
})

export default RateYo;
