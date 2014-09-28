$(function () {

  var rating = 3.6

  function getRandomRating (min, max) {

    min = min || 0;
    max = max || 5;

    var randomRating = parseFloat(((Math.random() + min)*max + 1).toFixed(2));

    randomRating = randomRating>5?5:randomRating;

    return randomRating;
  };

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
  /*
  $(".counter").text(rating);

  var changeRating = function (rating) {

    $(this).next().text(rating);
  };

  $("#rateYo1").rateYo({
    rating: 3.6,
    onSet: changeRating,
    onChange: changeRating
  });

  $("#getRating").click(function (e) {

    e.preventDefault();

    var rating = $("#rateYo1").rateYo("method", "rating");

    window.alert("Its " + rating + "!");
  });

  $("#setRating").click(function (e) {

    e.preventDefault();

    var randomRating = getRandomRating();

    $("#rateYo1").rateYo("method", "rating", randomRating);
  });
  */
});

