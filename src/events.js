import {isFunction, isDefined} from "./utils";

const proxyHandlers = [];

function proxy (node, fn) {

  function proxy (e) {

    const {detail:data} = e;

    fn.call(node, e, data);
  }

  proxyHandlers.push(proxy);

  return proxy;
}

proxy.get = function getOriginalFunction (fn) {

  const index = proxyHandlers.indexOf(fn);

  if (!~index) {

    return fn;
  }

  return proxyHandlers[index];
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
  (CustomEvent.prototype = Event.prototype),
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

    this.node.addEventListener(event, proxy(this.node, handler));
    return this;
  },
  off (event, handler) {

    this.node.removeEventListener(event, proxy.get(handler));
    return this;
  }
};
