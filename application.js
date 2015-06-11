$(function () {
  "use strict";

  var rating = 3.6;

  function getRandomRating (min, max) {

    min = min || 0;
    max = max || 5;

    var randomRating = parseFloat(((Math.random())*max).toFixed(2));

    randomRating = randomRating < min? min : randomRating;

    return randomRating;
  }

  $("#rateYo").rateYo({

    rating: rating
  });

  var $options = $("div.options-content div.option");

  /* Option - starWidth */
  var $widthDemo = $options.filter(".option-starWidth")
                           .find("div.rating");
  $widthDemo.rateYo({

    rating: getRandomRating(),
    starWidth: $widthDemo.attr("data-width")
  });

  /* Option - normalFill */
  var $normalFillDemo = $options.filter(".option-normalFill")
                                .find("div.rating");
  $normalFillDemo.rateYo({
    normalFill: $normalFillDemo.attr("data-color")
  });

  /* Option - ratedFill */
  var $ratedFillDemo = $options.filter(".option-ratedFill")
                               .find("div.rating");
  $ratedFillDemo.rateYo({
    rating: 3.8,
    ratedFill: $ratedFillDemo.attr("data-color")
  });

  /* Option - numStars */
  var $numStarsDemo = $options.filter(".option-numStars")
                              .find("div.rating");
  $numStarsDemo.rateYo({
    rating: getRandomRating(),
    numStars: parseFloat($numStarsDemo.attr("data-number"))
  });

  var updateCounter = function (rating) {

    $(this).next(".counter").text(rating);
  };

  /* Option - spacing*/
  var $spacingDemo = $options.filter(".option-spacing")
                              .find("div.rating"),
      spacing = $spacingDemo.attr("data-value");

  $spacingDemo.rateYo({
    rating: getRandomRating(0, 1),
    spacing: spacing,
    onSet: updateCounter,
    onChange: updateCounter
  });

  /* Option - maxValue */
  var $maxValueDemo = $options.filter(".option-maxValue")
                              .find("div.rating");

  $maxValueDemo.rateYo({
    maxValue: 1,
    numStars: 1,
    rating: getRandomRating(0, 1),
    onSet: updateCounter,
    onChange: updateCounter,
    starWidth: "50px"
  });

  /* Option - precision */
  var $precisionDemo = $options.filter(".option-precision")
                               .find("div.rating");

  $precisionDemo.rateYo({
    precision: 2,
    rating: getRandomRating(),
    onSet: updateCounter,
    onChange: updateCounter
  });

  /* Option - rating */
  var $ratingDemo = $options.filter(".option-rating")
                            .find("div.rating");

  $ratingDemo.rateYo({
    rating: $ratingDemo.attr("data-rating"),
    onSet: updateCounter,
    onChange: updateCounter,
    precision: 0
  });

  var $halfStarDemo = $options.filter(".option-halfStar")
                             .find("div.rating");

  $halfStarDemo.rateYo({
    rating: 1.5,
    halfStar: true  
  });

  var $fullStarDemo = $options.filter(".option-fullStar")
                             .find("div.rating");

  $fullStarDemo.rateYo({
    rating: 2,
    fullStar: true  
  });

  var $readOnlyDemo = $options.filter(".option-readonly")
                              .find("div.rating");

  $readOnlyDemo.rateYo({
    rating: 3.2,
    readOnly: true
  });

  (function () {

    var $onSetDemo = $options.filter(".option-onSet")
                             .find("div.rating"),
        initialized = false;

    $onSetDemo.rateYo({
      onSet: function (rating) {

        if (!initialized) {

          initialized = true;
          return;
        }

        window.alert("Rating is set to: " + rating);
      }
    });

  }());

  (function () {

    var $onChangeDemo = $options.filter(".option-onChange")
                                .find("div.rating"),
        initialized = false;

    $onChangeDemo.rateYo({

      onChange: function (rating) {

        $(this).next().text(rating);
      },
      rating: getRandomRating()
    });

  }());

  var $methods = $("div.methods-content div.method");

  var $optionMethodDemo = $methods.filter(".method-option")
                                  .find("div.rating");

  var getColor = function (options, rating) {

    var minValue = options.minValue,
        maxValue = options.maxValue,
        halfValue = (options.maxValue - options.minValue)/2,
        startColor = "#c0392b",
        endColor = "#f1c40f";

    var perentageCovered = ((rating - minValue)/maxValue)*100;

    var newColor = window.coolColor.pickColor(startColor,
                                              endColor, perentageCovered);
    return newColor;
  };

  var changeRating = function (rating) {
    var options = $(this).rateYo("option");

    var newColor = getColor(options, rating);

    $(this).rateYo("option", "ratedFill", newColor);
  };

  var options = {
    rating: 0.5,
    numStars: 5,
    precision: 2,
    minValue: 0,
    maxValue: 5
  };

  options.ratedFill = getColor(options, options.rating);

  $optionMethodDemo.rateYo(options).on("rateyo.change", function (e, data) {
    changeRating.apply(this, [data.rating]);
  }).on("rateyo.set", function (e, data) {
    changeRating.apply(this, [data.rating]);
  });

  var $ratingMethodDemo = $methods.filter(".method-rating")
                                  .find("div.rating");

  var $ratingActions = $ratingMethodDemo.rateYo().nextAll("div");

  $ratingActions.on("click", "button.get-rating", function () {

    var rating = $ratingMethodDemo.rateYo("method", "rating");
    window.alert("its " + rating + " Yo!");
  }).on("click", "button.set-rating", function () {

    var rating = getRandomRating();
    $ratingMethodDemo.rateYo("method", "rating", rating);
  });

  var $destroyMethodDemo = $methods.filter(".method-destroy")
                                   .find("div.rating");

  var $ratingActions = $destroyMethodDemo.rateYo().nextAll("div");

  $ratingActions.on("click", "button.destroy", function () {

    $destroyMethodDemo.rateYo("method", "destroy");
  }).on("click", "button.initialize", function () {

    $destroyMethodDemo.rateYo();
  });

  var $events = $("div.events-content div.event");

  var $setDemo = $events.filter(".event-set")
                        .find("div.rating");

  $setDemo.rateYo().on("rateyo.set", function (e, data) {

    alert("The rating is set to " + data.rating + "!");
  });

  var $changeDemo = $events.filter(".event-change")
                           .find("div.rating");

  $changeDemo.rateYo().on("rateyo.change", function (e, data) {

    $(this).next().text(data.rating);
  });
});

