// http://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
export function isMobileBrowser () {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

export function checkPrecision (value, minValue, maxValue) {

  /*
   * This function removes the unnecessary precision, at Min and Max Values
   */

  // Its like comparing 0.0 with 0, which is true
  if (value === minValue) {

    value = minValue;
  }
  else if(value === maxValue) {

    value = maxValue;
  }

  return value;
}

export function checkBounds (value, minValue, maxValue) {

  /*
   * Check if the value is between min and max values, if not, throw an error
   */

  var isValid = value >= minValue && value <= maxValue;

  if(!isValid){

      throw Error("Invalid Rating, expected value between "+ minValue +
                  " and " + maxValue);
  }

  return value;
}

function isType (value, type) {

  return typeof value === type;
}

export function isDefined(value) {

  // Better way to check if a variable is defined or not
  return typeof value !== "undefined";
}

export const isNumber = input => isType(input, "number");

export const isString = input => isType(input, "string");

export const isFunction = input => isType(input, "function");

export const isObject = input => isType(input, "object");

// Regex to match Colors in Hex Format like #FF00FF
const hexRegex = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;

function hexToRGB (hex) {

  /*
   * Extracts and returns the Red, Blue, Green Channel values,
   * in the form of decimals
   */

  if (!hexRegex.test(hex)) {

    return null;
  }

  var hexValues = hexRegex.exec(hex),
      r = parseInt(hexValues[1], 16),
      g = parseInt(hexValues[2], 16),
      b = parseInt(hexValues[3], 16);

  return {r:r, g:g, b:b};
};

function getChannelValue(startVal, endVal, percent) {

  /*
   * Returns a value between `startVal` and `endVal` based on the percent
   */

  var newVal = (endVal - startVal)*(percent/100);

  newVal = Math.round(startVal + newVal).toString(16);

  if (newVal.length === 1) {

      newVal = "0" + newVal;
  }

  return newVal;
}

export function getColor (startColor, endColor, percent) {

  /*
   * Given the percentage( `percent` ) of `endColor` to be mixed
   * with the `startColor`, returns the mixed color.
   * Colors should be only in Hex Format
   */

  if (!startColor || !endColor) {

    return null;
  }

  percent = isDefined(percent)? percent : 0;

  startColor = hexToRGB(startColor);
  endColor = hexToRGB(endColor);

  var r = getChannelValue(startColor.r, endColor.r, percent),
      b = getChannelValue(startColor.b, endColor.b, percent),
      g = getChannelValue(startColor.g, endColor.g, percent);

  return "#" + r + g + b;
}

export function each (input, fn) {

  if (Array.isArray(input)) {

    return input.forEach(
      (item, index) => fn.call(item, item, index)
    );
  }

  if (input && isObject(input)) {

    for (let key in input) {

      if (input.hasOwnProperty(key)) {

        fn.call(input[key], input[key], key);
      }
    }
  }

  return;
}
