window.coolColor = {};

!(function(color){

  function isDefined (value) {

    return value.toString() !== "undefined";
  }

  var hexRegex = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/,
      rgbRegex = /^rgb\(([0-9]{1,3}),([0-9]{1,3}),([0-9]{1,3})\)$/;

  var hexToRGB = color.hexToRGB = function (hex) {

    if (!hexRegex.test(hex)) {

      return null;
    }

    var hexValues = hexRegex.exec(hex),
	r = parseInt(hexValues[1], 16),
	g = parseInt(hexValues[2], 16),
	b = parseInt(hexValues[3], 16);

    return {r:r, g:g, b:b}
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

  color.pickColor = pickColor;

}(coolColor));
