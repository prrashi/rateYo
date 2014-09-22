$(function () {

  var rating = 3.6;

  $("#rateYo").rateYo({

    rating: rating
  });

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

    var randomRating = parseFloat((Math.random()*5 + 1).toFixed(2));

    randomRating = randomRating>5?5:randomRating;

    $("#rateYo1").rateYo("method", "rating", randomRating);
  });
});

