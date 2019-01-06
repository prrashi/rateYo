// The basic svg string required to generate stars
export const BASICSTAR = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"+
  "<svg version=\"1.1\""+
        "xmlns=\"http://www.w3.org/2000/svg\""+
        "viewBox=\"0 12.705 512 486.59\""+
        "x=\"0px\" y=\"0px\""+
        "xml:space=\"preserve\">"+
    "<polygon "+
              "points=\"256.814,12.705 317.205,198.566"+
                      " 512.631,198.566 354.529,313.435 "+
                      "414.918,499.295 256.814,384.427 "+
                      "98.713,499.295 159.102,313.435 "+
                      "1,198.566 196.426,198.566 \"/>"+
  "</svg>";

// The Default values of different options available in the Plugin
export const DEFAULTS = {

  starWidth : "32px",
  normalFill: "gray",
  ratedFill : "#f39c12",
  numStars  : 5,
  maxValue  : 5,
  precision : 1,
  rating    : 0,
  fullStar  : false,
  halfStar  : false,
  hover     : true,
  readOnly  : false,
  spacing   : "0px",
  rtl       : false,
  multiColor: null,
  onInit    : null,
  onChange  : null,
  onSet     : null,
  starSvg   : null
};

//Default colors for multi-color rating
export const MULTICOLOR_OPTIONS = {

  startColor: "#c0392b", //red
  endColor  : "#f1c40f"  //yellow
};
