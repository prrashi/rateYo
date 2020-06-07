import {isFunction, isDefined} from "./utils.js";

const eventObjectMap = {};

function getEventObject (event) {

  return eventObjectMap[event] ||
         (eventObjectMap[event] = new String(event));
};

const handlerProxyMap = new WeakMap();

function proxy (node, fn, event) {

  event = getEventObject(event);

  let eventHandlerMap = handlerProxyMap.get(node);  

  if (!eventHandlerMap) {

    handlerProxyMap.set(
      node,
      (eventHandlerMap = new WeakMap())
    );
  }

  let handlerMap = eventHandlerMap.get(event);

  if (!handlerMap) {

    eventHandlerMap.set(
      event,
      (handlerMap = new Map())
    );
  }

  let handler = handlerMap.get(fn);

  if (handler) {

    return handler;
  }

  function proxy (e) {

    const {detail:data} = e;

    fn.call(node, e, data);
  }

  handlerMap.set(fn, proxy);

  return proxy;
}

proxy.get = function getOriginalFunction (node, fn, event) {

  event = getEventObject(event);

  const eventHandlerMap = handlerProxyMap.get(node);

  if (!eventHandlerMap) {

    return fn;
  }

  const handlerMap = eventHandlerMap.get(event);

  if (!handlerMap) {

    return fn;
  }

  return handlerMap.get(fn) || fn;
};

const Event = isFunction(window.Event) ? window.Event : (

  function Event (event, params={}) {

    const {
      bubbles=false,
      cancelable=false
    } = params;

    const evt = document.createEvent("Event");

    evt.initEvent(event, bubbles, cancelable);

    return evt;
  }
);

const CustomEvent = isFunction(window.CustomEvent) ? window.CustomEvent : (
  
  (function CustomEvent (event, params={}) {

    const {
      bubbles=false,
      cancelable=false,
      detail=(void 0)
    } = params;

    const evt = document.createEvent("CustomEvent");

    evt.initCustomEvent(event, bubbles, cancelable, detail);

    return evt;
  }),
  (CustomEvent.prototype = Object.create(Event.prototype)),
  CustomEvent
);

export default {
  trigger (event, detail) {

    const eventProps = {bubbles: true};

    if (!isDefined(detail)) {

      this.node.dispatchEvent(
        new Event(event, eventProps)
      );
    } else {

      this.node.dispatchEvent(
        new CustomEvent(event, {detail, ...eventProps})
      );
    }

    return this;
  },
  on (event, handler) {

    this.node.addEventListener(
      event,
      proxy(this.node, handler, event)
    );
    return this;
  },
  off (event, handler) {

    this.node.removeEventListener(
      event,
      proxy.get(this.node, handler, event)
    );
    return this;
  }
};
