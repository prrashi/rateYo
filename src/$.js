import {isNumber, isString, isDefined} from "./utils.js";
import events from "./events.js";

const rateyoAttrRegex = /^rateyo(.+)$/;

function classList (node, operation, input) {

  const className = node.className.trim();

  let classes = className && className.split(/\s/) || [],
      classMap = {};

  classes = classes.reduce((result, item, index) => {

    if (!classMap.hasOwnProperty(item)) {

      result.push(item);
      classMap[item] = index;
    }

    return result;
  }, []);

  if (operation === classList.add) {

    if (classMap.hasOwnProperty(input)) {

      return;
    }

    classes.push(input);
  } else if (operation === classList.remove) {

    if (!classMap.hasOwnProperty(input)) {

      return;
    }

    classes.splice(classMap[input], 1);
  }

  node.className = classes.join(" ");
}

classList.add = "add";
classList.remove = "remove";

function El (node) {

  this.node = node;
}

El.prototype = {

  empty () {

    this.node.innerHTML = "";
    return this;
  },

  addClass (className) {

    classList(this.node, classList.add, className);  
    return this;
  },

  removeClass (className) {

    classList(this.node, classList.remove, className);
    return this;
  },

  appendTo (parent) {

    (El.isEl(parent) ? parent.node : parent).appendChild(this.node);

    return this;
  },

  css (styleAttribute, value) {

    this.node.style[styleAttribute] = value;

    return this;
  },

  width (width) {

    if (!isDefined(width)) {

      return this.node.getBoundingClientRect().width;
    }

    this.css(
      "width",
      width + (isNumber(width) ? "px" : "")
    );
  },

  find (selector) {

    return $(this.node.querySelectorAll(selector));
  },

  attr (attrObj) {

    for (let attrName in attrObj) {

      if (attrObj.hasOwnProperty(attrName)) {

        this.node.setAttribute(
          attrName, attrObj[attrName]
        );
      }
    }

    return this;
  },

  removeAttr (attributeName) {

    this.node.removeAttribute(attributeName);
    return this;
  },

  children () {

    return $(this.node.childNodes);
  },

  remove () {

    return this.node.remove();
  },

  offset () {

    const {
      top, left, bottom, right
    } = this.node.getBoundingClientRect();

    return {top, left, bottom, right};
  },
  dataAttrOptions () {

    const {dataset} = this.node;

    return Object.keys(dataset).reduce((
      options, attr
    ) => {

      const match = attr.match(rateyoAttrRegex);

      if (!match) {

        return options;
      }

      const rateyoAttr = match[1],
            option = rateyoAttr[0].toLowerCase() + rateyoAttr.slice(1);

      options[option] = dataset[attr];

      return options;
    }, {});
  }
}

El.prototype = {...El.prototype, ...events};

El.isEl = (node) => node instanceof El;

function Collection (nodeList) {

  this.collection = [];

  Array.prototype.forEach.call(nodeList, (node) => {

    this.collection.push(new El(node));
  });
}

Collection.isCollection = input => input instanceof Collection;

Collection.prototype = {};

for (let method in El.prototype) {

  if (!El.prototype.hasOwnProperty(method)) {

    continue;
  }

  function proxy (...args) {

    this.collection.forEach((el) => (
      El.isEl(el) && el[method](...args)
    ));
   
    return this;
  }

  Collection.prototype[method] = proxy;
}

const parser = new DOMParser();

function parseHTML (html) {

  return parser.parseFromString(html.trim(), "text/html")
               .body
               .childNodes;
}

function $ (node) {

  node = isString(node) && parseHTML(node) || node;

  if (El.isEl(node) || Collection.isCollection(node)) {

    return node;
  }

  if (node instanceof NodeList) {

    return new Collection(node);
  }

  return new El(node);
}

$.El = El;

export default $;
