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

  var $multiColorDemo = $options.filter(".option-multiColor")
                                .find("div.rating");

  $multiColorDemo.rateYo({

    rating    : 1.6,
    multiColor: {

      "startColor": "#FF0000",
      "endColor"  : "#00FF00"
    }
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

  /* Option - rtl */
  var $rtl = $options.filter(".option-rtl")
                     .find("div.rating");

  $rtl.rateYo({

    rating: 3.2,
    rtl:true
  }).on("rateyo.change", function (e, data) {

    updateCounter.apply(this, [data.rating]);
  }).on("rateyo.set", function (e, data) {

    updateCounter.apply(this, [data.rating]);
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

    var $onInitDemo = $options.filter(".option-onInit")
                             .find("div.rating");

    $onInitDemo.rateYo({
      onInit: function (rating) {

        window.console.log("RateYo initialized! with " + rating);
      }
    });

  }());

  (function () {

    var $onSetDemo = $options.filter(".option-onSet")
                             .find("div.rating");

    $onSetDemo.rateYo({
      onSet: function (rating) {

        window.alert("Rating is set to: " + rating);
      }
    });

  }());

  (function () {

    var $onChangeDemo = $options.filter(".option-onChange")
                                .find("div.rating");

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

  $optionMethodDemo.rateYo({"rating": 0.7});
 
  $optionMethodDemo.rateYo("option", "onChange", function () {
    
    var ratedFill = $optionMethodDemo.rateYo("option", "ratedFill");

    window.console.log("The color of rating is " + ratedFill);
  });

  $optionMethodDemo.rateYo("option", "multiColor", true);

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

  (function () {

    var $ratingActions = $destroyMethodDemo.rateYo().nextAll("div");

    $ratingActions.on("click", "button.destroy", function () {

      $destroyMethodDemo.rateYo("method", "destroy");
    }).on("click", "button.initialize", function () {

      $destroyMethodDemo.rateYo();
    });
  }());

  var $events = $("div.events-content div.event");

  var $setDemo = $events.filter(".event-set")
                        .find("div.rating");

  $setDemo.rateYo().on("rateyo.set", function (e, data) {

    window.alert("The rating is set to " + data.rating + "!");
  });

  var $initDemo = $events.filter(".event-init")
                         .find("div.rating");

  $initDemo.on("rateyo.init", function (e, data) {
 
                        window.console.log("RateYo initialized! with " + data.rating);
                    });
 
  $initDemo.rateYo();


  var $changeDemo = $events.filter(".event-change")
                           .find("div.rating");

  $changeDemo.rateYo().on("rateyo.change", function (e, data) {

    $(this).next().text(data.rating);
  });

  var $starSvgDemo = $("#hack-starSvg div.rating");

  $starSvgDemo.rateYo({

    "rating" : 3.2,
    "starSvg": "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>"+
                 "<path d='M12 6.76l1.379 4.246h4.465l-3.612 2.625 1.379"+
                           " 4.246-3.611-2.625-3.612 2.625"+
                           " 1.379-4.246-3.612-2.625h4.465l1.38-4.246zm0-6.472l-2.833"+
                           " 8.718h-9.167l7.416 5.389-2.833 8.718 7.417-5.388"+
                           " 7.416 5.388-2.833-8.718"+
                           " 7.417-5.389h-9.167l-2.833-8.718z'/>"+
                "</svg>"
  });
});

