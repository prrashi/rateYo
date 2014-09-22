$(function () {

  var rating = 3.6

  function getRandomRating () {

    var randomRating = parseFloat((Math.random()*5 + 1).toFixed(2));

    randomRating = randomRating>5?5:randomRating;

    return randomRating;
  };

  $("#rateYo").rateYo({

    rating: rating
  });

  var $options = $("div.options-content div.option");

  /* Option - StarWidth */
  var $rateYos = $options.filter(".option-starWidth").find("div.rating");

  $rateYos.each(function () {

    var width = $(this).attr("data-width");

    $(this).rateYo({

      rating: getRandomRating(),
      starWidth: width
    });
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

