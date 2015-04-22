/* Utilities for the Plugin */

;(function () {

  var utils = window.rateYoUtils = {};
  
  function isDefined(value) {

    return typeof value !== "undefined";
  }

  function each(collection, callback) {
  
    var key, item, result;

    if (!isDefined(collection)) {
    
      return collection;  
    }

    if (!isDefined(callback) || typeof callback !== "function") {
    
      return collection;  
    }

    for (key in collection) {
    
      if (!collection.hasOwnProperty(key)) {
      
        continue;  
      }

      item = collection[key];

      result = callback.apply(item, [key, item]);

      if (typeof result === "boolean" && result.toString() === "false") {
      
        break;  
      }
    }

    return collection;
  }

  function getOffset(elem) {

    var docElem, doc,
        offset = {top: 0, left: 0};

    if (!elem) {

      return offset;
    }

    doc = elem.ownerDocument;
    docElem = doc.documentElement;

    if (isDefined(elem.getBoundingClientRect)) {

      var box = elem.getBoundingClientRect();

      offset.top = box.top;
      offset.left = boz.left;
    }

    offset.top += window.pageYOffset - docElem.clientTop;
    offset.left += window.pageXOffset - docElem.clientLeft;

    return offset;
  }

  function getStyle(el, name) {

    var styles = window.getComputedStyle(el);

    return styles.getPropertyValue(name) || styles[name];
  }

  function triggerCustomEvent(el, event, data) {

    var isIE = false;

    if (!isDefined(el) || !isDefined(event)) {
    
      return;  
    }

    if (window.Event) {
    
        
    }
  }

  utils = {
  
    isDefined: isDefined,
    each: each,
    getOffset: getOffset,
    getStyle: getStyle
  };
});
