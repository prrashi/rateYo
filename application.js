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

  /* Option - minValue */
  var $minValueDemo = $options.filter(".option-minValue")
                              .find("div.rating"),
      minValue = parseInt($minValueDemo.attr("data-value"));

  $minValueDemo.rateYo({
    minValue: minValue,
    rating: getRandomRating(minValue),
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

  var $onChangeDemo = $options.filter(".option-onChange")
                              .find("div.rating"),
      initialized = false;

  $onChangeDemo.rateYo({

    onChange: function (rating) {

      $(this).next().text(rating);
    },
    rating: getRandomRating()
  });

  var $methods = $("div.methods-content div.method");

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

