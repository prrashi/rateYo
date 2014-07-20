;(function ($) {
  "use strict";

  function RateYo ($node, options) {

  };

  var rateYoInstances = RateYo.prototype.collection = [];

  function rateYo (options) {

    var $nodes = $(this);

    return $.each($nodes, function () {
    
      rateYoInstances.push(new RateYo($(this), options));      
    });
  };

  $.fn.rateYo = rateYo;

}(jQuery));
