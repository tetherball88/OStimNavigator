(function() {
  "use strict";
  function getDefaultExportFromCjs(x2) {
    return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
  }
  var jsxRuntime = { exports: {} };
  var reactJsxRuntime_production_min = {};
  var react = { exports: {} };
  var react_production_min = {};
  /**
   * @license React
   * react.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var l$3 = Symbol.for("react.element"), n$3 = Symbol.for("react.portal"), p$5 = Symbol.for("react.fragment"), q$2 = Symbol.for("react.strict_mode"), r$2 = Symbol.for("react.profiler"), t$2 = Symbol.for("react.provider"), u$2 = Symbol.for("react.context"), v$3 = Symbol.for("react.forward_ref"), w$3 = Symbol.for("react.suspense"), x$2 = Symbol.for("react.memo"), y$2 = Symbol.for("react.lazy"), z$2 = Symbol.iterator;
  function A$3(a2) {
    if (null === a2 || "object" !== typeof a2) return null;
    a2 = z$2 && a2[z$2] || a2["@@iterator"];
    return "function" === typeof a2 ? a2 : null;
  }
  var B$3 = { isMounted: function() {
    return false;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, C$3 = Object.assign, D$3 = {};
  function E$3(a2, b2, e2) {
    this.props = a2;
    this.context = b2;
    this.refs = D$3;
    this.updater = e2 || B$3;
  }
  E$3.prototype.isReactComponent = {};
  E$3.prototype.setState = function(a2, b2) {
    if ("object" !== typeof a2 && "function" !== typeof a2 && null != a2) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, a2, b2, "setState");
  };
  E$3.prototype.forceUpdate = function(a2) {
    this.updater.enqueueForceUpdate(this, a2, "forceUpdate");
  };
  function F$2() {
  }
  F$2.prototype = E$3.prototype;
  function G$3(a2, b2, e2) {
    this.props = a2;
    this.context = b2;
    this.refs = D$3;
    this.updater = e2 || B$3;
  }
  var H$3 = G$3.prototype = new F$2();
  H$3.constructor = G$3;
  C$3(H$3, E$3.prototype);
  H$3.isPureReactComponent = true;
  var I$3 = Array.isArray, J$2 = Object.prototype.hasOwnProperty, K$3 = { current: null }, L$3 = { key: true, ref: true, __self: true, __source: true };
  function M$3(a2, b2, e2) {
    var d2, c2 = {}, k2 = null, h2 = null;
    if (null != b2) for (d2 in void 0 !== b2.ref && (h2 = b2.ref), void 0 !== b2.key && (k2 = "" + b2.key), b2) J$2.call(b2, d2) && !L$3.hasOwnProperty(d2) && (c2[d2] = b2[d2]);
    var g2 = arguments.length - 2;
    if (1 === g2) c2.children = e2;
    else if (1 < g2) {
      for (var f2 = Array(g2), m2 = 0; m2 < g2; m2++) f2[m2] = arguments[m2 + 2];
      c2.children = f2;
    }
    if (a2 && a2.defaultProps) for (d2 in g2 = a2.defaultProps, g2) void 0 === c2[d2] && (c2[d2] = g2[d2]);
    return { $$typeof: l$3, type: a2, key: k2, ref: h2, props: c2, _owner: K$3.current };
  }
  function N$3(a2, b2) {
    return { $$typeof: l$3, type: a2.type, key: b2, ref: a2.ref, props: a2.props, _owner: a2._owner };
  }
  function O$2(a2) {
    return "object" === typeof a2 && null !== a2 && a2.$$typeof === l$3;
  }
  function escape(a2) {
    var b2 = { "=": "=0", ":": "=2" };
    return "$" + a2.replace(/[=:]/g, function(a3) {
      return b2[a3];
    });
  }
  var P$3 = /\/+/g;
  function Q$2(a2, b2) {
    return "object" === typeof a2 && null !== a2 && null != a2.key ? escape("" + a2.key) : b2.toString(36);
  }
  function R$3(a2, b2, e2, d2, c2) {
    var k2 = typeof a2;
    if ("undefined" === k2 || "boolean" === k2) a2 = null;
    var h2 = false;
    if (null === a2) h2 = true;
    else switch (k2) {
      case "string":
      case "number":
        h2 = true;
        break;
      case "object":
        switch (a2.$$typeof) {
          case l$3:
          case n$3:
            h2 = true;
        }
    }
    if (h2) return h2 = a2, c2 = c2(h2), a2 = "" === d2 ? "." + Q$2(h2, 0) : d2, I$3(c2) ? (e2 = "", null != a2 && (e2 = a2.replace(P$3, "$&/") + "/"), R$3(c2, b2, e2, "", function(a3) {
      return a3;
    })) : null != c2 && (O$2(c2) && (c2 = N$3(c2, e2 + (!c2.key || h2 && h2.key === c2.key ? "" : ("" + c2.key).replace(P$3, "$&/") + "/") + a2)), b2.push(c2)), 1;
    h2 = 0;
    d2 = "" === d2 ? "." : d2 + ":";
    if (I$3(a2)) for (var g2 = 0; g2 < a2.length; g2++) {
      k2 = a2[g2];
      var f2 = d2 + Q$2(k2, g2);
      h2 += R$3(k2, b2, e2, f2, c2);
    }
    else if (f2 = A$3(a2), "function" === typeof f2) for (a2 = f2.call(a2), g2 = 0; !(k2 = a2.next()).done; ) k2 = k2.value, f2 = d2 + Q$2(k2, g2++), h2 += R$3(k2, b2, e2, f2, c2);
    else if ("object" === k2) throw b2 = String(a2), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b2 ? "object with keys {" + Object.keys(a2).join(", ") + "}" : b2) + "). If you meant to render a collection of children, use an array instead.");
    return h2;
  }
  function S$3(a2, b2, e2) {
    if (null == a2) return a2;
    var d2 = [], c2 = 0;
    R$3(a2, d2, "", "", function(a3) {
      return b2.call(e2, a3, c2++);
    });
    return d2;
  }
  function T$3(a2) {
    if (-1 === a2._status) {
      var b2 = a2._result;
      b2 = b2();
      b2.then(function(b3) {
        if (0 === a2._status || -1 === a2._status) a2._status = 1, a2._result = b3;
      }, function(b3) {
        if (0 === a2._status || -1 === a2._status) a2._status = 2, a2._result = b3;
      });
      -1 === a2._status && (a2._status = 0, a2._result = b2);
    }
    if (1 === a2._status) return a2._result.default;
    throw a2._result;
  }
  var U$3 = { current: null }, V$2 = { transition: null }, W$3 = { ReactCurrentDispatcher: U$3, ReactCurrentBatchConfig: V$2, ReactCurrentOwner: K$3 };
  function X$2() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  react_production_min.Children = { map: S$3, forEach: function(a2, b2, e2) {
    S$3(a2, function() {
      b2.apply(this, arguments);
    }, e2);
  }, count: function(a2) {
    var b2 = 0;
    S$3(a2, function() {
      b2++;
    });
    return b2;
  }, toArray: function(a2) {
    return S$3(a2, function(a3) {
      return a3;
    }) || [];
  }, only: function(a2) {
    if (!O$2(a2)) throw Error("React.Children.only expected to receive a single React element child.");
    return a2;
  } };
  react_production_min.Component = E$3;
  react_production_min.Fragment = p$5;
  react_production_min.Profiler = r$2;
  react_production_min.PureComponent = G$3;
  react_production_min.StrictMode = q$2;
  react_production_min.Suspense = w$3;
  react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W$3;
  react_production_min.act = X$2;
  react_production_min.cloneElement = function(a2, b2, e2) {
    if (null === a2 || void 0 === a2) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a2 + ".");
    var d2 = C$3({}, a2.props), c2 = a2.key, k2 = a2.ref, h2 = a2._owner;
    if (null != b2) {
      void 0 !== b2.ref && (k2 = b2.ref, h2 = K$3.current);
      void 0 !== b2.key && (c2 = "" + b2.key);
      if (a2.type && a2.type.defaultProps) var g2 = a2.type.defaultProps;
      for (f2 in b2) J$2.call(b2, f2) && !L$3.hasOwnProperty(f2) && (d2[f2] = void 0 === b2[f2] && void 0 !== g2 ? g2[f2] : b2[f2]);
    }
    var f2 = arguments.length - 2;
    if (1 === f2) d2.children = e2;
    else if (1 < f2) {
      g2 = Array(f2);
      for (var m2 = 0; m2 < f2; m2++) g2[m2] = arguments[m2 + 2];
      d2.children = g2;
    }
    return { $$typeof: l$3, type: a2.type, key: c2, ref: k2, props: d2, _owner: h2 };
  };
  react_production_min.createContext = function(a2) {
    a2 = { $$typeof: u$2, _currentValue: a2, _currentValue2: a2, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
    a2.Provider = { $$typeof: t$2, _context: a2 };
    return a2.Consumer = a2;
  };
  react_production_min.createElement = M$3;
  react_production_min.createFactory = function(a2) {
    var b2 = M$3.bind(null, a2);
    b2.type = a2;
    return b2;
  };
  react_production_min.createRef = function() {
    return { current: null };
  };
  react_production_min.forwardRef = function(a2) {
    return { $$typeof: v$3, render: a2 };
  };
  react_production_min.isValidElement = O$2;
  react_production_min.lazy = function(a2) {
    return { $$typeof: y$2, _payload: { _status: -1, _result: a2 }, _init: T$3 };
  };
  react_production_min.memo = function(a2, b2) {
    return { $$typeof: x$2, type: a2, compare: void 0 === b2 ? null : b2 };
  };
  react_production_min.startTransition = function(a2) {
    var b2 = V$2.transition;
    V$2.transition = {};
    try {
      a2();
    } finally {
      V$2.transition = b2;
    }
  };
  react_production_min.unstable_act = X$2;
  react_production_min.useCallback = function(a2, b2) {
    return U$3.current.useCallback(a2, b2);
  };
  react_production_min.useContext = function(a2) {
    return U$3.current.useContext(a2);
  };
  react_production_min.useDebugValue = function() {
  };
  react_production_min.useDeferredValue = function(a2) {
    return U$3.current.useDeferredValue(a2);
  };
  react_production_min.useEffect = function(a2, b2) {
    return U$3.current.useEffect(a2, b2);
  };
  react_production_min.useId = function() {
    return U$3.current.useId();
  };
  react_production_min.useImperativeHandle = function(a2, b2, e2) {
    return U$3.current.useImperativeHandle(a2, b2, e2);
  };
  react_production_min.useInsertionEffect = function(a2, b2) {
    return U$3.current.useInsertionEffect(a2, b2);
  };
  react_production_min.useLayoutEffect = function(a2, b2) {
    return U$3.current.useLayoutEffect(a2, b2);
  };
  react_production_min.useMemo = function(a2, b2) {
    return U$3.current.useMemo(a2, b2);
  };
  react_production_min.useReducer = function(a2, b2, e2) {
    return U$3.current.useReducer(a2, b2, e2);
  };
  react_production_min.useRef = function(a2) {
    return U$3.current.useRef(a2);
  };
  react_production_min.useState = function(a2) {
    return U$3.current.useState(a2);
  };
  react_production_min.useSyncExternalStore = function(a2, b2, e2) {
    return U$3.current.useSyncExternalStore(a2, b2, e2);
  };
  react_production_min.useTransition = function() {
    return U$3.current.useTransition();
  };
  react_production_min.version = "18.3.1";
  {
    react.exports = react_production_min;
  }
  var reactExports = react.exports;
  const React = /* @__PURE__ */ getDefaultExportFromCjs(reactExports);
  /**
   * @license React
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var f$2 = reactExports, k$2 = Symbol.for("react.element"), l$2 = Symbol.for("react.fragment"), m$3 = Object.prototype.hasOwnProperty, n$2 = f$2.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p$4 = { key: true, ref: true, __self: true, __source: true };
  function q(c2, a2, g2) {
    var b2, d2 = {}, e2 = null, h2 = null;
    void 0 !== g2 && (e2 = "" + g2);
    void 0 !== a2.key && (e2 = "" + a2.key);
    void 0 !== a2.ref && (h2 = a2.ref);
    for (b2 in a2) m$3.call(a2, b2) && !p$4.hasOwnProperty(b2) && (d2[b2] = a2[b2]);
    if (c2 && c2.defaultProps) for (b2 in a2 = c2.defaultProps, a2) void 0 === d2[b2] && (d2[b2] = a2[b2]);
    return { $$typeof: k$2, type: c2, key: e2, ref: h2, props: d2, _owner: n$2.current };
  }
  reactJsxRuntime_production_min.Fragment = l$2;
  reactJsxRuntime_production_min.jsx = q;
  reactJsxRuntime_production_min.jsxs = q;
  {
    jsxRuntime.exports = reactJsxRuntime_production_min;
  }
  var jsxRuntimeExports = jsxRuntime.exports;
  var client = {};
  var reactDom = { exports: {} };
  var reactDom_production_min = {};
  var scheduler = { exports: {} };
  var scheduler_production_min = {};
  /**
   * @license React
   * scheduler.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  (function(exports$1) {
    function f2(a2, b2) {
      var c2 = a2.length;
      a2.push(b2);
      a: for (; 0 < c2; ) {
        var d2 = c2 - 1 >>> 1, e2 = a2[d2];
        if (0 < g2(e2, b2)) a2[d2] = b2, a2[c2] = e2, c2 = d2;
        else break a;
      }
    }
    function h2(a2) {
      return 0 === a2.length ? null : a2[0];
    }
    function k2(a2) {
      if (0 === a2.length) return null;
      var b2 = a2[0], c2 = a2.pop();
      if (c2 !== b2) {
        a2[0] = c2;
        a: for (var d2 = 0, e2 = a2.length, w2 = e2 >>> 1; d2 < w2; ) {
          var m2 = 2 * (d2 + 1) - 1, C2 = a2[m2], n2 = m2 + 1, x2 = a2[n2];
          if (0 > g2(C2, c2)) n2 < e2 && 0 > g2(x2, C2) ? (a2[d2] = x2, a2[n2] = c2, d2 = n2) : (a2[d2] = C2, a2[m2] = c2, d2 = m2);
          else if (n2 < e2 && 0 > g2(x2, c2)) a2[d2] = x2, a2[n2] = c2, d2 = n2;
          else break a;
        }
      }
      return b2;
    }
    function g2(a2, b2) {
      var c2 = a2.sortIndex - b2.sortIndex;
      return 0 !== c2 ? c2 : a2.id - b2.id;
    }
    if ("object" === typeof performance && "function" === typeof performance.now) {
      var l2 = performance;
      exports$1.unstable_now = function() {
        return l2.now();
      };
    } else {
      var p2 = Date, q2 = p2.now();
      exports$1.unstable_now = function() {
        return p2.now() - q2;
      };
    }
    var r2 = [], t2 = [], u2 = 1, v2 = null, y2 = 3, z2 = false, A2 = false, B2 = false, D2 = "function" === typeof setTimeout ? setTimeout : null, E2 = "function" === typeof clearTimeout ? clearTimeout : null, F2 = "undefined" !== typeof setImmediate ? setImmediate : null;
    "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function G2(a2) {
      for (var b2 = h2(t2); null !== b2; ) {
        if (null === b2.callback) k2(t2);
        else if (b2.startTime <= a2) k2(t2), b2.sortIndex = b2.expirationTime, f2(r2, b2);
        else break;
        b2 = h2(t2);
      }
    }
    function H2(a2) {
      B2 = false;
      G2(a2);
      if (!A2) if (null !== h2(r2)) A2 = true, I2(J2);
      else {
        var b2 = h2(t2);
        null !== b2 && K2(H2, b2.startTime - a2);
      }
    }
    function J2(a2, b2) {
      A2 = false;
      B2 && (B2 = false, E2(L2), L2 = -1);
      z2 = true;
      var c2 = y2;
      try {
        G2(b2);
        for (v2 = h2(r2); null !== v2 && (!(v2.expirationTime > b2) || a2 && !M2()); ) {
          var d2 = v2.callback;
          if ("function" === typeof d2) {
            v2.callback = null;
            y2 = v2.priorityLevel;
            var e2 = d2(v2.expirationTime <= b2);
            b2 = exports$1.unstable_now();
            "function" === typeof e2 ? v2.callback = e2 : v2 === h2(r2) && k2(r2);
            G2(b2);
          } else k2(r2);
          v2 = h2(r2);
        }
        if (null !== v2) var w2 = true;
        else {
          var m2 = h2(t2);
          null !== m2 && K2(H2, m2.startTime - b2);
          w2 = false;
        }
        return w2;
      } finally {
        v2 = null, y2 = c2, z2 = false;
      }
    }
    var N2 = false, O2 = null, L2 = -1, P2 = 5, Q2 = -1;
    function M2() {
      return exports$1.unstable_now() - Q2 < P2 ? false : true;
    }
    function R2() {
      if (null !== O2) {
        var a2 = exports$1.unstable_now();
        Q2 = a2;
        var b2 = true;
        try {
          b2 = O2(true, a2);
        } finally {
          b2 ? S2() : (N2 = false, O2 = null);
        }
      } else N2 = false;
    }
    var S2;
    if ("function" === typeof F2) S2 = function() {
      F2(R2);
    };
    else if ("undefined" !== typeof MessageChannel) {
      var T2 = new MessageChannel(), U2 = T2.port2;
      T2.port1.onmessage = R2;
      S2 = function() {
        U2.postMessage(null);
      };
    } else S2 = function() {
      D2(R2, 0);
    };
    function I2(a2) {
      O2 = a2;
      N2 || (N2 = true, S2());
    }
    function K2(a2, b2) {
      L2 = D2(function() {
        a2(exports$1.unstable_now());
      }, b2);
    }
    exports$1.unstable_IdlePriority = 5;
    exports$1.unstable_ImmediatePriority = 1;
    exports$1.unstable_LowPriority = 4;
    exports$1.unstable_NormalPriority = 3;
    exports$1.unstable_Profiling = null;
    exports$1.unstable_UserBlockingPriority = 2;
    exports$1.unstable_cancelCallback = function(a2) {
      a2.callback = null;
    };
    exports$1.unstable_continueExecution = function() {
      A2 || z2 || (A2 = true, I2(J2));
    };
    exports$1.unstable_forceFrameRate = function(a2) {
      0 > a2 || 125 < a2 ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P2 = 0 < a2 ? Math.floor(1e3 / a2) : 5;
    };
    exports$1.unstable_getCurrentPriorityLevel = function() {
      return y2;
    };
    exports$1.unstable_getFirstCallbackNode = function() {
      return h2(r2);
    };
    exports$1.unstable_next = function(a2) {
      switch (y2) {
        case 1:
        case 2:
        case 3:
          var b2 = 3;
          break;
        default:
          b2 = y2;
      }
      var c2 = y2;
      y2 = b2;
      try {
        return a2();
      } finally {
        y2 = c2;
      }
    };
    exports$1.unstable_pauseExecution = function() {
    };
    exports$1.unstable_requestPaint = function() {
    };
    exports$1.unstable_runWithPriority = function(a2, b2) {
      switch (a2) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          a2 = 3;
      }
      var c2 = y2;
      y2 = a2;
      try {
        return b2();
      } finally {
        y2 = c2;
      }
    };
    exports$1.unstable_scheduleCallback = function(a2, b2, c2) {
      var d2 = exports$1.unstable_now();
      "object" === typeof c2 && null !== c2 ? (c2 = c2.delay, c2 = "number" === typeof c2 && 0 < c2 ? d2 + c2 : d2) : c2 = d2;
      switch (a2) {
        case 1:
          var e2 = -1;
          break;
        case 2:
          e2 = 250;
          break;
        case 5:
          e2 = 1073741823;
          break;
        case 4:
          e2 = 1e4;
          break;
        default:
          e2 = 5e3;
      }
      e2 = c2 + e2;
      a2 = { id: u2++, callback: b2, priorityLevel: a2, startTime: c2, expirationTime: e2, sortIndex: -1 };
      c2 > d2 ? (a2.sortIndex = c2, f2(t2, a2), null === h2(r2) && a2 === h2(t2) && (B2 ? (E2(L2), L2 = -1) : B2 = true, K2(H2, c2 - d2))) : (a2.sortIndex = e2, f2(r2, a2), A2 || z2 || (A2 = true, I2(J2)));
      return a2;
    };
    exports$1.unstable_shouldYield = M2;
    exports$1.unstable_wrapCallback = function(a2) {
      var b2 = y2;
      return function() {
        var c2 = y2;
        y2 = b2;
        try {
          return a2.apply(this, arguments);
        } finally {
          y2 = c2;
        }
      };
    };
  })(scheduler_production_min);
  {
    scheduler.exports = scheduler_production_min;
  }
  var schedulerExports = scheduler.exports;
  /**
   * @license React
   * react-dom.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var aa = reactExports, ca = schedulerExports;
  function p$3(a2) {
    for (var b2 = "https://reactjs.org/docs/error-decoder.html?invariant=" + a2, c2 = 1; c2 < arguments.length; c2++) b2 += "&args[]=" + encodeURIComponent(arguments[c2]);
    return "Minified React error #" + a2 + "; visit " + b2 + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var da = /* @__PURE__ */ new Set(), ea = {};
  function fa(a2, b2) {
    ha(a2, b2);
    ha(a2 + "Capture", b2);
  }
  function ha(a2, b2) {
    ea[a2] = b2;
    for (a2 = 0; a2 < b2.length; a2++) da.add(b2[a2]);
  }
  var ia = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), ja = Object.prototype.hasOwnProperty, ka = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, la = {}, ma = {};
  function oa(a2) {
    if (ja.call(ma, a2)) return true;
    if (ja.call(la, a2)) return false;
    if (ka.test(a2)) return ma[a2] = true;
    la[a2] = true;
    return false;
  }
  function pa(a2, b2, c2, d2) {
    if (null !== c2 && 0 === c2.type) return false;
    switch (typeof b2) {
      case "function":
      case "symbol":
        return true;
      case "boolean":
        if (d2) return false;
        if (null !== c2) return !c2.acceptsBooleans;
        a2 = a2.toLowerCase().slice(0, 5);
        return "data-" !== a2 && "aria-" !== a2;
      default:
        return false;
    }
  }
  function qa(a2, b2, c2, d2) {
    if (null === b2 || "undefined" === typeof b2 || pa(a2, b2, c2, d2)) return true;
    if (d2) return false;
    if (null !== c2) switch (c2.type) {
      case 3:
        return !b2;
      case 4:
        return false === b2;
      case 5:
        return isNaN(b2);
      case 6:
        return isNaN(b2) || 1 > b2;
    }
    return false;
  }
  function v$2(a2, b2, c2, d2, e2, f2, g2) {
    this.acceptsBooleans = 2 === b2 || 3 === b2 || 4 === b2;
    this.attributeName = d2;
    this.attributeNamespace = e2;
    this.mustUseProperty = c2;
    this.propertyName = a2;
    this.type = b2;
    this.sanitizeURL = f2;
    this.removeEmptyString = g2;
  }
  var z = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a2) {
    z[a2] = new v$2(a2, 0, false, a2, null, false, false);
  });
  [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a2) {
    var b2 = a2[0];
    z[b2] = new v$2(b2, 1, false, a2[1], null, false, false);
  });
  ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a2) {
    z[a2] = new v$2(a2, 2, false, a2.toLowerCase(), null, false, false);
  });
  ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a2) {
    z[a2] = new v$2(a2, 2, false, a2, null, false, false);
  });
  "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a2) {
    z[a2] = new v$2(a2, 3, false, a2.toLowerCase(), null, false, false);
  });
  ["checked", "multiple", "muted", "selected"].forEach(function(a2) {
    z[a2] = new v$2(a2, 3, true, a2, null, false, false);
  });
  ["capture", "download"].forEach(function(a2) {
    z[a2] = new v$2(a2, 4, false, a2, null, false, false);
  });
  ["cols", "rows", "size", "span"].forEach(function(a2) {
    z[a2] = new v$2(a2, 6, false, a2, null, false, false);
  });
  ["rowSpan", "start"].forEach(function(a2) {
    z[a2] = new v$2(a2, 5, false, a2.toLowerCase(), null, false, false);
  });
  var ra = /[\-:]([a-z])/g;
  function sa(a2) {
    return a2[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a2) {
    var b2 = a2.replace(
      ra,
      sa
    );
    z[b2] = new v$2(b2, 1, false, a2, null, false, false);
  });
  "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a2) {
    var b2 = a2.replace(ra, sa);
    z[b2] = new v$2(b2, 1, false, a2, "http://www.w3.org/1999/xlink", false, false);
  });
  ["xml:base", "xml:lang", "xml:space"].forEach(function(a2) {
    var b2 = a2.replace(ra, sa);
    z[b2] = new v$2(b2, 1, false, a2, "http://www.w3.org/XML/1998/namespace", false, false);
  });
  ["tabIndex", "crossOrigin"].forEach(function(a2) {
    z[a2] = new v$2(a2, 1, false, a2.toLowerCase(), null, false, false);
  });
  z.xlinkHref = new v$2("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
  ["src", "href", "action", "formAction"].forEach(function(a2) {
    z[a2] = new v$2(a2, 1, false, a2.toLowerCase(), null, true, true);
  });
  function ta(a2, b2, c2, d2) {
    var e2 = z.hasOwnProperty(b2) ? z[b2] : null;
    if (null !== e2 ? 0 !== e2.type : d2 || !(2 < b2.length) || "o" !== b2[0] && "O" !== b2[0] || "n" !== b2[1] && "N" !== b2[1]) qa(b2, c2, e2, d2) && (c2 = null), d2 || null === e2 ? oa(b2) && (null === c2 ? a2.removeAttribute(b2) : a2.setAttribute(b2, "" + c2)) : e2.mustUseProperty ? a2[e2.propertyName] = null === c2 ? 3 === e2.type ? false : "" : c2 : (b2 = e2.attributeName, d2 = e2.attributeNamespace, null === c2 ? a2.removeAttribute(b2) : (e2 = e2.type, c2 = 3 === e2 || 4 === e2 && true === c2 ? "" : "" + c2, d2 ? a2.setAttributeNS(d2, b2, c2) : a2.setAttribute(b2, c2)));
  }
  var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, va = Symbol.for("react.element"), wa = Symbol.for("react.portal"), ya = Symbol.for("react.fragment"), za = Symbol.for("react.strict_mode"), Aa = Symbol.for("react.profiler"), Ba = Symbol.for("react.provider"), Ca = Symbol.for("react.context"), Da = Symbol.for("react.forward_ref"), Ea = Symbol.for("react.suspense"), Fa = Symbol.for("react.suspense_list"), Ga = Symbol.for("react.memo"), Ha = Symbol.for("react.lazy");
  var Ia = Symbol.for("react.offscreen");
  var Ja = Symbol.iterator;
  function Ka(a2) {
    if (null === a2 || "object" !== typeof a2) return null;
    a2 = Ja && a2[Ja] || a2["@@iterator"];
    return "function" === typeof a2 ? a2 : null;
  }
  var A$2 = Object.assign, La;
  function Ma(a2) {
    if (void 0 === La) try {
      throw Error();
    } catch (c2) {
      var b2 = c2.stack.trim().match(/\n( *(at )?)/);
      La = b2 && b2[1] || "";
    }
    return "\n" + La + a2;
  }
  var Na = false;
  function Oa(a2, b2) {
    if (!a2 || Na) return "";
    Na = true;
    var c2 = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (b2) if (b2 = function() {
        throw Error();
      }, Object.defineProperty(b2.prototype, "props", { set: function() {
        throw Error();
      } }), "object" === typeof Reflect && Reflect.construct) {
        try {
          Reflect.construct(b2, []);
        } catch (l2) {
          var d2 = l2;
        }
        Reflect.construct(a2, [], b2);
      } else {
        try {
          b2.call();
        } catch (l2) {
          d2 = l2;
        }
        a2.call(b2.prototype);
      }
      else {
        try {
          throw Error();
        } catch (l2) {
          d2 = l2;
        }
        a2();
      }
    } catch (l2) {
      if (l2 && d2 && "string" === typeof l2.stack) {
        for (var e2 = l2.stack.split("\n"), f2 = d2.stack.split("\n"), g2 = e2.length - 1, h2 = f2.length - 1; 1 <= g2 && 0 <= h2 && e2[g2] !== f2[h2]; ) h2--;
        for (; 1 <= g2 && 0 <= h2; g2--, h2--) if (e2[g2] !== f2[h2]) {
          if (1 !== g2 || 1 !== h2) {
            do
              if (g2--, h2--, 0 > h2 || e2[g2] !== f2[h2]) {
                var k2 = "\n" + e2[g2].replace(" at new ", " at ");
                a2.displayName && k2.includes("<anonymous>") && (k2 = k2.replace("<anonymous>", a2.displayName));
                return k2;
              }
            while (1 <= g2 && 0 <= h2);
          }
          break;
        }
      }
    } finally {
      Na = false, Error.prepareStackTrace = c2;
    }
    return (a2 = a2 ? a2.displayName || a2.name : "") ? Ma(a2) : "";
  }
  function Pa(a2) {
    switch (a2.tag) {
      case 5:
        return Ma(a2.type);
      case 16:
        return Ma("Lazy");
      case 13:
        return Ma("Suspense");
      case 19:
        return Ma("SuspenseList");
      case 0:
      case 2:
      case 15:
        return a2 = Oa(a2.type, false), a2;
      case 11:
        return a2 = Oa(a2.type.render, false), a2;
      case 1:
        return a2 = Oa(a2.type, true), a2;
      default:
        return "";
    }
  }
  function Qa(a2) {
    if (null == a2) return null;
    if ("function" === typeof a2) return a2.displayName || a2.name || null;
    if ("string" === typeof a2) return a2;
    switch (a2) {
      case ya:
        return "Fragment";
      case wa:
        return "Portal";
      case Aa:
        return "Profiler";
      case za:
        return "StrictMode";
      case Ea:
        return "Suspense";
      case Fa:
        return "SuspenseList";
    }
    if ("object" === typeof a2) switch (a2.$$typeof) {
      case Ca:
        return (a2.displayName || "Context") + ".Consumer";
      case Ba:
        return (a2._context.displayName || "Context") + ".Provider";
      case Da:
        var b2 = a2.render;
        a2 = a2.displayName;
        a2 || (a2 = b2.displayName || b2.name || "", a2 = "" !== a2 ? "ForwardRef(" + a2 + ")" : "ForwardRef");
        return a2;
      case Ga:
        return b2 = a2.displayName || null, null !== b2 ? b2 : Qa(a2.type) || "Memo";
      case Ha:
        b2 = a2._payload;
        a2 = a2._init;
        try {
          return Qa(a2(b2));
        } catch (c2) {
        }
    }
    return null;
  }
  function Ra(a2) {
    var b2 = a2.type;
    switch (a2.tag) {
      case 24:
        return "Cache";
      case 9:
        return (b2.displayName || "Context") + ".Consumer";
      case 10:
        return (b2._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return a2 = b2.render, a2 = a2.displayName || a2.name || "", b2.displayName || ("" !== a2 ? "ForwardRef(" + a2 + ")" : "ForwardRef");
      case 7:
        return "Fragment";
      case 5:
        return b2;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return Qa(b2);
      case 8:
        return b2 === za ? "StrictMode" : "Mode";
      case 22:
        return "Offscreen";
      case 12:
        return "Profiler";
      case 21:
        return "Scope";
      case 13:
        return "Suspense";
      case 19:
        return "SuspenseList";
      case 25:
        return "TracingMarker";
      case 1:
      case 0:
      case 17:
      case 2:
      case 14:
      case 15:
        if ("function" === typeof b2) return b2.displayName || b2.name || null;
        if ("string" === typeof b2) return b2;
    }
    return null;
  }
  function Sa(a2) {
    switch (typeof a2) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return a2;
      case "object":
        return a2;
      default:
        return "";
    }
  }
  function Ta(a2) {
    var b2 = a2.type;
    return (a2 = a2.nodeName) && "input" === a2.toLowerCase() && ("checkbox" === b2 || "radio" === b2);
  }
  function Ua(a2) {
    var b2 = Ta(a2) ? "checked" : "value", c2 = Object.getOwnPropertyDescriptor(a2.constructor.prototype, b2), d2 = "" + a2[b2];
    if (!a2.hasOwnProperty(b2) && "undefined" !== typeof c2 && "function" === typeof c2.get && "function" === typeof c2.set) {
      var e2 = c2.get, f2 = c2.set;
      Object.defineProperty(a2, b2, { configurable: true, get: function() {
        return e2.call(this);
      }, set: function(a3) {
        d2 = "" + a3;
        f2.call(this, a3);
      } });
      Object.defineProperty(a2, b2, { enumerable: c2.enumerable });
      return { getValue: function() {
        return d2;
      }, setValue: function(a3) {
        d2 = "" + a3;
      }, stopTracking: function() {
        a2._valueTracker = null;
        delete a2[b2];
      } };
    }
  }
  function Va(a2) {
    a2._valueTracker || (a2._valueTracker = Ua(a2));
  }
  function Wa(a2) {
    if (!a2) return false;
    var b2 = a2._valueTracker;
    if (!b2) return true;
    var c2 = b2.getValue();
    var d2 = "";
    a2 && (d2 = Ta(a2) ? a2.checked ? "true" : "false" : a2.value);
    a2 = d2;
    return a2 !== c2 ? (b2.setValue(a2), true) : false;
  }
  function Xa(a2) {
    a2 = a2 || ("undefined" !== typeof document ? document : void 0);
    if ("undefined" === typeof a2) return null;
    try {
      return a2.activeElement || a2.body;
    } catch (b2) {
      return a2.body;
    }
  }
  function Ya(a2, b2) {
    var c2 = b2.checked;
    return A$2({}, b2, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != c2 ? c2 : a2._wrapperState.initialChecked });
  }
  function Za(a2, b2) {
    var c2 = null == b2.defaultValue ? "" : b2.defaultValue, d2 = null != b2.checked ? b2.checked : b2.defaultChecked;
    c2 = Sa(null != b2.value ? b2.value : c2);
    a2._wrapperState = { initialChecked: d2, initialValue: c2, controlled: "checkbox" === b2.type || "radio" === b2.type ? null != b2.checked : null != b2.value };
  }
  function ab(a2, b2) {
    b2 = b2.checked;
    null != b2 && ta(a2, "checked", b2, false);
  }
  function bb(a2, b2) {
    ab(a2, b2);
    var c2 = Sa(b2.value), d2 = b2.type;
    if (null != c2) if ("number" === d2) {
      if (0 === c2 && "" === a2.value || a2.value != c2) a2.value = "" + c2;
    } else a2.value !== "" + c2 && (a2.value = "" + c2);
    else if ("submit" === d2 || "reset" === d2) {
      a2.removeAttribute("value");
      return;
    }
    b2.hasOwnProperty("value") ? cb(a2, b2.type, c2) : b2.hasOwnProperty("defaultValue") && cb(a2, b2.type, Sa(b2.defaultValue));
    null == b2.checked && null != b2.defaultChecked && (a2.defaultChecked = !!b2.defaultChecked);
  }
  function db(a2, b2, c2) {
    if (b2.hasOwnProperty("value") || b2.hasOwnProperty("defaultValue")) {
      var d2 = b2.type;
      if (!("submit" !== d2 && "reset" !== d2 || void 0 !== b2.value && null !== b2.value)) return;
      b2 = "" + a2._wrapperState.initialValue;
      c2 || b2 === a2.value || (a2.value = b2);
      a2.defaultValue = b2;
    }
    c2 = a2.name;
    "" !== c2 && (a2.name = "");
    a2.defaultChecked = !!a2._wrapperState.initialChecked;
    "" !== c2 && (a2.name = c2);
  }
  function cb(a2, b2, c2) {
    if ("number" !== b2 || Xa(a2.ownerDocument) !== a2) null == c2 ? a2.defaultValue = "" + a2._wrapperState.initialValue : a2.defaultValue !== "" + c2 && (a2.defaultValue = "" + c2);
  }
  var eb = Array.isArray;
  function fb(a2, b2, c2, d2) {
    a2 = a2.options;
    if (b2) {
      b2 = {};
      for (var e2 = 0; e2 < c2.length; e2++) b2["$" + c2[e2]] = true;
      for (c2 = 0; c2 < a2.length; c2++) e2 = b2.hasOwnProperty("$" + a2[c2].value), a2[c2].selected !== e2 && (a2[c2].selected = e2), e2 && d2 && (a2[c2].defaultSelected = true);
    } else {
      c2 = "" + Sa(c2);
      b2 = null;
      for (e2 = 0; e2 < a2.length; e2++) {
        if (a2[e2].value === c2) {
          a2[e2].selected = true;
          d2 && (a2[e2].defaultSelected = true);
          return;
        }
        null !== b2 || a2[e2].disabled || (b2 = a2[e2]);
      }
      null !== b2 && (b2.selected = true);
    }
  }
  function gb(a2, b2) {
    if (null != b2.dangerouslySetInnerHTML) throw Error(p$3(91));
    return A$2({}, b2, { value: void 0, defaultValue: void 0, children: "" + a2._wrapperState.initialValue });
  }
  function hb(a2, b2) {
    var c2 = b2.value;
    if (null == c2) {
      c2 = b2.children;
      b2 = b2.defaultValue;
      if (null != c2) {
        if (null != b2) throw Error(p$3(92));
        if (eb(c2)) {
          if (1 < c2.length) throw Error(p$3(93));
          c2 = c2[0];
        }
        b2 = c2;
      }
      null == b2 && (b2 = "");
      c2 = b2;
    }
    a2._wrapperState = { initialValue: Sa(c2) };
  }
  function ib(a2, b2) {
    var c2 = Sa(b2.value), d2 = Sa(b2.defaultValue);
    null != c2 && (c2 = "" + c2, c2 !== a2.value && (a2.value = c2), null == b2.defaultValue && a2.defaultValue !== c2 && (a2.defaultValue = c2));
    null != d2 && (a2.defaultValue = "" + d2);
  }
  function jb(a2) {
    var b2 = a2.textContent;
    b2 === a2._wrapperState.initialValue && "" !== b2 && null !== b2 && (a2.value = b2);
  }
  function kb(a2) {
    switch (a2) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function lb(a2, b2) {
    return null == a2 || "http://www.w3.org/1999/xhtml" === a2 ? kb(b2) : "http://www.w3.org/2000/svg" === a2 && "foreignObject" === b2 ? "http://www.w3.org/1999/xhtml" : a2;
  }
  var mb, nb = function(a2) {
    return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b2, c2, d2, e2) {
      MSApp.execUnsafeLocalFunction(function() {
        return a2(b2, c2, d2, e2);
      });
    } : a2;
  }(function(a2, b2) {
    if ("http://www.w3.org/2000/svg" !== a2.namespaceURI || "innerHTML" in a2) a2.innerHTML = b2;
    else {
      mb = mb || document.createElement("div");
      mb.innerHTML = "<svg>" + b2.valueOf().toString() + "</svg>";
      for (b2 = mb.firstChild; a2.firstChild; ) a2.removeChild(a2.firstChild);
      for (; b2.firstChild; ) a2.appendChild(b2.firstChild);
    }
  });
  function ob(a2, b2) {
    if (b2) {
      var c2 = a2.firstChild;
      if (c2 && c2 === a2.lastChild && 3 === c2.nodeType) {
        c2.nodeValue = b2;
        return;
      }
    }
    a2.textContent = b2;
  }
  var pb = {
    animationIterationCount: true,
    aspectRatio: true,
    borderImageOutset: true,
    borderImageSlice: true,
    borderImageWidth: true,
    boxFlex: true,
    boxFlexGroup: true,
    boxOrdinalGroup: true,
    columnCount: true,
    columns: true,
    flex: true,
    flexGrow: true,
    flexPositive: true,
    flexShrink: true,
    flexNegative: true,
    flexOrder: true,
    gridArea: true,
    gridRow: true,
    gridRowEnd: true,
    gridRowSpan: true,
    gridRowStart: true,
    gridColumn: true,
    gridColumnEnd: true,
    gridColumnSpan: true,
    gridColumnStart: true,
    fontWeight: true,
    lineClamp: true,
    lineHeight: true,
    opacity: true,
    order: true,
    orphans: true,
    tabSize: true,
    widows: true,
    zIndex: true,
    zoom: true,
    fillOpacity: true,
    floodOpacity: true,
    stopOpacity: true,
    strokeDasharray: true,
    strokeDashoffset: true,
    strokeMiterlimit: true,
    strokeOpacity: true,
    strokeWidth: true
  }, qb = ["Webkit", "ms", "Moz", "O"];
  Object.keys(pb).forEach(function(a2) {
    qb.forEach(function(b2) {
      b2 = b2 + a2.charAt(0).toUpperCase() + a2.substring(1);
      pb[b2] = pb[a2];
    });
  });
  function rb(a2, b2, c2) {
    return null == b2 || "boolean" === typeof b2 || "" === b2 ? "" : c2 || "number" !== typeof b2 || 0 === b2 || pb.hasOwnProperty(a2) && pb[a2] ? ("" + b2).trim() : b2 + "px";
  }
  function sb(a2, b2) {
    a2 = a2.style;
    for (var c2 in b2) if (b2.hasOwnProperty(c2)) {
      var d2 = 0 === c2.indexOf("--"), e2 = rb(c2, b2[c2], d2);
      "float" === c2 && (c2 = "cssFloat");
      d2 ? a2.setProperty(c2, e2) : a2[c2] = e2;
    }
  }
  var tb = A$2({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
  function ub(a2, b2) {
    if (b2) {
      if (tb[a2] && (null != b2.children || null != b2.dangerouslySetInnerHTML)) throw Error(p$3(137, a2));
      if (null != b2.dangerouslySetInnerHTML) {
        if (null != b2.children) throw Error(p$3(60));
        if ("object" !== typeof b2.dangerouslySetInnerHTML || !("__html" in b2.dangerouslySetInnerHTML)) throw Error(p$3(61));
      }
      if (null != b2.style && "object" !== typeof b2.style) throw Error(p$3(62));
    }
  }
  function vb(a2, b2) {
    if (-1 === a2.indexOf("-")) return "string" === typeof b2.is;
    switch (a2) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return false;
      default:
        return true;
    }
  }
  var wb = null;
  function xb(a2) {
    a2 = a2.target || a2.srcElement || window;
    a2.correspondingUseElement && (a2 = a2.correspondingUseElement);
    return 3 === a2.nodeType ? a2.parentNode : a2;
  }
  var yb = null, zb = null, Ab = null;
  function Bb(a2) {
    if (a2 = Cb(a2)) {
      if ("function" !== typeof yb) throw Error(p$3(280));
      var b2 = a2.stateNode;
      b2 && (b2 = Db(b2), yb(a2.stateNode, a2.type, b2));
    }
  }
  function Eb(a2) {
    zb ? Ab ? Ab.push(a2) : Ab = [a2] : zb = a2;
  }
  function Fb() {
    if (zb) {
      var a2 = zb, b2 = Ab;
      Ab = zb = null;
      Bb(a2);
      if (b2) for (a2 = 0; a2 < b2.length; a2++) Bb(b2[a2]);
    }
  }
  function Gb(a2, b2) {
    return a2(b2);
  }
  function Hb() {
  }
  var Ib = false;
  function Jb(a2, b2, c2) {
    if (Ib) return a2(b2, c2);
    Ib = true;
    try {
      return Gb(a2, b2, c2);
    } finally {
      if (Ib = false, null !== zb || null !== Ab) Hb(), Fb();
    }
  }
  function Kb(a2, b2) {
    var c2 = a2.stateNode;
    if (null === c2) return null;
    var d2 = Db(c2);
    if (null === d2) return null;
    c2 = d2[b2];
    a: switch (b2) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (d2 = !d2.disabled) || (a2 = a2.type, d2 = !("button" === a2 || "input" === a2 || "select" === a2 || "textarea" === a2));
        a2 = !d2;
        break a;
      default:
        a2 = false;
    }
    if (a2) return null;
    if (c2 && "function" !== typeof c2) throw Error(p$3(231, b2, typeof c2));
    return c2;
  }
  var Lb = false;
  if (ia) try {
    var Mb = {};
    Object.defineProperty(Mb, "passive", { get: function() {
      Lb = true;
    } });
    window.addEventListener("test", Mb, Mb);
    window.removeEventListener("test", Mb, Mb);
  } catch (a2) {
    Lb = false;
  }
  function Nb(a2, b2, c2, d2, e2, f2, g2, h2, k2) {
    var l2 = Array.prototype.slice.call(arguments, 3);
    try {
      b2.apply(c2, l2);
    } catch (m2) {
      this.onError(m2);
    }
  }
  var Ob = false, Pb = null, Qb = false, Rb = null, Sb = { onError: function(a2) {
    Ob = true;
    Pb = a2;
  } };
  function Tb(a2, b2, c2, d2, e2, f2, g2, h2, k2) {
    Ob = false;
    Pb = null;
    Nb.apply(Sb, arguments);
  }
  function Ub(a2, b2, c2, d2, e2, f2, g2, h2, k2) {
    Tb.apply(this, arguments);
    if (Ob) {
      if (Ob) {
        var l2 = Pb;
        Ob = false;
        Pb = null;
      } else throw Error(p$3(198));
      Qb || (Qb = true, Rb = l2);
    }
  }
  function Vb(a2) {
    var b2 = a2, c2 = a2;
    if (a2.alternate) for (; b2.return; ) b2 = b2.return;
    else {
      a2 = b2;
      do
        b2 = a2, 0 !== (b2.flags & 4098) && (c2 = b2.return), a2 = b2.return;
      while (a2);
    }
    return 3 === b2.tag ? c2 : null;
  }
  function Wb(a2) {
    if (13 === a2.tag) {
      var b2 = a2.memoizedState;
      null === b2 && (a2 = a2.alternate, null !== a2 && (b2 = a2.memoizedState));
      if (null !== b2) return b2.dehydrated;
    }
    return null;
  }
  function Xb(a2) {
    if (Vb(a2) !== a2) throw Error(p$3(188));
  }
  function Yb(a2) {
    var b2 = a2.alternate;
    if (!b2) {
      b2 = Vb(a2);
      if (null === b2) throw Error(p$3(188));
      return b2 !== a2 ? null : a2;
    }
    for (var c2 = a2, d2 = b2; ; ) {
      var e2 = c2.return;
      if (null === e2) break;
      var f2 = e2.alternate;
      if (null === f2) {
        d2 = e2.return;
        if (null !== d2) {
          c2 = d2;
          continue;
        }
        break;
      }
      if (e2.child === f2.child) {
        for (f2 = e2.child; f2; ) {
          if (f2 === c2) return Xb(e2), a2;
          if (f2 === d2) return Xb(e2), b2;
          f2 = f2.sibling;
        }
        throw Error(p$3(188));
      }
      if (c2.return !== d2.return) c2 = e2, d2 = f2;
      else {
        for (var g2 = false, h2 = e2.child; h2; ) {
          if (h2 === c2) {
            g2 = true;
            c2 = e2;
            d2 = f2;
            break;
          }
          if (h2 === d2) {
            g2 = true;
            d2 = e2;
            c2 = f2;
            break;
          }
          h2 = h2.sibling;
        }
        if (!g2) {
          for (h2 = f2.child; h2; ) {
            if (h2 === c2) {
              g2 = true;
              c2 = f2;
              d2 = e2;
              break;
            }
            if (h2 === d2) {
              g2 = true;
              d2 = f2;
              c2 = e2;
              break;
            }
            h2 = h2.sibling;
          }
          if (!g2) throw Error(p$3(189));
        }
      }
      if (c2.alternate !== d2) throw Error(p$3(190));
    }
    if (3 !== c2.tag) throw Error(p$3(188));
    return c2.stateNode.current === c2 ? a2 : b2;
  }
  function Zb(a2) {
    a2 = Yb(a2);
    return null !== a2 ? $b(a2) : null;
  }
  function $b(a2) {
    if (5 === a2.tag || 6 === a2.tag) return a2;
    for (a2 = a2.child; null !== a2; ) {
      var b2 = $b(a2);
      if (null !== b2) return b2;
      a2 = a2.sibling;
    }
    return null;
  }
  var ac = ca.unstable_scheduleCallback, bc = ca.unstable_cancelCallback, cc = ca.unstable_shouldYield, dc = ca.unstable_requestPaint, B$2 = ca.unstable_now, ec = ca.unstable_getCurrentPriorityLevel, fc = ca.unstable_ImmediatePriority, gc = ca.unstable_UserBlockingPriority, hc = ca.unstable_NormalPriority, ic = ca.unstable_LowPriority, jc = ca.unstable_IdlePriority, kc = null, lc = null;
  function mc(a2) {
    if (lc && "function" === typeof lc.onCommitFiberRoot) try {
      lc.onCommitFiberRoot(kc, a2, void 0, 128 === (a2.current.flags & 128));
    } catch (b2) {
    }
  }
  var oc = Math.clz32 ? Math.clz32 : nc, pc = Math.log, qc = Math.LN2;
  function nc(a2) {
    a2 >>>= 0;
    return 0 === a2 ? 32 : 31 - (pc(a2) / qc | 0) | 0;
  }
  var rc = 64, sc = 4194304;
  function tc(a2) {
    switch (a2 & -a2) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return a2 & 4194240;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return a2 & 130023424;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return a2;
    }
  }
  function uc(a2, b2) {
    var c2 = a2.pendingLanes;
    if (0 === c2) return 0;
    var d2 = 0, e2 = a2.suspendedLanes, f2 = a2.pingedLanes, g2 = c2 & 268435455;
    if (0 !== g2) {
      var h2 = g2 & ~e2;
      0 !== h2 ? d2 = tc(h2) : (f2 &= g2, 0 !== f2 && (d2 = tc(f2)));
    } else g2 = c2 & ~e2, 0 !== g2 ? d2 = tc(g2) : 0 !== f2 && (d2 = tc(f2));
    if (0 === d2) return 0;
    if (0 !== b2 && b2 !== d2 && 0 === (b2 & e2) && (e2 = d2 & -d2, f2 = b2 & -b2, e2 >= f2 || 16 === e2 && 0 !== (f2 & 4194240))) return b2;
    0 !== (d2 & 4) && (d2 |= c2 & 16);
    b2 = a2.entangledLanes;
    if (0 !== b2) for (a2 = a2.entanglements, b2 &= d2; 0 < b2; ) c2 = 31 - oc(b2), e2 = 1 << c2, d2 |= a2[c2], b2 &= ~e2;
    return d2;
  }
  function vc(a2, b2) {
    switch (a2) {
      case 1:
      case 2:
      case 4:
        return b2 + 250;
      case 8:
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return b2 + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return -1;
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function wc(a2, b2) {
    for (var c2 = a2.suspendedLanes, d2 = a2.pingedLanes, e2 = a2.expirationTimes, f2 = a2.pendingLanes; 0 < f2; ) {
      var g2 = 31 - oc(f2), h2 = 1 << g2, k2 = e2[g2];
      if (-1 === k2) {
        if (0 === (h2 & c2) || 0 !== (h2 & d2)) e2[g2] = vc(h2, b2);
      } else k2 <= b2 && (a2.expiredLanes |= h2);
      f2 &= ~h2;
    }
  }
  function xc(a2) {
    a2 = a2.pendingLanes & -1073741825;
    return 0 !== a2 ? a2 : a2 & 1073741824 ? 1073741824 : 0;
  }
  function yc() {
    var a2 = rc;
    rc <<= 1;
    0 === (rc & 4194240) && (rc = 64);
    return a2;
  }
  function zc(a2) {
    for (var b2 = [], c2 = 0; 31 > c2; c2++) b2.push(a2);
    return b2;
  }
  function Ac(a2, b2, c2) {
    a2.pendingLanes |= b2;
    536870912 !== b2 && (a2.suspendedLanes = 0, a2.pingedLanes = 0);
    a2 = a2.eventTimes;
    b2 = 31 - oc(b2);
    a2[b2] = c2;
  }
  function Bc(a2, b2) {
    var c2 = a2.pendingLanes & ~b2;
    a2.pendingLanes = b2;
    a2.suspendedLanes = 0;
    a2.pingedLanes = 0;
    a2.expiredLanes &= b2;
    a2.mutableReadLanes &= b2;
    a2.entangledLanes &= b2;
    b2 = a2.entanglements;
    var d2 = a2.eventTimes;
    for (a2 = a2.expirationTimes; 0 < c2; ) {
      var e2 = 31 - oc(c2), f2 = 1 << e2;
      b2[e2] = 0;
      d2[e2] = -1;
      a2[e2] = -1;
      c2 &= ~f2;
    }
  }
  function Cc(a2, b2) {
    var c2 = a2.entangledLanes |= b2;
    for (a2 = a2.entanglements; c2; ) {
      var d2 = 31 - oc(c2), e2 = 1 << d2;
      e2 & b2 | a2[d2] & b2 && (a2[d2] |= b2);
      c2 &= ~e2;
    }
  }
  var C$2 = 0;
  function Dc(a2) {
    a2 &= -a2;
    return 1 < a2 ? 4 < a2 ? 0 !== (a2 & 268435455) ? 16 : 536870912 : 4 : 1;
  }
  var Ec, Fc, Gc, Hc, Ic, Jc = false, Kc = [], Lc = null, Mc = null, Nc = null, Oc = /* @__PURE__ */ new Map(), Pc = /* @__PURE__ */ new Map(), Qc = [], Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function Sc(a2, b2) {
    switch (a2) {
      case "focusin":
      case "focusout":
        Lc = null;
        break;
      case "dragenter":
      case "dragleave":
        Mc = null;
        break;
      case "mouseover":
      case "mouseout":
        Nc = null;
        break;
      case "pointerover":
      case "pointerout":
        Oc.delete(b2.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Pc.delete(b2.pointerId);
    }
  }
  function Tc(a2, b2, c2, d2, e2, f2) {
    if (null === a2 || a2.nativeEvent !== f2) return a2 = { blockedOn: b2, domEventName: c2, eventSystemFlags: d2, nativeEvent: f2, targetContainers: [e2] }, null !== b2 && (b2 = Cb(b2), null !== b2 && Fc(b2)), a2;
    a2.eventSystemFlags |= d2;
    b2 = a2.targetContainers;
    null !== e2 && -1 === b2.indexOf(e2) && b2.push(e2);
    return a2;
  }
  function Uc(a2, b2, c2, d2, e2) {
    switch (b2) {
      case "focusin":
        return Lc = Tc(Lc, a2, b2, c2, d2, e2), true;
      case "dragenter":
        return Mc = Tc(Mc, a2, b2, c2, d2, e2), true;
      case "mouseover":
        return Nc = Tc(Nc, a2, b2, c2, d2, e2), true;
      case "pointerover":
        var f2 = e2.pointerId;
        Oc.set(f2, Tc(Oc.get(f2) || null, a2, b2, c2, d2, e2));
        return true;
      case "gotpointercapture":
        return f2 = e2.pointerId, Pc.set(f2, Tc(Pc.get(f2) || null, a2, b2, c2, d2, e2)), true;
    }
    return false;
  }
  function Vc(a2) {
    var b2 = Wc(a2.target);
    if (null !== b2) {
      var c2 = Vb(b2);
      if (null !== c2) {
        if (b2 = c2.tag, 13 === b2) {
          if (b2 = Wb(c2), null !== b2) {
            a2.blockedOn = b2;
            Ic(a2.priority, function() {
              Gc(c2);
            });
            return;
          }
        } else if (3 === b2 && c2.stateNode.current.memoizedState.isDehydrated) {
          a2.blockedOn = 3 === c2.tag ? c2.stateNode.containerInfo : null;
          return;
        }
      }
    }
    a2.blockedOn = null;
  }
  function Xc(a2) {
    if (null !== a2.blockedOn) return false;
    for (var b2 = a2.targetContainers; 0 < b2.length; ) {
      var c2 = Yc(a2.domEventName, a2.eventSystemFlags, b2[0], a2.nativeEvent);
      if (null === c2) {
        c2 = a2.nativeEvent;
        var d2 = new c2.constructor(c2.type, c2);
        wb = d2;
        c2.target.dispatchEvent(d2);
        wb = null;
      } else return b2 = Cb(c2), null !== b2 && Fc(b2), a2.blockedOn = c2, false;
      b2.shift();
    }
    return true;
  }
  function Zc(a2, b2, c2) {
    Xc(a2) && c2.delete(b2);
  }
  function $c() {
    Jc = false;
    null !== Lc && Xc(Lc) && (Lc = null);
    null !== Mc && Xc(Mc) && (Mc = null);
    null !== Nc && Xc(Nc) && (Nc = null);
    Oc.forEach(Zc);
    Pc.forEach(Zc);
  }
  function ad(a2, b2) {
    a2.blockedOn === b2 && (a2.blockedOn = null, Jc || (Jc = true, ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
  }
  function bd(a2) {
    function b2(b3) {
      return ad(b3, a2);
    }
    if (0 < Kc.length) {
      ad(Kc[0], a2);
      for (var c2 = 1; c2 < Kc.length; c2++) {
        var d2 = Kc[c2];
        d2.blockedOn === a2 && (d2.blockedOn = null);
      }
    }
    null !== Lc && ad(Lc, a2);
    null !== Mc && ad(Mc, a2);
    null !== Nc && ad(Nc, a2);
    Oc.forEach(b2);
    Pc.forEach(b2);
    for (c2 = 0; c2 < Qc.length; c2++) d2 = Qc[c2], d2.blockedOn === a2 && (d2.blockedOn = null);
    for (; 0 < Qc.length && (c2 = Qc[0], null === c2.blockedOn); ) Vc(c2), null === c2.blockedOn && Qc.shift();
  }
  var cd = ua.ReactCurrentBatchConfig, dd = true;
  function ed(a2, b2, c2, d2) {
    var e2 = C$2, f2 = cd.transition;
    cd.transition = null;
    try {
      C$2 = 1, fd(a2, b2, c2, d2);
    } finally {
      C$2 = e2, cd.transition = f2;
    }
  }
  function gd(a2, b2, c2, d2) {
    var e2 = C$2, f2 = cd.transition;
    cd.transition = null;
    try {
      C$2 = 4, fd(a2, b2, c2, d2);
    } finally {
      C$2 = e2, cd.transition = f2;
    }
  }
  function fd(a2, b2, c2, d2) {
    if (dd) {
      var e2 = Yc(a2, b2, c2, d2);
      if (null === e2) hd(a2, b2, d2, id, c2), Sc(a2, d2);
      else if (Uc(e2, a2, b2, c2, d2)) d2.stopPropagation();
      else if (Sc(a2, d2), b2 & 4 && -1 < Rc.indexOf(a2)) {
        for (; null !== e2; ) {
          var f2 = Cb(e2);
          null !== f2 && Ec(f2);
          f2 = Yc(a2, b2, c2, d2);
          null === f2 && hd(a2, b2, d2, id, c2);
          if (f2 === e2) break;
          e2 = f2;
        }
        null !== e2 && d2.stopPropagation();
      } else hd(a2, b2, d2, null, c2);
    }
  }
  var id = null;
  function Yc(a2, b2, c2, d2) {
    id = null;
    a2 = xb(d2);
    a2 = Wc(a2);
    if (null !== a2) if (b2 = Vb(a2), null === b2) a2 = null;
    else if (c2 = b2.tag, 13 === c2) {
      a2 = Wb(b2);
      if (null !== a2) return a2;
      a2 = null;
    } else if (3 === c2) {
      if (b2.stateNode.current.memoizedState.isDehydrated) return 3 === b2.tag ? b2.stateNode.containerInfo : null;
      a2 = null;
    } else b2 !== a2 && (a2 = null);
    id = a2;
    return null;
  }
  function jd(a2) {
    switch (a2) {
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 1;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "toggle":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 4;
      case "message":
        switch (ec()) {
          case fc:
            return 1;
          case gc:
            return 4;
          case hc:
          case ic:
            return 16;
          case jc:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var kd = null, ld = null, md = null;
  function nd() {
    if (md) return md;
    var a2, b2 = ld, c2 = b2.length, d2, e2 = "value" in kd ? kd.value : kd.textContent, f2 = e2.length;
    for (a2 = 0; a2 < c2 && b2[a2] === e2[a2]; a2++) ;
    var g2 = c2 - a2;
    for (d2 = 1; d2 <= g2 && b2[c2 - d2] === e2[f2 - d2]; d2++) ;
    return md = e2.slice(a2, 1 < d2 ? 1 - d2 : void 0);
  }
  function od(a2) {
    var b2 = a2.keyCode;
    "charCode" in a2 ? (a2 = a2.charCode, 0 === a2 && 13 === b2 && (a2 = 13)) : a2 = b2;
    10 === a2 && (a2 = 13);
    return 32 <= a2 || 13 === a2 ? a2 : 0;
  }
  function pd() {
    return true;
  }
  function qd() {
    return false;
  }
  function rd(a2) {
    function b2(b3, d2, e2, f2, g2) {
      this._reactName = b3;
      this._targetInst = e2;
      this.type = d2;
      this.nativeEvent = f2;
      this.target = g2;
      this.currentTarget = null;
      for (var c2 in a2) a2.hasOwnProperty(c2) && (b3 = a2[c2], this[c2] = b3 ? b3(f2) : f2[c2]);
      this.isDefaultPrevented = (null != f2.defaultPrevented ? f2.defaultPrevented : false === f2.returnValue) ? pd : qd;
      this.isPropagationStopped = qd;
      return this;
    }
    A$2(b2.prototype, { preventDefault: function() {
      this.defaultPrevented = true;
      var a3 = this.nativeEvent;
      a3 && (a3.preventDefault ? a3.preventDefault() : "unknown" !== typeof a3.returnValue && (a3.returnValue = false), this.isDefaultPrevented = pd);
    }, stopPropagation: function() {
      var a3 = this.nativeEvent;
      a3 && (a3.stopPropagation ? a3.stopPropagation() : "unknown" !== typeof a3.cancelBubble && (a3.cancelBubble = true), this.isPropagationStopped = pd);
    }, persist: function() {
    }, isPersistent: pd });
    return b2;
  }
  var sd = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(a2) {
    return a2.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, td = rd(sd), ud = A$2({}, sd, { view: 0, detail: 0 }), vd = rd(ud), wd, xd, yd, Ad = A$2({}, ud, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zd, button: 0, buttons: 0, relatedTarget: function(a2) {
    return void 0 === a2.relatedTarget ? a2.fromElement === a2.srcElement ? a2.toElement : a2.fromElement : a2.relatedTarget;
  }, movementX: function(a2) {
    if ("movementX" in a2) return a2.movementX;
    a2 !== yd && (yd && "mousemove" === a2.type ? (wd = a2.screenX - yd.screenX, xd = a2.screenY - yd.screenY) : xd = wd = 0, yd = a2);
    return wd;
  }, movementY: function(a2) {
    return "movementY" in a2 ? a2.movementY : xd;
  } }), Bd = rd(Ad), Cd = A$2({}, Ad, { dataTransfer: 0 }), Dd = rd(Cd), Ed = A$2({}, ud, { relatedTarget: 0 }), Fd = rd(Ed), Gd = A$2({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Hd = rd(Gd), Id = A$2({}, sd, { clipboardData: function(a2) {
    return "clipboardData" in a2 ? a2.clipboardData : window.clipboardData;
  } }), Jd = rd(Id), Kd = A$2({}, sd, { data: 0 }), Ld = rd(Kd), Md = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, Nd = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, Od = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Pd(a2) {
    var b2 = this.nativeEvent;
    return b2.getModifierState ? b2.getModifierState(a2) : (a2 = Od[a2]) ? !!b2[a2] : false;
  }
  function zd() {
    return Pd;
  }
  var Qd = A$2({}, ud, { key: function(a2) {
    if (a2.key) {
      var b2 = Md[a2.key] || a2.key;
      if ("Unidentified" !== b2) return b2;
    }
    return "keypress" === a2.type ? (a2 = od(a2), 13 === a2 ? "Enter" : String.fromCharCode(a2)) : "keydown" === a2.type || "keyup" === a2.type ? Nd[a2.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zd, charCode: function(a2) {
    return "keypress" === a2.type ? od(a2) : 0;
  }, keyCode: function(a2) {
    return "keydown" === a2.type || "keyup" === a2.type ? a2.keyCode : 0;
  }, which: function(a2) {
    return "keypress" === a2.type ? od(a2) : "keydown" === a2.type || "keyup" === a2.type ? a2.keyCode : 0;
  } }), Rd = rd(Qd), Sd = A$2({}, Ad, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Td = rd(Sd), Ud = A$2({}, ud, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zd }), Vd = rd(Ud), Wd = A$2({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Xd = rd(Wd), Yd = A$2({}, Ad, {
    deltaX: function(a2) {
      return "deltaX" in a2 ? a2.deltaX : "wheelDeltaX" in a2 ? -a2.wheelDeltaX : 0;
    },
    deltaY: function(a2) {
      return "deltaY" in a2 ? a2.deltaY : "wheelDeltaY" in a2 ? -a2.wheelDeltaY : "wheelDelta" in a2 ? -a2.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Zd = rd(Yd), $d = [9, 13, 27, 32], ae$1 = ia && "CompositionEvent" in window, be$1 = null;
  ia && "documentMode" in document && (be$1 = document.documentMode);
  var ce = ia && "TextEvent" in window && !be$1, de$1 = ia && (!ae$1 || be$1 && 8 < be$1 && 11 >= be$1), ee$1 = String.fromCharCode(32), fe$1 = false;
  function ge(a2, b2) {
    switch (a2) {
      case "keyup":
        return -1 !== $d.indexOf(b2.keyCode);
      case "keydown":
        return 229 !== b2.keyCode;
      case "keypress":
      case "mousedown":
      case "focusout":
        return true;
      default:
        return false;
    }
  }
  function he$1(a2) {
    a2 = a2.detail;
    return "object" === typeof a2 && "data" in a2 ? a2.data : null;
  }
  var ie$1 = false;
  function je(a2, b2) {
    switch (a2) {
      case "compositionend":
        return he$1(b2);
      case "keypress":
        if (32 !== b2.which) return null;
        fe$1 = true;
        return ee$1;
      case "textInput":
        return a2 = b2.data, a2 === ee$1 && fe$1 ? null : a2;
      default:
        return null;
    }
  }
  function ke(a2, b2) {
    if (ie$1) return "compositionend" === a2 || !ae$1 && ge(a2, b2) ? (a2 = nd(), md = ld = kd = null, ie$1 = false, a2) : null;
    switch (a2) {
      case "paste":
        return null;
      case "keypress":
        if (!(b2.ctrlKey || b2.altKey || b2.metaKey) || b2.ctrlKey && b2.altKey) {
          if (b2.char && 1 < b2.char.length) return b2.char;
          if (b2.which) return String.fromCharCode(b2.which);
        }
        return null;
      case "compositionend":
        return de$1 && "ko" !== b2.locale ? null : b2.data;
      default:
        return null;
    }
  }
  var le$1 = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
  function me(a2) {
    var b2 = a2 && a2.nodeName && a2.nodeName.toLowerCase();
    return "input" === b2 ? !!le$1[a2.type] : "textarea" === b2 ? true : false;
  }
  function ne(a2, b2, c2, d2) {
    Eb(d2);
    b2 = oe(b2, "onChange");
    0 < b2.length && (c2 = new td("onChange", "change", null, c2, d2), a2.push({ event: c2, listeners: b2 }));
  }
  var pe = null, qe = null;
  function re(a2) {
    se$1(a2, 0);
  }
  function te$1(a2) {
    var b2 = ue(a2);
    if (Wa(b2)) return a2;
  }
  function ve(a2, b2) {
    if ("change" === a2) return b2;
  }
  var we = false;
  if (ia) {
    var xe;
    if (ia) {
      var ye = "oninput" in document;
      if (!ye) {
        var ze = document.createElement("div");
        ze.setAttribute("oninput", "return;");
        ye = "function" === typeof ze.oninput;
      }
      xe = ye;
    } else xe = false;
    we = xe && (!document.documentMode || 9 < document.documentMode);
  }
  function Ae() {
    pe && (pe.detachEvent("onpropertychange", Be), qe = pe = null);
  }
  function Be(a2) {
    if ("value" === a2.propertyName && te$1(qe)) {
      var b2 = [];
      ne(b2, qe, a2, xb(a2));
      Jb(re, b2);
    }
  }
  function Ce$1(a2, b2, c2) {
    "focusin" === a2 ? (Ae(), pe = b2, qe = c2, pe.attachEvent("onpropertychange", Be)) : "focusout" === a2 && Ae();
  }
  function De$1(a2) {
    if ("selectionchange" === a2 || "keyup" === a2 || "keydown" === a2) return te$1(qe);
  }
  function Ee$1(a2, b2) {
    if ("click" === a2) return te$1(b2);
  }
  function Fe(a2, b2) {
    if ("input" === a2 || "change" === a2) return te$1(b2);
  }
  function Ge(a2, b2) {
    return a2 === b2 && (0 !== a2 || 1 / a2 === 1 / b2) || a2 !== a2 && b2 !== b2;
  }
  var He$1 = "function" === typeof Object.is ? Object.is : Ge;
  function Ie(a2, b2) {
    if (He$1(a2, b2)) return true;
    if ("object" !== typeof a2 || null === a2 || "object" !== typeof b2 || null === b2) return false;
    var c2 = Object.keys(a2), d2 = Object.keys(b2);
    if (c2.length !== d2.length) return false;
    for (d2 = 0; d2 < c2.length; d2++) {
      var e2 = c2[d2];
      if (!ja.call(b2, e2) || !He$1(a2[e2], b2[e2])) return false;
    }
    return true;
  }
  function Je(a2) {
    for (; a2 && a2.firstChild; ) a2 = a2.firstChild;
    return a2;
  }
  function Ke(a2, b2) {
    var c2 = Je(a2);
    a2 = 0;
    for (var d2; c2; ) {
      if (3 === c2.nodeType) {
        d2 = a2 + c2.textContent.length;
        if (a2 <= b2 && d2 >= b2) return { node: c2, offset: b2 - a2 };
        a2 = d2;
      }
      a: {
        for (; c2; ) {
          if (c2.nextSibling) {
            c2 = c2.nextSibling;
            break a;
          }
          c2 = c2.parentNode;
        }
        c2 = void 0;
      }
      c2 = Je(c2);
    }
  }
  function Le(a2, b2) {
    return a2 && b2 ? a2 === b2 ? true : a2 && 3 === a2.nodeType ? false : b2 && 3 === b2.nodeType ? Le(a2, b2.parentNode) : "contains" in a2 ? a2.contains(b2) : a2.compareDocumentPosition ? !!(a2.compareDocumentPosition(b2) & 16) : false : false;
  }
  function Me$1() {
    for (var a2 = window, b2 = Xa(); b2 instanceof a2.HTMLIFrameElement; ) {
      try {
        var c2 = "string" === typeof b2.contentWindow.location.href;
      } catch (d2) {
        c2 = false;
      }
      if (c2) a2 = b2.contentWindow;
      else break;
      b2 = Xa(a2.document);
    }
    return b2;
  }
  function Ne(a2) {
    var b2 = a2 && a2.nodeName && a2.nodeName.toLowerCase();
    return b2 && ("input" === b2 && ("text" === a2.type || "search" === a2.type || "tel" === a2.type || "url" === a2.type || "password" === a2.type) || "textarea" === b2 || "true" === a2.contentEditable);
  }
  function Oe$1(a2) {
    var b2 = Me$1(), c2 = a2.focusedElem, d2 = a2.selectionRange;
    if (b2 !== c2 && c2 && c2.ownerDocument && Le(c2.ownerDocument.documentElement, c2)) {
      if (null !== d2 && Ne(c2)) {
        if (b2 = d2.start, a2 = d2.end, void 0 === a2 && (a2 = b2), "selectionStart" in c2) c2.selectionStart = b2, c2.selectionEnd = Math.min(a2, c2.value.length);
        else if (a2 = (b2 = c2.ownerDocument || document) && b2.defaultView || window, a2.getSelection) {
          a2 = a2.getSelection();
          var e2 = c2.textContent.length, f2 = Math.min(d2.start, e2);
          d2 = void 0 === d2.end ? f2 : Math.min(d2.end, e2);
          !a2.extend && f2 > d2 && (e2 = d2, d2 = f2, f2 = e2);
          e2 = Ke(c2, f2);
          var g2 = Ke(
            c2,
            d2
          );
          e2 && g2 && (1 !== a2.rangeCount || a2.anchorNode !== e2.node || a2.anchorOffset !== e2.offset || a2.focusNode !== g2.node || a2.focusOffset !== g2.offset) && (b2 = b2.createRange(), b2.setStart(e2.node, e2.offset), a2.removeAllRanges(), f2 > d2 ? (a2.addRange(b2), a2.extend(g2.node, g2.offset)) : (b2.setEnd(g2.node, g2.offset), a2.addRange(b2)));
        }
      }
      b2 = [];
      for (a2 = c2; a2 = a2.parentNode; ) 1 === a2.nodeType && b2.push({ element: a2, left: a2.scrollLeft, top: a2.scrollTop });
      "function" === typeof c2.focus && c2.focus();
      for (c2 = 0; c2 < b2.length; c2++) a2 = b2[c2], a2.element.scrollLeft = a2.left, a2.element.scrollTop = a2.top;
    }
  }
  var Pe = ia && "documentMode" in document && 11 >= document.documentMode, Qe = null, Re = null, Se = null, Te = false;
  function Ue(a2, b2, c2) {
    var d2 = c2.window === c2 ? c2.document : 9 === c2.nodeType ? c2 : c2.ownerDocument;
    Te || null == Qe || Qe !== Xa(d2) || (d2 = Qe, "selectionStart" in d2 && Ne(d2) ? d2 = { start: d2.selectionStart, end: d2.selectionEnd } : (d2 = (d2.ownerDocument && d2.ownerDocument.defaultView || window).getSelection(), d2 = { anchorNode: d2.anchorNode, anchorOffset: d2.anchorOffset, focusNode: d2.focusNode, focusOffset: d2.focusOffset }), Se && Ie(Se, d2) || (Se = d2, d2 = oe(Re, "onSelect"), 0 < d2.length && (b2 = new td("onSelect", "select", null, b2, c2), a2.push({ event: b2, listeners: d2 }), b2.target = Qe)));
  }
  function Ve$1(a2, b2) {
    var c2 = {};
    c2[a2.toLowerCase()] = b2.toLowerCase();
    c2["Webkit" + a2] = "webkit" + b2;
    c2["Moz" + a2] = "moz" + b2;
    return c2;
  }
  var We = { animationend: Ve$1("Animation", "AnimationEnd"), animationiteration: Ve$1("Animation", "AnimationIteration"), animationstart: Ve$1("Animation", "AnimationStart"), transitionend: Ve$1("Transition", "TransitionEnd") }, Xe = {}, Ye = {};
  ia && (Ye = document.createElement("div").style, "AnimationEvent" in window || (delete We.animationend.animation, delete We.animationiteration.animation, delete We.animationstart.animation), "TransitionEvent" in window || delete We.transitionend.transition);
  function Ze(a2) {
    if (Xe[a2]) return Xe[a2];
    if (!We[a2]) return a2;
    var b2 = We[a2], c2;
    for (c2 in b2) if (b2.hasOwnProperty(c2) && c2 in Ye) return Xe[a2] = b2[c2];
    return a2;
  }
  var $e = Ze("animationend"), af = Ze("animationiteration"), bf = Ze("animationstart"), cf = Ze("transitionend"), df = /* @__PURE__ */ new Map(), ef = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function ff(a2, b2) {
    df.set(a2, b2);
    fa(b2, [a2]);
  }
  for (var gf = 0; gf < ef.length; gf++) {
    var hf = ef[gf], jf = hf.toLowerCase(), kf = hf[0].toUpperCase() + hf.slice(1);
    ff(jf, "on" + kf);
  }
  ff($e, "onAnimationEnd");
  ff(af, "onAnimationIteration");
  ff(bf, "onAnimationStart");
  ff("dblclick", "onDoubleClick");
  ff("focusin", "onFocus");
  ff("focusout", "onBlur");
  ff(cf, "onTransitionEnd");
  ha("onMouseEnter", ["mouseout", "mouseover"]);
  ha("onMouseLeave", ["mouseout", "mouseover"]);
  ha("onPointerEnter", ["pointerout", "pointerover"]);
  ha("onPointerLeave", ["pointerout", "pointerover"]);
  fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
  fa("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
  fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
  fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
  fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
  fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var lf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
  function nf(a2, b2, c2) {
    var d2 = a2.type || "unknown-event";
    a2.currentTarget = c2;
    Ub(d2, b2, void 0, a2);
    a2.currentTarget = null;
  }
  function se$1(a2, b2) {
    b2 = 0 !== (b2 & 4);
    for (var c2 = 0; c2 < a2.length; c2++) {
      var d2 = a2[c2], e2 = d2.event;
      d2 = d2.listeners;
      a: {
        var f2 = void 0;
        if (b2) for (var g2 = d2.length - 1; 0 <= g2; g2--) {
          var h2 = d2[g2], k2 = h2.instance, l2 = h2.currentTarget;
          h2 = h2.listener;
          if (k2 !== f2 && e2.isPropagationStopped()) break a;
          nf(e2, h2, l2);
          f2 = k2;
        }
        else for (g2 = 0; g2 < d2.length; g2++) {
          h2 = d2[g2];
          k2 = h2.instance;
          l2 = h2.currentTarget;
          h2 = h2.listener;
          if (k2 !== f2 && e2.isPropagationStopped()) break a;
          nf(e2, h2, l2);
          f2 = k2;
        }
      }
    }
    if (Qb) throw a2 = Rb, Qb = false, Rb = null, a2;
  }
  function D$2(a2, b2) {
    var c2 = b2[of];
    void 0 === c2 && (c2 = b2[of] = /* @__PURE__ */ new Set());
    var d2 = a2 + "__bubble";
    c2.has(d2) || (pf(b2, a2, 2, false), c2.add(d2));
  }
  function qf(a2, b2, c2) {
    var d2 = 0;
    b2 && (d2 |= 4);
    pf(c2, a2, d2, b2);
  }
  var rf = "_reactListening" + Math.random().toString(36).slice(2);
  function sf(a2) {
    if (!a2[rf]) {
      a2[rf] = true;
      da.forEach(function(b3) {
        "selectionchange" !== b3 && (mf.has(b3) || qf(b3, false, a2), qf(b3, true, a2));
      });
      var b2 = 9 === a2.nodeType ? a2 : a2.ownerDocument;
      null === b2 || b2[rf] || (b2[rf] = true, qf("selectionchange", false, b2));
    }
  }
  function pf(a2, b2, c2, d2) {
    switch (jd(b2)) {
      case 1:
        var e2 = ed;
        break;
      case 4:
        e2 = gd;
        break;
      default:
        e2 = fd;
    }
    c2 = e2.bind(null, b2, c2, a2);
    e2 = void 0;
    !Lb || "touchstart" !== b2 && "touchmove" !== b2 && "wheel" !== b2 || (e2 = true);
    d2 ? void 0 !== e2 ? a2.addEventListener(b2, c2, { capture: true, passive: e2 }) : a2.addEventListener(b2, c2, true) : void 0 !== e2 ? a2.addEventListener(b2, c2, { passive: e2 }) : a2.addEventListener(b2, c2, false);
  }
  function hd(a2, b2, c2, d2, e2) {
    var f2 = d2;
    if (0 === (b2 & 1) && 0 === (b2 & 2) && null !== d2) a: for (; ; ) {
      if (null === d2) return;
      var g2 = d2.tag;
      if (3 === g2 || 4 === g2) {
        var h2 = d2.stateNode.containerInfo;
        if (h2 === e2 || 8 === h2.nodeType && h2.parentNode === e2) break;
        if (4 === g2) for (g2 = d2.return; null !== g2; ) {
          var k2 = g2.tag;
          if (3 === k2 || 4 === k2) {
            if (k2 = g2.stateNode.containerInfo, k2 === e2 || 8 === k2.nodeType && k2.parentNode === e2) return;
          }
          g2 = g2.return;
        }
        for (; null !== h2; ) {
          g2 = Wc(h2);
          if (null === g2) return;
          k2 = g2.tag;
          if (5 === k2 || 6 === k2) {
            d2 = f2 = g2;
            continue a;
          }
          h2 = h2.parentNode;
        }
      }
      d2 = d2.return;
    }
    Jb(function() {
      var d3 = f2, e3 = xb(c2), g3 = [];
      a: {
        var h3 = df.get(a2);
        if (void 0 !== h3) {
          var k3 = td, n2 = a2;
          switch (a2) {
            case "keypress":
              if (0 === od(c2)) break a;
            case "keydown":
            case "keyup":
              k3 = Rd;
              break;
            case "focusin":
              n2 = "focus";
              k3 = Fd;
              break;
            case "focusout":
              n2 = "blur";
              k3 = Fd;
              break;
            case "beforeblur":
            case "afterblur":
              k3 = Fd;
              break;
            case "click":
              if (2 === c2.button) break a;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              k3 = Bd;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              k3 = Dd;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              k3 = Vd;
              break;
            case $e:
            case af:
            case bf:
              k3 = Hd;
              break;
            case cf:
              k3 = Xd;
              break;
            case "scroll":
              k3 = vd;
              break;
            case "wheel":
              k3 = Zd;
              break;
            case "copy":
            case "cut":
            case "paste":
              k3 = Jd;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              k3 = Td;
          }
          var t2 = 0 !== (b2 & 4), J2 = !t2 && "scroll" === a2, x2 = t2 ? null !== h3 ? h3 + "Capture" : null : h3;
          t2 = [];
          for (var w2 = d3, u2; null !== w2; ) {
            u2 = w2;
            var F2 = u2.stateNode;
            5 === u2.tag && null !== F2 && (u2 = F2, null !== x2 && (F2 = Kb(w2, x2), null != F2 && t2.push(tf(w2, F2, u2))));
            if (J2) break;
            w2 = w2.return;
          }
          0 < t2.length && (h3 = new k3(h3, n2, null, c2, e3), g3.push({ event: h3, listeners: t2 }));
        }
      }
      if (0 === (b2 & 7)) {
        a: {
          h3 = "mouseover" === a2 || "pointerover" === a2;
          k3 = "mouseout" === a2 || "pointerout" === a2;
          if (h3 && c2 !== wb && (n2 = c2.relatedTarget || c2.fromElement) && (Wc(n2) || n2[uf])) break a;
          if (k3 || h3) {
            h3 = e3.window === e3 ? e3 : (h3 = e3.ownerDocument) ? h3.defaultView || h3.parentWindow : window;
            if (k3) {
              if (n2 = c2.relatedTarget || c2.toElement, k3 = d3, n2 = n2 ? Wc(n2) : null, null !== n2 && (J2 = Vb(n2), n2 !== J2 || 5 !== n2.tag && 6 !== n2.tag)) n2 = null;
            } else k3 = null, n2 = d3;
            if (k3 !== n2) {
              t2 = Bd;
              F2 = "onMouseLeave";
              x2 = "onMouseEnter";
              w2 = "mouse";
              if ("pointerout" === a2 || "pointerover" === a2) t2 = Td, F2 = "onPointerLeave", x2 = "onPointerEnter", w2 = "pointer";
              J2 = null == k3 ? h3 : ue(k3);
              u2 = null == n2 ? h3 : ue(n2);
              h3 = new t2(F2, w2 + "leave", k3, c2, e3);
              h3.target = J2;
              h3.relatedTarget = u2;
              F2 = null;
              Wc(e3) === d3 && (t2 = new t2(x2, w2 + "enter", n2, c2, e3), t2.target = u2, t2.relatedTarget = J2, F2 = t2);
              J2 = F2;
              if (k3 && n2) b: {
                t2 = k3;
                x2 = n2;
                w2 = 0;
                for (u2 = t2; u2; u2 = vf(u2)) w2++;
                u2 = 0;
                for (F2 = x2; F2; F2 = vf(F2)) u2++;
                for (; 0 < w2 - u2; ) t2 = vf(t2), w2--;
                for (; 0 < u2 - w2; ) x2 = vf(x2), u2--;
                for (; w2--; ) {
                  if (t2 === x2 || null !== x2 && t2 === x2.alternate) break b;
                  t2 = vf(t2);
                  x2 = vf(x2);
                }
                t2 = null;
              }
              else t2 = null;
              null !== k3 && wf(g3, h3, k3, t2, false);
              null !== n2 && null !== J2 && wf(g3, J2, n2, t2, true);
            }
          }
        }
        a: {
          h3 = d3 ? ue(d3) : window;
          k3 = h3.nodeName && h3.nodeName.toLowerCase();
          if ("select" === k3 || "input" === k3 && "file" === h3.type) var na = ve;
          else if (me(h3)) if (we) na = Fe;
          else {
            na = De$1;
            var xa = Ce$1;
          }
          else (k3 = h3.nodeName) && "input" === k3.toLowerCase() && ("checkbox" === h3.type || "radio" === h3.type) && (na = Ee$1);
          if (na && (na = na(a2, d3))) {
            ne(g3, na, c2, e3);
            break a;
          }
          xa && xa(a2, h3, d3);
          "focusout" === a2 && (xa = h3._wrapperState) && xa.controlled && "number" === h3.type && cb(h3, "number", h3.value);
        }
        xa = d3 ? ue(d3) : window;
        switch (a2) {
          case "focusin":
            if (me(xa) || "true" === xa.contentEditable) Qe = xa, Re = d3, Se = null;
            break;
          case "focusout":
            Se = Re = Qe = null;
            break;
          case "mousedown":
            Te = true;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Te = false;
            Ue(g3, c2, e3);
            break;
          case "selectionchange":
            if (Pe) break;
          case "keydown":
          case "keyup":
            Ue(g3, c2, e3);
        }
        var $a;
        if (ae$1) b: {
          switch (a2) {
            case "compositionstart":
              var ba = "onCompositionStart";
              break b;
            case "compositionend":
              ba = "onCompositionEnd";
              break b;
            case "compositionupdate":
              ba = "onCompositionUpdate";
              break b;
          }
          ba = void 0;
        }
        else ie$1 ? ge(a2, c2) && (ba = "onCompositionEnd") : "keydown" === a2 && 229 === c2.keyCode && (ba = "onCompositionStart");
        ba && (de$1 && "ko" !== c2.locale && (ie$1 || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie$1 && ($a = nd()) : (kd = e3, ld = "value" in kd ? kd.value : kd.textContent, ie$1 = true)), xa = oe(d3, ba), 0 < xa.length && (ba = new Ld(ba, a2, null, c2, e3), g3.push({ event: ba, listeners: xa }), $a ? ba.data = $a : ($a = he$1(c2), null !== $a && (ba.data = $a))));
        if ($a = ce ? je(a2, c2) : ke(a2, c2)) d3 = oe(d3, "onBeforeInput"), 0 < d3.length && (e3 = new Ld("onBeforeInput", "beforeinput", null, c2, e3), g3.push({ event: e3, listeners: d3 }), e3.data = $a);
      }
      se$1(g3, b2);
    });
  }
  function tf(a2, b2, c2) {
    return { instance: a2, listener: b2, currentTarget: c2 };
  }
  function oe(a2, b2) {
    for (var c2 = b2 + "Capture", d2 = []; null !== a2; ) {
      var e2 = a2, f2 = e2.stateNode;
      5 === e2.tag && null !== f2 && (e2 = f2, f2 = Kb(a2, c2), null != f2 && d2.unshift(tf(a2, f2, e2)), f2 = Kb(a2, b2), null != f2 && d2.push(tf(a2, f2, e2)));
      a2 = a2.return;
    }
    return d2;
  }
  function vf(a2) {
    if (null === a2) return null;
    do
      a2 = a2.return;
    while (a2 && 5 !== a2.tag);
    return a2 ? a2 : null;
  }
  function wf(a2, b2, c2, d2, e2) {
    for (var f2 = b2._reactName, g2 = []; null !== c2 && c2 !== d2; ) {
      var h2 = c2, k2 = h2.alternate, l2 = h2.stateNode;
      if (null !== k2 && k2 === d2) break;
      5 === h2.tag && null !== l2 && (h2 = l2, e2 ? (k2 = Kb(c2, f2), null != k2 && g2.unshift(tf(c2, k2, h2))) : e2 || (k2 = Kb(c2, f2), null != k2 && g2.push(tf(c2, k2, h2))));
      c2 = c2.return;
    }
    0 !== g2.length && a2.push({ event: b2, listeners: g2 });
  }
  var xf = /\r\n?/g, yf = /\u0000|\uFFFD/g;
  function zf(a2) {
    return ("string" === typeof a2 ? a2 : "" + a2).replace(xf, "\n").replace(yf, "");
  }
  function Af(a2, b2, c2) {
    b2 = zf(b2);
    if (zf(a2) !== b2 && c2) throw Error(p$3(425));
  }
  function Bf() {
  }
  var Cf = null, Df = null;
  function Ef(a2, b2) {
    return "textarea" === a2 || "noscript" === a2 || "string" === typeof b2.children || "number" === typeof b2.children || "object" === typeof b2.dangerouslySetInnerHTML && null !== b2.dangerouslySetInnerHTML && null != b2.dangerouslySetInnerHTML.__html;
  }
  var Ff = "function" === typeof setTimeout ? setTimeout : void 0, Gf = "function" === typeof clearTimeout ? clearTimeout : void 0, Hf = "function" === typeof Promise ? Promise : void 0, Jf = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof Hf ? function(a2) {
    return Hf.resolve(null).then(a2).catch(If);
  } : Ff;
  function If(a2) {
    setTimeout(function() {
      throw a2;
    });
  }
  function Kf(a2, b2) {
    var c2 = b2, d2 = 0;
    do {
      var e2 = c2.nextSibling;
      a2.removeChild(c2);
      if (e2 && 8 === e2.nodeType) if (c2 = e2.data, "/$" === c2) {
        if (0 === d2) {
          a2.removeChild(e2);
          bd(b2);
          return;
        }
        d2--;
      } else "$" !== c2 && "$?" !== c2 && "$!" !== c2 || d2++;
      c2 = e2;
    } while (c2);
    bd(b2);
  }
  function Lf(a2) {
    for (; null != a2; a2 = a2.nextSibling) {
      var b2 = a2.nodeType;
      if (1 === b2 || 3 === b2) break;
      if (8 === b2) {
        b2 = a2.data;
        if ("$" === b2 || "$!" === b2 || "$?" === b2) break;
        if ("/$" === b2) return null;
      }
    }
    return a2;
  }
  function Mf(a2) {
    a2 = a2.previousSibling;
    for (var b2 = 0; a2; ) {
      if (8 === a2.nodeType) {
        var c2 = a2.data;
        if ("$" === c2 || "$!" === c2 || "$?" === c2) {
          if (0 === b2) return a2;
          b2--;
        } else "/$" === c2 && b2++;
      }
      a2 = a2.previousSibling;
    }
    return null;
  }
  var Nf = Math.random().toString(36).slice(2), Of = "__reactFiber$" + Nf, Pf = "__reactProps$" + Nf, uf = "__reactContainer$" + Nf, of = "__reactEvents$" + Nf, Qf = "__reactListeners$" + Nf, Rf = "__reactHandles$" + Nf;
  function Wc(a2) {
    var b2 = a2[Of];
    if (b2) return b2;
    for (var c2 = a2.parentNode; c2; ) {
      if (b2 = c2[uf] || c2[Of]) {
        c2 = b2.alternate;
        if (null !== b2.child || null !== c2 && null !== c2.child) for (a2 = Mf(a2); null !== a2; ) {
          if (c2 = a2[Of]) return c2;
          a2 = Mf(a2);
        }
        return b2;
      }
      a2 = c2;
      c2 = a2.parentNode;
    }
    return null;
  }
  function Cb(a2) {
    a2 = a2[Of] || a2[uf];
    return !a2 || 5 !== a2.tag && 6 !== a2.tag && 13 !== a2.tag && 3 !== a2.tag ? null : a2;
  }
  function ue(a2) {
    if (5 === a2.tag || 6 === a2.tag) return a2.stateNode;
    throw Error(p$3(33));
  }
  function Db(a2) {
    return a2[Pf] || null;
  }
  var Sf = [], Tf = -1;
  function Uf(a2) {
    return { current: a2 };
  }
  function E$2(a2) {
    0 > Tf || (a2.current = Sf[Tf], Sf[Tf] = null, Tf--);
  }
  function G$2(a2, b2) {
    Tf++;
    Sf[Tf] = a2.current;
    a2.current = b2;
  }
  var Vf = {}, H$2 = Uf(Vf), Wf = Uf(false), Xf = Vf;
  function Yf(a2, b2) {
    var c2 = a2.type.contextTypes;
    if (!c2) return Vf;
    var d2 = a2.stateNode;
    if (d2 && d2.__reactInternalMemoizedUnmaskedChildContext === b2) return d2.__reactInternalMemoizedMaskedChildContext;
    var e2 = {}, f2;
    for (f2 in c2) e2[f2] = b2[f2];
    d2 && (a2 = a2.stateNode, a2.__reactInternalMemoizedUnmaskedChildContext = b2, a2.__reactInternalMemoizedMaskedChildContext = e2);
    return e2;
  }
  function Zf(a2) {
    a2 = a2.childContextTypes;
    return null !== a2 && void 0 !== a2;
  }
  function $f() {
    E$2(Wf);
    E$2(H$2);
  }
  function ag(a2, b2, c2) {
    if (H$2.current !== Vf) throw Error(p$3(168));
    G$2(H$2, b2);
    G$2(Wf, c2);
  }
  function bg(a2, b2, c2) {
    var d2 = a2.stateNode;
    b2 = b2.childContextTypes;
    if ("function" !== typeof d2.getChildContext) return c2;
    d2 = d2.getChildContext();
    for (var e2 in d2) if (!(e2 in b2)) throw Error(p$3(108, Ra(a2) || "Unknown", e2));
    return A$2({}, c2, d2);
  }
  function cg(a2) {
    a2 = (a2 = a2.stateNode) && a2.__reactInternalMemoizedMergedChildContext || Vf;
    Xf = H$2.current;
    G$2(H$2, a2);
    G$2(Wf, Wf.current);
    return true;
  }
  function dg(a2, b2, c2) {
    var d2 = a2.stateNode;
    if (!d2) throw Error(p$3(169));
    c2 ? (a2 = bg(a2, b2, Xf), d2.__reactInternalMemoizedMergedChildContext = a2, E$2(Wf), E$2(H$2), G$2(H$2, a2)) : E$2(Wf);
    G$2(Wf, c2);
  }
  var eg = null, fg = false, gg = false;
  function hg(a2) {
    null === eg ? eg = [a2] : eg.push(a2);
  }
  function ig(a2) {
    fg = true;
    hg(a2);
  }
  function jg() {
    if (!gg && null !== eg) {
      gg = true;
      var a2 = 0, b2 = C$2;
      try {
        var c2 = eg;
        for (C$2 = 1; a2 < c2.length; a2++) {
          var d2 = c2[a2];
          do
            d2 = d2(true);
          while (null !== d2);
        }
        eg = null;
        fg = false;
      } catch (e2) {
        throw null !== eg && (eg = eg.slice(a2 + 1)), ac(fc, jg), e2;
      } finally {
        C$2 = b2, gg = false;
      }
    }
    return null;
  }
  var kg = [], lg = 0, mg = null, ng = 0, og = [], pg = 0, qg = null, rg = 1, sg = "";
  function tg(a2, b2) {
    kg[lg++] = ng;
    kg[lg++] = mg;
    mg = a2;
    ng = b2;
  }
  function ug(a2, b2, c2) {
    og[pg++] = rg;
    og[pg++] = sg;
    og[pg++] = qg;
    qg = a2;
    var d2 = rg;
    a2 = sg;
    var e2 = 32 - oc(d2) - 1;
    d2 &= ~(1 << e2);
    c2 += 1;
    var f2 = 32 - oc(b2) + e2;
    if (30 < f2) {
      var g2 = e2 - e2 % 5;
      f2 = (d2 & (1 << g2) - 1).toString(32);
      d2 >>= g2;
      e2 -= g2;
      rg = 1 << 32 - oc(b2) + e2 | c2 << e2 | d2;
      sg = f2 + a2;
    } else rg = 1 << f2 | c2 << e2 | d2, sg = a2;
  }
  function vg(a2) {
    null !== a2.return && (tg(a2, 1), ug(a2, 1, 0));
  }
  function wg(a2) {
    for (; a2 === mg; ) mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
    for (; a2 === qg; ) qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
  }
  var xg = null, yg = null, I$2 = false, zg = null;
  function Ag(a2, b2) {
    var c2 = Bg(5, null, null, 0);
    c2.elementType = "DELETED";
    c2.stateNode = b2;
    c2.return = a2;
    b2 = a2.deletions;
    null === b2 ? (a2.deletions = [c2], a2.flags |= 16) : b2.push(c2);
  }
  function Cg(a2, b2) {
    switch (a2.tag) {
      case 5:
        var c2 = a2.type;
        b2 = 1 !== b2.nodeType || c2.toLowerCase() !== b2.nodeName.toLowerCase() ? null : b2;
        return null !== b2 ? (a2.stateNode = b2, xg = a2, yg = Lf(b2.firstChild), true) : false;
      case 6:
        return b2 = "" === a2.pendingProps || 3 !== b2.nodeType ? null : b2, null !== b2 ? (a2.stateNode = b2, xg = a2, yg = null, true) : false;
      case 13:
        return b2 = 8 !== b2.nodeType ? null : b2, null !== b2 ? (c2 = null !== qg ? { id: rg, overflow: sg } : null, a2.memoizedState = { dehydrated: b2, treeContext: c2, retryLane: 1073741824 }, c2 = Bg(18, null, null, 0), c2.stateNode = b2, c2.return = a2, a2.child = c2, xg = a2, yg = null, true) : false;
      default:
        return false;
    }
  }
  function Dg(a2) {
    return 0 !== (a2.mode & 1) && 0 === (a2.flags & 128);
  }
  function Eg(a2) {
    if (I$2) {
      var b2 = yg;
      if (b2) {
        var c2 = b2;
        if (!Cg(a2, b2)) {
          if (Dg(a2)) throw Error(p$3(418));
          b2 = Lf(c2.nextSibling);
          var d2 = xg;
          b2 && Cg(a2, b2) ? Ag(d2, c2) : (a2.flags = a2.flags & -4097 | 2, I$2 = false, xg = a2);
        }
      } else {
        if (Dg(a2)) throw Error(p$3(418));
        a2.flags = a2.flags & -4097 | 2;
        I$2 = false;
        xg = a2;
      }
    }
  }
  function Fg(a2) {
    for (a2 = a2.return; null !== a2 && 5 !== a2.tag && 3 !== a2.tag && 13 !== a2.tag; ) a2 = a2.return;
    xg = a2;
  }
  function Gg(a2) {
    if (a2 !== xg) return false;
    if (!I$2) return Fg(a2), I$2 = true, false;
    var b2;
    (b2 = 3 !== a2.tag) && !(b2 = 5 !== a2.tag) && (b2 = a2.type, b2 = "head" !== b2 && "body" !== b2 && !Ef(a2.type, a2.memoizedProps));
    if (b2 && (b2 = yg)) {
      if (Dg(a2)) throw Hg(), Error(p$3(418));
      for (; b2; ) Ag(a2, b2), b2 = Lf(b2.nextSibling);
    }
    Fg(a2);
    if (13 === a2.tag) {
      a2 = a2.memoizedState;
      a2 = null !== a2 ? a2.dehydrated : null;
      if (!a2) throw Error(p$3(317));
      a: {
        a2 = a2.nextSibling;
        for (b2 = 0; a2; ) {
          if (8 === a2.nodeType) {
            var c2 = a2.data;
            if ("/$" === c2) {
              if (0 === b2) {
                yg = Lf(a2.nextSibling);
                break a;
              }
              b2--;
            } else "$" !== c2 && "$!" !== c2 && "$?" !== c2 || b2++;
          }
          a2 = a2.nextSibling;
        }
        yg = null;
      }
    } else yg = xg ? Lf(a2.stateNode.nextSibling) : null;
    return true;
  }
  function Hg() {
    for (var a2 = yg; a2; ) a2 = Lf(a2.nextSibling);
  }
  function Ig() {
    yg = xg = null;
    I$2 = false;
  }
  function Jg(a2) {
    null === zg ? zg = [a2] : zg.push(a2);
  }
  var Kg = ua.ReactCurrentBatchConfig;
  function Lg(a2, b2, c2) {
    a2 = c2.ref;
    if (null !== a2 && "function" !== typeof a2 && "object" !== typeof a2) {
      if (c2._owner) {
        c2 = c2._owner;
        if (c2) {
          if (1 !== c2.tag) throw Error(p$3(309));
          var d2 = c2.stateNode;
        }
        if (!d2) throw Error(p$3(147, a2));
        var e2 = d2, f2 = "" + a2;
        if (null !== b2 && null !== b2.ref && "function" === typeof b2.ref && b2.ref._stringRef === f2) return b2.ref;
        b2 = function(a3) {
          var b3 = e2.refs;
          null === a3 ? delete b3[f2] : b3[f2] = a3;
        };
        b2._stringRef = f2;
        return b2;
      }
      if ("string" !== typeof a2) throw Error(p$3(284));
      if (!c2._owner) throw Error(p$3(290, a2));
    }
    return a2;
  }
  function Mg(a2, b2) {
    a2 = Object.prototype.toString.call(b2);
    throw Error(p$3(31, "[object Object]" === a2 ? "object with keys {" + Object.keys(b2).join(", ") + "}" : a2));
  }
  function Ng(a2) {
    var b2 = a2._init;
    return b2(a2._payload);
  }
  function Og(a2) {
    function b2(b3, c3) {
      if (a2) {
        var d3 = b3.deletions;
        null === d3 ? (b3.deletions = [c3], b3.flags |= 16) : d3.push(c3);
      }
    }
    function c2(c3, d3) {
      if (!a2) return null;
      for (; null !== d3; ) b2(c3, d3), d3 = d3.sibling;
      return null;
    }
    function d2(a3, b3) {
      for (a3 = /* @__PURE__ */ new Map(); null !== b3; ) null !== b3.key ? a3.set(b3.key, b3) : a3.set(b3.index, b3), b3 = b3.sibling;
      return a3;
    }
    function e2(a3, b3) {
      a3 = Pg(a3, b3);
      a3.index = 0;
      a3.sibling = null;
      return a3;
    }
    function f2(b3, c3, d3) {
      b3.index = d3;
      if (!a2) return b3.flags |= 1048576, c3;
      d3 = b3.alternate;
      if (null !== d3) return d3 = d3.index, d3 < c3 ? (b3.flags |= 2, c3) : d3;
      b3.flags |= 2;
      return c3;
    }
    function g2(b3) {
      a2 && null === b3.alternate && (b3.flags |= 2);
      return b3;
    }
    function h2(a3, b3, c3, d3) {
      if (null === b3 || 6 !== b3.tag) return b3 = Qg(c3, a3.mode, d3), b3.return = a3, b3;
      b3 = e2(b3, c3);
      b3.return = a3;
      return b3;
    }
    function k2(a3, b3, c3, d3) {
      var f3 = c3.type;
      if (f3 === ya) return m2(a3, b3, c3.props.children, d3, c3.key);
      if (null !== b3 && (b3.elementType === f3 || "object" === typeof f3 && null !== f3 && f3.$$typeof === Ha && Ng(f3) === b3.type)) return d3 = e2(b3, c3.props), d3.ref = Lg(a3, b3, c3), d3.return = a3, d3;
      d3 = Rg(c3.type, c3.key, c3.props, null, a3.mode, d3);
      d3.ref = Lg(a3, b3, c3);
      d3.return = a3;
      return d3;
    }
    function l2(a3, b3, c3, d3) {
      if (null === b3 || 4 !== b3.tag || b3.stateNode.containerInfo !== c3.containerInfo || b3.stateNode.implementation !== c3.implementation) return b3 = Sg(c3, a3.mode, d3), b3.return = a3, b3;
      b3 = e2(b3, c3.children || []);
      b3.return = a3;
      return b3;
    }
    function m2(a3, b3, c3, d3, f3) {
      if (null === b3 || 7 !== b3.tag) return b3 = Tg(c3, a3.mode, d3, f3), b3.return = a3, b3;
      b3 = e2(b3, c3);
      b3.return = a3;
      return b3;
    }
    function q2(a3, b3, c3) {
      if ("string" === typeof b3 && "" !== b3 || "number" === typeof b3) return b3 = Qg("" + b3, a3.mode, c3), b3.return = a3, b3;
      if ("object" === typeof b3 && null !== b3) {
        switch (b3.$$typeof) {
          case va:
            return c3 = Rg(b3.type, b3.key, b3.props, null, a3.mode, c3), c3.ref = Lg(a3, null, b3), c3.return = a3, c3;
          case wa:
            return b3 = Sg(b3, a3.mode, c3), b3.return = a3, b3;
          case Ha:
            var d3 = b3._init;
            return q2(a3, d3(b3._payload), c3);
        }
        if (eb(b3) || Ka(b3)) return b3 = Tg(b3, a3.mode, c3, null), b3.return = a3, b3;
        Mg(a3, b3);
      }
      return null;
    }
    function r2(a3, b3, c3, d3) {
      var e3 = null !== b3 ? b3.key : null;
      if ("string" === typeof c3 && "" !== c3 || "number" === typeof c3) return null !== e3 ? null : h2(a3, b3, "" + c3, d3);
      if ("object" === typeof c3 && null !== c3) {
        switch (c3.$$typeof) {
          case va:
            return c3.key === e3 ? k2(a3, b3, c3, d3) : null;
          case wa:
            return c3.key === e3 ? l2(a3, b3, c3, d3) : null;
          case Ha:
            return e3 = c3._init, r2(
              a3,
              b3,
              e3(c3._payload),
              d3
            );
        }
        if (eb(c3) || Ka(c3)) return null !== e3 ? null : m2(a3, b3, c3, d3, null);
        Mg(a3, c3);
      }
      return null;
    }
    function y2(a3, b3, c3, d3, e3) {
      if ("string" === typeof d3 && "" !== d3 || "number" === typeof d3) return a3 = a3.get(c3) || null, h2(b3, a3, "" + d3, e3);
      if ("object" === typeof d3 && null !== d3) {
        switch (d3.$$typeof) {
          case va:
            return a3 = a3.get(null === d3.key ? c3 : d3.key) || null, k2(b3, a3, d3, e3);
          case wa:
            return a3 = a3.get(null === d3.key ? c3 : d3.key) || null, l2(b3, a3, d3, e3);
          case Ha:
            var f3 = d3._init;
            return y2(a3, b3, c3, f3(d3._payload), e3);
        }
        if (eb(d3) || Ka(d3)) return a3 = a3.get(c3) || null, m2(b3, a3, d3, e3, null);
        Mg(b3, d3);
      }
      return null;
    }
    function n2(e3, g3, h3, k3) {
      for (var l3 = null, m3 = null, u2 = g3, w2 = g3 = 0, x2 = null; null !== u2 && w2 < h3.length; w2++) {
        u2.index > w2 ? (x2 = u2, u2 = null) : x2 = u2.sibling;
        var n3 = r2(e3, u2, h3[w2], k3);
        if (null === n3) {
          null === u2 && (u2 = x2);
          break;
        }
        a2 && u2 && null === n3.alternate && b2(e3, u2);
        g3 = f2(n3, g3, w2);
        null === m3 ? l3 = n3 : m3.sibling = n3;
        m3 = n3;
        u2 = x2;
      }
      if (w2 === h3.length) return c2(e3, u2), I$2 && tg(e3, w2), l3;
      if (null === u2) {
        for (; w2 < h3.length; w2++) u2 = q2(e3, h3[w2], k3), null !== u2 && (g3 = f2(u2, g3, w2), null === m3 ? l3 = u2 : m3.sibling = u2, m3 = u2);
        I$2 && tg(e3, w2);
        return l3;
      }
      for (u2 = d2(e3, u2); w2 < h3.length; w2++) x2 = y2(u2, e3, w2, h3[w2], k3), null !== x2 && (a2 && null !== x2.alternate && u2.delete(null === x2.key ? w2 : x2.key), g3 = f2(x2, g3, w2), null === m3 ? l3 = x2 : m3.sibling = x2, m3 = x2);
      a2 && u2.forEach(function(a3) {
        return b2(e3, a3);
      });
      I$2 && tg(e3, w2);
      return l3;
    }
    function t2(e3, g3, h3, k3) {
      var l3 = Ka(h3);
      if ("function" !== typeof l3) throw Error(p$3(150));
      h3 = l3.call(h3);
      if (null == h3) throw Error(p$3(151));
      for (var u2 = l3 = null, m3 = g3, w2 = g3 = 0, x2 = null, n3 = h3.next(); null !== m3 && !n3.done; w2++, n3 = h3.next()) {
        m3.index > w2 ? (x2 = m3, m3 = null) : x2 = m3.sibling;
        var t3 = r2(e3, m3, n3.value, k3);
        if (null === t3) {
          null === m3 && (m3 = x2);
          break;
        }
        a2 && m3 && null === t3.alternate && b2(e3, m3);
        g3 = f2(t3, g3, w2);
        null === u2 ? l3 = t3 : u2.sibling = t3;
        u2 = t3;
        m3 = x2;
      }
      if (n3.done) return c2(
        e3,
        m3
      ), I$2 && tg(e3, w2), l3;
      if (null === m3) {
        for (; !n3.done; w2++, n3 = h3.next()) n3 = q2(e3, n3.value, k3), null !== n3 && (g3 = f2(n3, g3, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
        I$2 && tg(e3, w2);
        return l3;
      }
      for (m3 = d2(e3, m3); !n3.done; w2++, n3 = h3.next()) n3 = y2(m3, e3, w2, n3.value, k3), null !== n3 && (a2 && null !== n3.alternate && m3.delete(null === n3.key ? w2 : n3.key), g3 = f2(n3, g3, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
      a2 && m3.forEach(function(a3) {
        return b2(e3, a3);
      });
      I$2 && tg(e3, w2);
      return l3;
    }
    function J2(a3, d3, f3, h3) {
      "object" === typeof f3 && null !== f3 && f3.type === ya && null === f3.key && (f3 = f3.props.children);
      if ("object" === typeof f3 && null !== f3) {
        switch (f3.$$typeof) {
          case va:
            a: {
              for (var k3 = f3.key, l3 = d3; null !== l3; ) {
                if (l3.key === k3) {
                  k3 = f3.type;
                  if (k3 === ya) {
                    if (7 === l3.tag) {
                      c2(a3, l3.sibling);
                      d3 = e2(l3, f3.props.children);
                      d3.return = a3;
                      a3 = d3;
                      break a;
                    }
                  } else if (l3.elementType === k3 || "object" === typeof k3 && null !== k3 && k3.$$typeof === Ha && Ng(k3) === l3.type) {
                    c2(a3, l3.sibling);
                    d3 = e2(l3, f3.props);
                    d3.ref = Lg(a3, l3, f3);
                    d3.return = a3;
                    a3 = d3;
                    break a;
                  }
                  c2(a3, l3);
                  break;
                } else b2(a3, l3);
                l3 = l3.sibling;
              }
              f3.type === ya ? (d3 = Tg(f3.props.children, a3.mode, h3, f3.key), d3.return = a3, a3 = d3) : (h3 = Rg(f3.type, f3.key, f3.props, null, a3.mode, h3), h3.ref = Lg(a3, d3, f3), h3.return = a3, a3 = h3);
            }
            return g2(a3);
          case wa:
            a: {
              for (l3 = f3.key; null !== d3; ) {
                if (d3.key === l3) if (4 === d3.tag && d3.stateNode.containerInfo === f3.containerInfo && d3.stateNode.implementation === f3.implementation) {
                  c2(a3, d3.sibling);
                  d3 = e2(d3, f3.children || []);
                  d3.return = a3;
                  a3 = d3;
                  break a;
                } else {
                  c2(a3, d3);
                  break;
                }
                else b2(a3, d3);
                d3 = d3.sibling;
              }
              d3 = Sg(f3, a3.mode, h3);
              d3.return = a3;
              a3 = d3;
            }
            return g2(a3);
          case Ha:
            return l3 = f3._init, J2(a3, d3, l3(f3._payload), h3);
        }
        if (eb(f3)) return n2(a3, d3, f3, h3);
        if (Ka(f3)) return t2(a3, d3, f3, h3);
        Mg(a3, f3);
      }
      return "string" === typeof f3 && "" !== f3 || "number" === typeof f3 ? (f3 = "" + f3, null !== d3 && 6 === d3.tag ? (c2(a3, d3.sibling), d3 = e2(d3, f3), d3.return = a3, a3 = d3) : (c2(a3, d3), d3 = Qg(f3, a3.mode, h3), d3.return = a3, a3 = d3), g2(a3)) : c2(a3, d3);
    }
    return J2;
  }
  var Ug = Og(true), Vg = Og(false), Wg = Uf(null), Xg = null, Yg = null, Zg = null;
  function $g() {
    Zg = Yg = Xg = null;
  }
  function ah(a2) {
    var b2 = Wg.current;
    E$2(Wg);
    a2._currentValue = b2;
  }
  function bh(a2, b2, c2) {
    for (; null !== a2; ) {
      var d2 = a2.alternate;
      (a2.childLanes & b2) !== b2 ? (a2.childLanes |= b2, null !== d2 && (d2.childLanes |= b2)) : null !== d2 && (d2.childLanes & b2) !== b2 && (d2.childLanes |= b2);
      if (a2 === c2) break;
      a2 = a2.return;
    }
  }
  function ch(a2, b2) {
    Xg = a2;
    Zg = Yg = null;
    a2 = a2.dependencies;
    null !== a2 && null !== a2.firstContext && (0 !== (a2.lanes & b2) && (dh = true), a2.firstContext = null);
  }
  function eh(a2) {
    var b2 = a2._currentValue;
    if (Zg !== a2) if (a2 = { context: a2, memoizedValue: b2, next: null }, null === Yg) {
      if (null === Xg) throw Error(p$3(308));
      Yg = a2;
      Xg.dependencies = { lanes: 0, firstContext: a2 };
    } else Yg = Yg.next = a2;
    return b2;
  }
  var fh = null;
  function gh(a2) {
    null === fh ? fh = [a2] : fh.push(a2);
  }
  function hh(a2, b2, c2, d2) {
    var e2 = b2.interleaved;
    null === e2 ? (c2.next = c2, gh(b2)) : (c2.next = e2.next, e2.next = c2);
    b2.interleaved = c2;
    return ih(a2, d2);
  }
  function ih(a2, b2) {
    a2.lanes |= b2;
    var c2 = a2.alternate;
    null !== c2 && (c2.lanes |= b2);
    c2 = a2;
    for (a2 = a2.return; null !== a2; ) a2.childLanes |= b2, c2 = a2.alternate, null !== c2 && (c2.childLanes |= b2), c2 = a2, a2 = a2.return;
    return 3 === c2.tag ? c2.stateNode : null;
  }
  var jh = false;
  function kh(a2) {
    a2.updateQueue = { baseState: a2.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function lh(a2, b2) {
    a2 = a2.updateQueue;
    b2.updateQueue === a2 && (b2.updateQueue = { baseState: a2.baseState, firstBaseUpdate: a2.firstBaseUpdate, lastBaseUpdate: a2.lastBaseUpdate, shared: a2.shared, effects: a2.effects });
  }
  function mh(a2, b2) {
    return { eventTime: a2, lane: b2, tag: 0, payload: null, callback: null, next: null };
  }
  function nh(a2, b2, c2) {
    var d2 = a2.updateQueue;
    if (null === d2) return null;
    d2 = d2.shared;
    if (0 !== (K$2 & 2)) {
      var e2 = d2.pending;
      null === e2 ? b2.next = b2 : (b2.next = e2.next, e2.next = b2);
      d2.pending = b2;
      return ih(a2, c2);
    }
    e2 = d2.interleaved;
    null === e2 ? (b2.next = b2, gh(d2)) : (b2.next = e2.next, e2.next = b2);
    d2.interleaved = b2;
    return ih(a2, c2);
  }
  function oh(a2, b2, c2) {
    b2 = b2.updateQueue;
    if (null !== b2 && (b2 = b2.shared, 0 !== (c2 & 4194240))) {
      var d2 = b2.lanes;
      d2 &= a2.pendingLanes;
      c2 |= d2;
      b2.lanes = c2;
      Cc(a2, c2);
    }
  }
  function ph(a2, b2) {
    var c2 = a2.updateQueue, d2 = a2.alternate;
    if (null !== d2 && (d2 = d2.updateQueue, c2 === d2)) {
      var e2 = null, f2 = null;
      c2 = c2.firstBaseUpdate;
      if (null !== c2) {
        do {
          var g2 = { eventTime: c2.eventTime, lane: c2.lane, tag: c2.tag, payload: c2.payload, callback: c2.callback, next: null };
          null === f2 ? e2 = f2 = g2 : f2 = f2.next = g2;
          c2 = c2.next;
        } while (null !== c2);
        null === f2 ? e2 = f2 = b2 : f2 = f2.next = b2;
      } else e2 = f2 = b2;
      c2 = { baseState: d2.baseState, firstBaseUpdate: e2, lastBaseUpdate: f2, shared: d2.shared, effects: d2.effects };
      a2.updateQueue = c2;
      return;
    }
    a2 = c2.lastBaseUpdate;
    null === a2 ? c2.firstBaseUpdate = b2 : a2.next = b2;
    c2.lastBaseUpdate = b2;
  }
  function qh(a2, b2, c2, d2) {
    var e2 = a2.updateQueue;
    jh = false;
    var f2 = e2.firstBaseUpdate, g2 = e2.lastBaseUpdate, h2 = e2.shared.pending;
    if (null !== h2) {
      e2.shared.pending = null;
      var k2 = h2, l2 = k2.next;
      k2.next = null;
      null === g2 ? f2 = l2 : g2.next = l2;
      g2 = k2;
      var m2 = a2.alternate;
      null !== m2 && (m2 = m2.updateQueue, h2 = m2.lastBaseUpdate, h2 !== g2 && (null === h2 ? m2.firstBaseUpdate = l2 : h2.next = l2, m2.lastBaseUpdate = k2));
    }
    if (null !== f2) {
      var q2 = e2.baseState;
      g2 = 0;
      m2 = l2 = k2 = null;
      h2 = f2;
      do {
        var r2 = h2.lane, y2 = h2.eventTime;
        if ((d2 & r2) === r2) {
          null !== m2 && (m2 = m2.next = {
            eventTime: y2,
            lane: 0,
            tag: h2.tag,
            payload: h2.payload,
            callback: h2.callback,
            next: null
          });
          a: {
            var n2 = a2, t2 = h2;
            r2 = b2;
            y2 = c2;
            switch (t2.tag) {
              case 1:
                n2 = t2.payload;
                if ("function" === typeof n2) {
                  q2 = n2.call(y2, q2, r2);
                  break a;
                }
                q2 = n2;
                break a;
              case 3:
                n2.flags = n2.flags & -65537 | 128;
              case 0:
                n2 = t2.payload;
                r2 = "function" === typeof n2 ? n2.call(y2, q2, r2) : n2;
                if (null === r2 || void 0 === r2) break a;
                q2 = A$2({}, q2, r2);
                break a;
              case 2:
                jh = true;
            }
          }
          null !== h2.callback && 0 !== h2.lane && (a2.flags |= 64, r2 = e2.effects, null === r2 ? e2.effects = [h2] : r2.push(h2));
        } else y2 = { eventTime: y2, lane: r2, tag: h2.tag, payload: h2.payload, callback: h2.callback, next: null }, null === m2 ? (l2 = m2 = y2, k2 = q2) : m2 = m2.next = y2, g2 |= r2;
        h2 = h2.next;
        if (null === h2) if (h2 = e2.shared.pending, null === h2) break;
        else r2 = h2, h2 = r2.next, r2.next = null, e2.lastBaseUpdate = r2, e2.shared.pending = null;
      } while (1);
      null === m2 && (k2 = q2);
      e2.baseState = k2;
      e2.firstBaseUpdate = l2;
      e2.lastBaseUpdate = m2;
      b2 = e2.shared.interleaved;
      if (null !== b2) {
        e2 = b2;
        do
          g2 |= e2.lane, e2 = e2.next;
        while (e2 !== b2);
      } else null === f2 && (e2.shared.lanes = 0);
      rh |= g2;
      a2.lanes = g2;
      a2.memoizedState = q2;
    }
  }
  function sh(a2, b2, c2) {
    a2 = b2.effects;
    b2.effects = null;
    if (null !== a2) for (b2 = 0; b2 < a2.length; b2++) {
      var d2 = a2[b2], e2 = d2.callback;
      if (null !== e2) {
        d2.callback = null;
        d2 = c2;
        if ("function" !== typeof e2) throw Error(p$3(191, e2));
        e2.call(d2);
      }
    }
  }
  var th = {}, uh = Uf(th), vh = Uf(th), wh = Uf(th);
  function xh(a2) {
    if (a2 === th) throw Error(p$3(174));
    return a2;
  }
  function yh(a2, b2) {
    G$2(wh, b2);
    G$2(vh, a2);
    G$2(uh, th);
    a2 = b2.nodeType;
    switch (a2) {
      case 9:
      case 11:
        b2 = (b2 = b2.documentElement) ? b2.namespaceURI : lb(null, "");
        break;
      default:
        a2 = 8 === a2 ? b2.parentNode : b2, b2 = a2.namespaceURI || null, a2 = a2.tagName, b2 = lb(b2, a2);
    }
    E$2(uh);
    G$2(uh, b2);
  }
  function zh() {
    E$2(uh);
    E$2(vh);
    E$2(wh);
  }
  function Ah(a2) {
    xh(wh.current);
    var b2 = xh(uh.current);
    var c2 = lb(b2, a2.type);
    b2 !== c2 && (G$2(vh, a2), G$2(uh, c2));
  }
  function Bh(a2) {
    vh.current === a2 && (E$2(uh), E$2(vh));
  }
  var L$2 = Uf(0);
  function Ch(a2) {
    for (var b2 = a2; null !== b2; ) {
      if (13 === b2.tag) {
        var c2 = b2.memoizedState;
        if (null !== c2 && (c2 = c2.dehydrated, null === c2 || "$?" === c2.data || "$!" === c2.data)) return b2;
      } else if (19 === b2.tag && void 0 !== b2.memoizedProps.revealOrder) {
        if (0 !== (b2.flags & 128)) return b2;
      } else if (null !== b2.child) {
        b2.child.return = b2;
        b2 = b2.child;
        continue;
      }
      if (b2 === a2) break;
      for (; null === b2.sibling; ) {
        if (null === b2.return || b2.return === a2) return null;
        b2 = b2.return;
      }
      b2.sibling.return = b2.return;
      b2 = b2.sibling;
    }
    return null;
  }
  var Dh = [];
  function Eh() {
    for (var a2 = 0; a2 < Dh.length; a2++) Dh[a2]._workInProgressVersionPrimary = null;
    Dh.length = 0;
  }
  var Fh = ua.ReactCurrentDispatcher, Gh = ua.ReactCurrentBatchConfig, Hh = 0, M$2 = null, N$2 = null, O$1 = null, Ih = false, Jh = false, Kh = 0, Lh = 0;
  function P$2() {
    throw Error(p$3(321));
  }
  function Mh(a2, b2) {
    if (null === b2) return false;
    for (var c2 = 0; c2 < b2.length && c2 < a2.length; c2++) if (!He$1(a2[c2], b2[c2])) return false;
    return true;
  }
  function Nh(a2, b2, c2, d2, e2, f2) {
    Hh = f2;
    M$2 = b2;
    b2.memoizedState = null;
    b2.updateQueue = null;
    b2.lanes = 0;
    Fh.current = null === a2 || null === a2.memoizedState ? Oh : Ph;
    a2 = c2(d2, e2);
    if (Jh) {
      f2 = 0;
      do {
        Jh = false;
        Kh = 0;
        if (25 <= f2) throw Error(p$3(301));
        f2 += 1;
        O$1 = N$2 = null;
        b2.updateQueue = null;
        Fh.current = Qh;
        a2 = c2(d2, e2);
      } while (Jh);
    }
    Fh.current = Rh;
    b2 = null !== N$2 && null !== N$2.next;
    Hh = 0;
    O$1 = N$2 = M$2 = null;
    Ih = false;
    if (b2) throw Error(p$3(300));
    return a2;
  }
  function Sh() {
    var a2 = 0 !== Kh;
    Kh = 0;
    return a2;
  }
  function Th() {
    var a2 = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    null === O$1 ? M$2.memoizedState = O$1 = a2 : O$1 = O$1.next = a2;
    return O$1;
  }
  function Uh() {
    if (null === N$2) {
      var a2 = M$2.alternate;
      a2 = null !== a2 ? a2.memoizedState : null;
    } else a2 = N$2.next;
    var b2 = null === O$1 ? M$2.memoizedState : O$1.next;
    if (null !== b2) O$1 = b2, N$2 = a2;
    else {
      if (null === a2) throw Error(p$3(310));
      N$2 = a2;
      a2 = { memoizedState: N$2.memoizedState, baseState: N$2.baseState, baseQueue: N$2.baseQueue, queue: N$2.queue, next: null };
      null === O$1 ? M$2.memoizedState = O$1 = a2 : O$1 = O$1.next = a2;
    }
    return O$1;
  }
  function Vh(a2, b2) {
    return "function" === typeof b2 ? b2(a2) : b2;
  }
  function Wh(a2) {
    var b2 = Uh(), c2 = b2.queue;
    if (null === c2) throw Error(p$3(311));
    c2.lastRenderedReducer = a2;
    var d2 = N$2, e2 = d2.baseQueue, f2 = c2.pending;
    if (null !== f2) {
      if (null !== e2) {
        var g2 = e2.next;
        e2.next = f2.next;
        f2.next = g2;
      }
      d2.baseQueue = e2 = f2;
      c2.pending = null;
    }
    if (null !== e2) {
      f2 = e2.next;
      d2 = d2.baseState;
      var h2 = g2 = null, k2 = null, l2 = f2;
      do {
        var m2 = l2.lane;
        if ((Hh & m2) === m2) null !== k2 && (k2 = k2.next = { lane: 0, action: l2.action, hasEagerState: l2.hasEagerState, eagerState: l2.eagerState, next: null }), d2 = l2.hasEagerState ? l2.eagerState : a2(d2, l2.action);
        else {
          var q2 = {
            lane: m2,
            action: l2.action,
            hasEagerState: l2.hasEagerState,
            eagerState: l2.eagerState,
            next: null
          };
          null === k2 ? (h2 = k2 = q2, g2 = d2) : k2 = k2.next = q2;
          M$2.lanes |= m2;
          rh |= m2;
        }
        l2 = l2.next;
      } while (null !== l2 && l2 !== f2);
      null === k2 ? g2 = d2 : k2.next = h2;
      He$1(d2, b2.memoizedState) || (dh = true);
      b2.memoizedState = d2;
      b2.baseState = g2;
      b2.baseQueue = k2;
      c2.lastRenderedState = d2;
    }
    a2 = c2.interleaved;
    if (null !== a2) {
      e2 = a2;
      do
        f2 = e2.lane, M$2.lanes |= f2, rh |= f2, e2 = e2.next;
      while (e2 !== a2);
    } else null === e2 && (c2.lanes = 0);
    return [b2.memoizedState, c2.dispatch];
  }
  function Xh(a2) {
    var b2 = Uh(), c2 = b2.queue;
    if (null === c2) throw Error(p$3(311));
    c2.lastRenderedReducer = a2;
    var d2 = c2.dispatch, e2 = c2.pending, f2 = b2.memoizedState;
    if (null !== e2) {
      c2.pending = null;
      var g2 = e2 = e2.next;
      do
        f2 = a2(f2, g2.action), g2 = g2.next;
      while (g2 !== e2);
      He$1(f2, b2.memoizedState) || (dh = true);
      b2.memoizedState = f2;
      null === b2.baseQueue && (b2.baseState = f2);
      c2.lastRenderedState = f2;
    }
    return [f2, d2];
  }
  function Yh() {
  }
  function Zh(a2, b2) {
    var c2 = M$2, d2 = Uh(), e2 = b2(), f2 = !He$1(d2.memoizedState, e2);
    f2 && (d2.memoizedState = e2, dh = true);
    d2 = d2.queue;
    $h(ai.bind(null, c2, d2, a2), [a2]);
    if (d2.getSnapshot !== b2 || f2 || null !== O$1 && O$1.memoizedState.tag & 1) {
      c2.flags |= 2048;
      bi(9, ci.bind(null, c2, d2, e2, b2), void 0, null);
      if (null === Q$1) throw Error(p$3(349));
      0 !== (Hh & 30) || di(c2, b2, e2);
    }
    return e2;
  }
  function di(a2, b2, c2) {
    a2.flags |= 16384;
    a2 = { getSnapshot: b2, value: c2 };
    b2 = M$2.updateQueue;
    null === b2 ? (b2 = { lastEffect: null, stores: null }, M$2.updateQueue = b2, b2.stores = [a2]) : (c2 = b2.stores, null === c2 ? b2.stores = [a2] : c2.push(a2));
  }
  function ci(a2, b2, c2, d2) {
    b2.value = c2;
    b2.getSnapshot = d2;
    ei(b2) && fi(a2);
  }
  function ai(a2, b2, c2) {
    return c2(function() {
      ei(b2) && fi(a2);
    });
  }
  function ei(a2) {
    var b2 = a2.getSnapshot;
    a2 = a2.value;
    try {
      var c2 = b2();
      return !He$1(a2, c2);
    } catch (d2) {
      return true;
    }
  }
  function fi(a2) {
    var b2 = ih(a2, 1);
    null !== b2 && gi(b2, a2, 1, -1);
  }
  function hi(a2) {
    var b2 = Th();
    "function" === typeof a2 && (a2 = a2());
    b2.memoizedState = b2.baseState = a2;
    a2 = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Vh, lastRenderedState: a2 };
    b2.queue = a2;
    a2 = a2.dispatch = ii.bind(null, M$2, a2);
    return [b2.memoizedState, a2];
  }
  function bi(a2, b2, c2, d2) {
    a2 = { tag: a2, create: b2, destroy: c2, deps: d2, next: null };
    b2 = M$2.updateQueue;
    null === b2 ? (b2 = { lastEffect: null, stores: null }, M$2.updateQueue = b2, b2.lastEffect = a2.next = a2) : (c2 = b2.lastEffect, null === c2 ? b2.lastEffect = a2.next = a2 : (d2 = c2.next, c2.next = a2, a2.next = d2, b2.lastEffect = a2));
    return a2;
  }
  function ji() {
    return Uh().memoizedState;
  }
  function ki(a2, b2, c2, d2) {
    var e2 = Th();
    M$2.flags |= a2;
    e2.memoizedState = bi(1 | b2, c2, void 0, void 0 === d2 ? null : d2);
  }
  function li(a2, b2, c2, d2) {
    var e2 = Uh();
    d2 = void 0 === d2 ? null : d2;
    var f2 = void 0;
    if (null !== N$2) {
      var g2 = N$2.memoizedState;
      f2 = g2.destroy;
      if (null !== d2 && Mh(d2, g2.deps)) {
        e2.memoizedState = bi(b2, c2, f2, d2);
        return;
      }
    }
    M$2.flags |= a2;
    e2.memoizedState = bi(1 | b2, c2, f2, d2);
  }
  function mi(a2, b2) {
    return ki(8390656, 8, a2, b2);
  }
  function $h(a2, b2) {
    return li(2048, 8, a2, b2);
  }
  function ni(a2, b2) {
    return li(4, 2, a2, b2);
  }
  function oi(a2, b2) {
    return li(4, 4, a2, b2);
  }
  function pi(a2, b2) {
    if ("function" === typeof b2) return a2 = a2(), b2(a2), function() {
      b2(null);
    };
    if (null !== b2 && void 0 !== b2) return a2 = a2(), b2.current = a2, function() {
      b2.current = null;
    };
  }
  function qi(a2, b2, c2) {
    c2 = null !== c2 && void 0 !== c2 ? c2.concat([a2]) : null;
    return li(4, 4, pi.bind(null, b2, a2), c2);
  }
  function ri() {
  }
  function si(a2, b2) {
    var c2 = Uh();
    b2 = void 0 === b2 ? null : b2;
    var d2 = c2.memoizedState;
    if (null !== d2 && null !== b2 && Mh(b2, d2[1])) return d2[0];
    c2.memoizedState = [a2, b2];
    return a2;
  }
  function ti(a2, b2) {
    var c2 = Uh();
    b2 = void 0 === b2 ? null : b2;
    var d2 = c2.memoizedState;
    if (null !== d2 && null !== b2 && Mh(b2, d2[1])) return d2[0];
    a2 = a2();
    c2.memoizedState = [a2, b2];
    return a2;
  }
  function ui(a2, b2, c2) {
    if (0 === (Hh & 21)) return a2.baseState && (a2.baseState = false, dh = true), a2.memoizedState = c2;
    He$1(c2, b2) || (c2 = yc(), M$2.lanes |= c2, rh |= c2, a2.baseState = true);
    return b2;
  }
  function vi(a2, b2) {
    var c2 = C$2;
    C$2 = 0 !== c2 && 4 > c2 ? c2 : 4;
    a2(true);
    var d2 = Gh.transition;
    Gh.transition = {};
    try {
      a2(false), b2();
    } finally {
      C$2 = c2, Gh.transition = d2;
    }
  }
  function wi() {
    return Uh().memoizedState;
  }
  function xi(a2, b2, c2) {
    var d2 = yi(a2);
    c2 = { lane: d2, action: c2, hasEagerState: false, eagerState: null, next: null };
    if (zi(a2)) Ai(b2, c2);
    else if (c2 = hh(a2, b2, c2, d2), null !== c2) {
      var e2 = R$2();
      gi(c2, a2, d2, e2);
      Bi(c2, b2, d2);
    }
  }
  function ii(a2, b2, c2) {
    var d2 = yi(a2), e2 = { lane: d2, action: c2, hasEagerState: false, eagerState: null, next: null };
    if (zi(a2)) Ai(b2, e2);
    else {
      var f2 = a2.alternate;
      if (0 === a2.lanes && (null === f2 || 0 === f2.lanes) && (f2 = b2.lastRenderedReducer, null !== f2)) try {
        var g2 = b2.lastRenderedState, h2 = f2(g2, c2);
        e2.hasEagerState = true;
        e2.eagerState = h2;
        if (He$1(h2, g2)) {
          var k2 = b2.interleaved;
          null === k2 ? (e2.next = e2, gh(b2)) : (e2.next = k2.next, k2.next = e2);
          b2.interleaved = e2;
          return;
        }
      } catch (l2) {
      } finally {
      }
      c2 = hh(a2, b2, e2, d2);
      null !== c2 && (e2 = R$2(), gi(c2, a2, d2, e2), Bi(c2, b2, d2));
    }
  }
  function zi(a2) {
    var b2 = a2.alternate;
    return a2 === M$2 || null !== b2 && b2 === M$2;
  }
  function Ai(a2, b2) {
    Jh = Ih = true;
    var c2 = a2.pending;
    null === c2 ? b2.next = b2 : (b2.next = c2.next, c2.next = b2);
    a2.pending = b2;
  }
  function Bi(a2, b2, c2) {
    if (0 !== (c2 & 4194240)) {
      var d2 = b2.lanes;
      d2 &= a2.pendingLanes;
      c2 |= d2;
      b2.lanes = c2;
      Cc(a2, c2);
    }
  }
  var Rh = { readContext: eh, useCallback: P$2, useContext: P$2, useEffect: P$2, useImperativeHandle: P$2, useInsertionEffect: P$2, useLayoutEffect: P$2, useMemo: P$2, useReducer: P$2, useRef: P$2, useState: P$2, useDebugValue: P$2, useDeferredValue: P$2, useTransition: P$2, useMutableSource: P$2, useSyncExternalStore: P$2, useId: P$2, unstable_isNewReconciler: false }, Oh = { readContext: eh, useCallback: function(a2, b2) {
    Th().memoizedState = [a2, void 0 === b2 ? null : b2];
    return a2;
  }, useContext: eh, useEffect: mi, useImperativeHandle: function(a2, b2, c2) {
    c2 = null !== c2 && void 0 !== c2 ? c2.concat([a2]) : null;
    return ki(
      4194308,
      4,
      pi.bind(null, b2, a2),
      c2
    );
  }, useLayoutEffect: function(a2, b2) {
    return ki(4194308, 4, a2, b2);
  }, useInsertionEffect: function(a2, b2) {
    return ki(4, 2, a2, b2);
  }, useMemo: function(a2, b2) {
    var c2 = Th();
    b2 = void 0 === b2 ? null : b2;
    a2 = a2();
    c2.memoizedState = [a2, b2];
    return a2;
  }, useReducer: function(a2, b2, c2) {
    var d2 = Th();
    b2 = void 0 !== c2 ? c2(b2) : b2;
    d2.memoizedState = d2.baseState = b2;
    a2 = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: a2, lastRenderedState: b2 };
    d2.queue = a2;
    a2 = a2.dispatch = xi.bind(null, M$2, a2);
    return [d2.memoizedState, a2];
  }, useRef: function(a2) {
    var b2 = Th();
    a2 = { current: a2 };
    return b2.memoizedState = a2;
  }, useState: hi, useDebugValue: ri, useDeferredValue: function(a2) {
    return Th().memoizedState = a2;
  }, useTransition: function() {
    var a2 = hi(false), b2 = a2[0];
    a2 = vi.bind(null, a2[1]);
    Th().memoizedState = a2;
    return [b2, a2];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(a2, b2, c2) {
    var d2 = M$2, e2 = Th();
    if (I$2) {
      if (void 0 === c2) throw Error(p$3(407));
      c2 = c2();
    } else {
      c2 = b2();
      if (null === Q$1) throw Error(p$3(349));
      0 !== (Hh & 30) || di(d2, b2, c2);
    }
    e2.memoizedState = c2;
    var f2 = { value: c2, getSnapshot: b2 };
    e2.queue = f2;
    mi(ai.bind(
      null,
      d2,
      f2,
      a2
    ), [a2]);
    d2.flags |= 2048;
    bi(9, ci.bind(null, d2, f2, c2, b2), void 0, null);
    return c2;
  }, useId: function() {
    var a2 = Th(), b2 = Q$1.identifierPrefix;
    if (I$2) {
      var c2 = sg;
      var d2 = rg;
      c2 = (d2 & ~(1 << 32 - oc(d2) - 1)).toString(32) + c2;
      b2 = ":" + b2 + "R" + c2;
      c2 = Kh++;
      0 < c2 && (b2 += "H" + c2.toString(32));
      b2 += ":";
    } else c2 = Lh++, b2 = ":" + b2 + "r" + c2.toString(32) + ":";
    return a2.memoizedState = b2;
  }, unstable_isNewReconciler: false }, Ph = {
    readContext: eh,
    useCallback: si,
    useContext: eh,
    useEffect: $h,
    useImperativeHandle: qi,
    useInsertionEffect: ni,
    useLayoutEffect: oi,
    useMemo: ti,
    useReducer: Wh,
    useRef: ji,
    useState: function() {
      return Wh(Vh);
    },
    useDebugValue: ri,
    useDeferredValue: function(a2) {
      var b2 = Uh();
      return ui(b2, N$2.memoizedState, a2);
    },
    useTransition: function() {
      var a2 = Wh(Vh)[0], b2 = Uh().memoizedState;
      return [a2, b2];
    },
    useMutableSource: Yh,
    useSyncExternalStore: Zh,
    useId: wi,
    unstable_isNewReconciler: false
  }, Qh = { readContext: eh, useCallback: si, useContext: eh, useEffect: $h, useImperativeHandle: qi, useInsertionEffect: ni, useLayoutEffect: oi, useMemo: ti, useReducer: Xh, useRef: ji, useState: function() {
    return Xh(Vh);
  }, useDebugValue: ri, useDeferredValue: function(a2) {
    var b2 = Uh();
    return null === N$2 ? b2.memoizedState = a2 : ui(b2, N$2.memoizedState, a2);
  }, useTransition: function() {
    var a2 = Xh(Vh)[0], b2 = Uh().memoizedState;
    return [a2, b2];
  }, useMutableSource: Yh, useSyncExternalStore: Zh, useId: wi, unstable_isNewReconciler: false };
  function Ci(a2, b2) {
    if (a2 && a2.defaultProps) {
      b2 = A$2({}, b2);
      a2 = a2.defaultProps;
      for (var c2 in a2) void 0 === b2[c2] && (b2[c2] = a2[c2]);
      return b2;
    }
    return b2;
  }
  function Di(a2, b2, c2, d2) {
    b2 = a2.memoizedState;
    c2 = c2(d2, b2);
    c2 = null === c2 || void 0 === c2 ? b2 : A$2({}, b2, c2);
    a2.memoizedState = c2;
    0 === a2.lanes && (a2.updateQueue.baseState = c2);
  }
  var Ei = { isMounted: function(a2) {
    return (a2 = a2._reactInternals) ? Vb(a2) === a2 : false;
  }, enqueueSetState: function(a2, b2, c2) {
    a2 = a2._reactInternals;
    var d2 = R$2(), e2 = yi(a2), f2 = mh(d2, e2);
    f2.payload = b2;
    void 0 !== c2 && null !== c2 && (f2.callback = c2);
    b2 = nh(a2, f2, e2);
    null !== b2 && (gi(b2, a2, e2, d2), oh(b2, a2, e2));
  }, enqueueReplaceState: function(a2, b2, c2) {
    a2 = a2._reactInternals;
    var d2 = R$2(), e2 = yi(a2), f2 = mh(d2, e2);
    f2.tag = 1;
    f2.payload = b2;
    void 0 !== c2 && null !== c2 && (f2.callback = c2);
    b2 = nh(a2, f2, e2);
    null !== b2 && (gi(b2, a2, e2, d2), oh(b2, a2, e2));
  }, enqueueForceUpdate: function(a2, b2) {
    a2 = a2._reactInternals;
    var c2 = R$2(), d2 = yi(a2), e2 = mh(c2, d2);
    e2.tag = 2;
    void 0 !== b2 && null !== b2 && (e2.callback = b2);
    b2 = nh(a2, e2, d2);
    null !== b2 && (gi(b2, a2, d2, c2), oh(b2, a2, d2));
  } };
  function Fi(a2, b2, c2, d2, e2, f2, g2) {
    a2 = a2.stateNode;
    return "function" === typeof a2.shouldComponentUpdate ? a2.shouldComponentUpdate(d2, f2, g2) : b2.prototype && b2.prototype.isPureReactComponent ? !Ie(c2, d2) || !Ie(e2, f2) : true;
  }
  function Gi(a2, b2, c2) {
    var d2 = false, e2 = Vf;
    var f2 = b2.contextType;
    "object" === typeof f2 && null !== f2 ? f2 = eh(f2) : (e2 = Zf(b2) ? Xf : H$2.current, d2 = b2.contextTypes, f2 = (d2 = null !== d2 && void 0 !== d2) ? Yf(a2, e2) : Vf);
    b2 = new b2(c2, f2);
    a2.memoizedState = null !== b2.state && void 0 !== b2.state ? b2.state : null;
    b2.updater = Ei;
    a2.stateNode = b2;
    b2._reactInternals = a2;
    d2 && (a2 = a2.stateNode, a2.__reactInternalMemoizedUnmaskedChildContext = e2, a2.__reactInternalMemoizedMaskedChildContext = f2);
    return b2;
  }
  function Hi(a2, b2, c2, d2) {
    a2 = b2.state;
    "function" === typeof b2.componentWillReceiveProps && b2.componentWillReceiveProps(c2, d2);
    "function" === typeof b2.UNSAFE_componentWillReceiveProps && b2.UNSAFE_componentWillReceiveProps(c2, d2);
    b2.state !== a2 && Ei.enqueueReplaceState(b2, b2.state, null);
  }
  function Ii(a2, b2, c2, d2) {
    var e2 = a2.stateNode;
    e2.props = c2;
    e2.state = a2.memoizedState;
    e2.refs = {};
    kh(a2);
    var f2 = b2.contextType;
    "object" === typeof f2 && null !== f2 ? e2.context = eh(f2) : (f2 = Zf(b2) ? Xf : H$2.current, e2.context = Yf(a2, f2));
    e2.state = a2.memoizedState;
    f2 = b2.getDerivedStateFromProps;
    "function" === typeof f2 && (Di(a2, b2, f2, c2), e2.state = a2.memoizedState);
    "function" === typeof b2.getDerivedStateFromProps || "function" === typeof e2.getSnapshotBeforeUpdate || "function" !== typeof e2.UNSAFE_componentWillMount && "function" !== typeof e2.componentWillMount || (b2 = e2.state, "function" === typeof e2.componentWillMount && e2.componentWillMount(), "function" === typeof e2.UNSAFE_componentWillMount && e2.UNSAFE_componentWillMount(), b2 !== e2.state && Ei.enqueueReplaceState(e2, e2.state, null), qh(a2, c2, e2, d2), e2.state = a2.memoizedState);
    "function" === typeof e2.componentDidMount && (a2.flags |= 4194308);
  }
  function Ji(a2, b2) {
    try {
      var c2 = "", d2 = b2;
      do
        c2 += Pa(d2), d2 = d2.return;
      while (d2);
      var e2 = c2;
    } catch (f2) {
      e2 = "\nError generating stack: " + f2.message + "\n" + f2.stack;
    }
    return { value: a2, source: b2, stack: e2, digest: null };
  }
  function Ki(a2, b2, c2) {
    return { value: a2, source: null, stack: null != c2 ? c2 : null, digest: null != b2 ? b2 : null };
  }
  function Li(a2, b2) {
    try {
      console.error(b2.value);
    } catch (c2) {
      setTimeout(function() {
        throw c2;
      });
    }
  }
  var Mi = "function" === typeof WeakMap ? WeakMap : Map;
  function Ni(a2, b2, c2) {
    c2 = mh(-1, c2);
    c2.tag = 3;
    c2.payload = { element: null };
    var d2 = b2.value;
    c2.callback = function() {
      Oi || (Oi = true, Pi = d2);
      Li(a2, b2);
    };
    return c2;
  }
  function Qi(a2, b2, c2) {
    c2 = mh(-1, c2);
    c2.tag = 3;
    var d2 = a2.type.getDerivedStateFromError;
    if ("function" === typeof d2) {
      var e2 = b2.value;
      c2.payload = function() {
        return d2(e2);
      };
      c2.callback = function() {
        Li(a2, b2);
      };
    }
    var f2 = a2.stateNode;
    null !== f2 && "function" === typeof f2.componentDidCatch && (c2.callback = function() {
      Li(a2, b2);
      "function" !== typeof d2 && (null === Ri ? Ri = /* @__PURE__ */ new Set([this]) : Ri.add(this));
      var c3 = b2.stack;
      this.componentDidCatch(b2.value, { componentStack: null !== c3 ? c3 : "" });
    });
    return c2;
  }
  function Si(a2, b2, c2) {
    var d2 = a2.pingCache;
    if (null === d2) {
      d2 = a2.pingCache = new Mi();
      var e2 = /* @__PURE__ */ new Set();
      d2.set(b2, e2);
    } else e2 = d2.get(b2), void 0 === e2 && (e2 = /* @__PURE__ */ new Set(), d2.set(b2, e2));
    e2.has(c2) || (e2.add(c2), a2 = Ti.bind(null, a2, b2, c2), b2.then(a2, a2));
  }
  function Ui(a2) {
    do {
      var b2;
      if (b2 = 13 === a2.tag) b2 = a2.memoizedState, b2 = null !== b2 ? null !== b2.dehydrated ? true : false : true;
      if (b2) return a2;
      a2 = a2.return;
    } while (null !== a2);
    return null;
  }
  function Vi(a2, b2, c2, d2, e2) {
    if (0 === (a2.mode & 1)) return a2 === b2 ? a2.flags |= 65536 : (a2.flags |= 128, c2.flags |= 131072, c2.flags &= -52805, 1 === c2.tag && (null === c2.alternate ? c2.tag = 17 : (b2 = mh(-1, 1), b2.tag = 2, nh(c2, b2, 1))), c2.lanes |= 1), a2;
    a2.flags |= 65536;
    a2.lanes = e2;
    return a2;
  }
  var Wi = ua.ReactCurrentOwner, dh = false;
  function Xi(a2, b2, c2, d2) {
    b2.child = null === a2 ? Vg(b2, null, c2, d2) : Ug(b2, a2.child, c2, d2);
  }
  function Yi(a2, b2, c2, d2, e2) {
    c2 = c2.render;
    var f2 = b2.ref;
    ch(b2, e2);
    d2 = Nh(a2, b2, c2, d2, f2, e2);
    c2 = Sh();
    if (null !== a2 && !dh) return b2.updateQueue = a2.updateQueue, b2.flags &= -2053, a2.lanes &= ~e2, Zi(a2, b2, e2);
    I$2 && c2 && vg(b2);
    b2.flags |= 1;
    Xi(a2, b2, d2, e2);
    return b2.child;
  }
  function $i(a2, b2, c2, d2, e2) {
    if (null === a2) {
      var f2 = c2.type;
      if ("function" === typeof f2 && !aj(f2) && void 0 === f2.defaultProps && null === c2.compare && void 0 === c2.defaultProps) return b2.tag = 15, b2.type = f2, bj(a2, b2, f2, d2, e2);
      a2 = Rg(c2.type, null, d2, b2, b2.mode, e2);
      a2.ref = b2.ref;
      a2.return = b2;
      return b2.child = a2;
    }
    f2 = a2.child;
    if (0 === (a2.lanes & e2)) {
      var g2 = f2.memoizedProps;
      c2 = c2.compare;
      c2 = null !== c2 ? c2 : Ie;
      if (c2(g2, d2) && a2.ref === b2.ref) return Zi(a2, b2, e2);
    }
    b2.flags |= 1;
    a2 = Pg(f2, d2);
    a2.ref = b2.ref;
    a2.return = b2;
    return b2.child = a2;
  }
  function bj(a2, b2, c2, d2, e2) {
    if (null !== a2) {
      var f2 = a2.memoizedProps;
      if (Ie(f2, d2) && a2.ref === b2.ref) if (dh = false, b2.pendingProps = d2 = f2, 0 !== (a2.lanes & e2)) 0 !== (a2.flags & 131072) && (dh = true);
      else return b2.lanes = a2.lanes, Zi(a2, b2, e2);
    }
    return cj(a2, b2, c2, d2, e2);
  }
  function dj(a2, b2, c2) {
    var d2 = b2.pendingProps, e2 = d2.children, f2 = null !== a2 ? a2.memoizedState : null;
    if ("hidden" === d2.mode) if (0 === (b2.mode & 1)) b2.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, G$2(ej, fj), fj |= c2;
    else {
      if (0 === (c2 & 1073741824)) return a2 = null !== f2 ? f2.baseLanes | c2 : c2, b2.lanes = b2.childLanes = 1073741824, b2.memoizedState = { baseLanes: a2, cachePool: null, transitions: null }, b2.updateQueue = null, G$2(ej, fj), fj |= a2, null;
      b2.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
      d2 = null !== f2 ? f2.baseLanes : c2;
      G$2(ej, fj);
      fj |= d2;
    }
    else null !== f2 ? (d2 = f2.baseLanes | c2, b2.memoizedState = null) : d2 = c2, G$2(ej, fj), fj |= d2;
    Xi(a2, b2, e2, c2);
    return b2.child;
  }
  function gj(a2, b2) {
    var c2 = b2.ref;
    if (null === a2 && null !== c2 || null !== a2 && a2.ref !== c2) b2.flags |= 512, b2.flags |= 2097152;
  }
  function cj(a2, b2, c2, d2, e2) {
    var f2 = Zf(c2) ? Xf : H$2.current;
    f2 = Yf(b2, f2);
    ch(b2, e2);
    c2 = Nh(a2, b2, c2, d2, f2, e2);
    d2 = Sh();
    if (null !== a2 && !dh) return b2.updateQueue = a2.updateQueue, b2.flags &= -2053, a2.lanes &= ~e2, Zi(a2, b2, e2);
    I$2 && d2 && vg(b2);
    b2.flags |= 1;
    Xi(a2, b2, c2, e2);
    return b2.child;
  }
  function hj(a2, b2, c2, d2, e2) {
    if (Zf(c2)) {
      var f2 = true;
      cg(b2);
    } else f2 = false;
    ch(b2, e2);
    if (null === b2.stateNode) ij(a2, b2), Gi(b2, c2, d2), Ii(b2, c2, d2, e2), d2 = true;
    else if (null === a2) {
      var g2 = b2.stateNode, h2 = b2.memoizedProps;
      g2.props = h2;
      var k2 = g2.context, l2 = c2.contextType;
      "object" === typeof l2 && null !== l2 ? l2 = eh(l2) : (l2 = Zf(c2) ? Xf : H$2.current, l2 = Yf(b2, l2));
      var m2 = c2.getDerivedStateFromProps, q2 = "function" === typeof m2 || "function" === typeof g2.getSnapshotBeforeUpdate;
      q2 || "function" !== typeof g2.UNSAFE_componentWillReceiveProps && "function" !== typeof g2.componentWillReceiveProps || (h2 !== d2 || k2 !== l2) && Hi(b2, g2, d2, l2);
      jh = false;
      var r2 = b2.memoizedState;
      g2.state = r2;
      qh(b2, d2, g2, e2);
      k2 = b2.memoizedState;
      h2 !== d2 || r2 !== k2 || Wf.current || jh ? ("function" === typeof m2 && (Di(b2, c2, m2, d2), k2 = b2.memoizedState), (h2 = jh || Fi(b2, c2, h2, d2, r2, k2, l2)) ? (q2 || "function" !== typeof g2.UNSAFE_componentWillMount && "function" !== typeof g2.componentWillMount || ("function" === typeof g2.componentWillMount && g2.componentWillMount(), "function" === typeof g2.UNSAFE_componentWillMount && g2.UNSAFE_componentWillMount()), "function" === typeof g2.componentDidMount && (b2.flags |= 4194308)) : ("function" === typeof g2.componentDidMount && (b2.flags |= 4194308), b2.memoizedProps = d2, b2.memoizedState = k2), g2.props = d2, g2.state = k2, g2.context = l2, d2 = h2) : ("function" === typeof g2.componentDidMount && (b2.flags |= 4194308), d2 = false);
    } else {
      g2 = b2.stateNode;
      lh(a2, b2);
      h2 = b2.memoizedProps;
      l2 = b2.type === b2.elementType ? h2 : Ci(b2.type, h2);
      g2.props = l2;
      q2 = b2.pendingProps;
      r2 = g2.context;
      k2 = c2.contextType;
      "object" === typeof k2 && null !== k2 ? k2 = eh(k2) : (k2 = Zf(c2) ? Xf : H$2.current, k2 = Yf(b2, k2));
      var y2 = c2.getDerivedStateFromProps;
      (m2 = "function" === typeof y2 || "function" === typeof g2.getSnapshotBeforeUpdate) || "function" !== typeof g2.UNSAFE_componentWillReceiveProps && "function" !== typeof g2.componentWillReceiveProps || (h2 !== q2 || r2 !== k2) && Hi(b2, g2, d2, k2);
      jh = false;
      r2 = b2.memoizedState;
      g2.state = r2;
      qh(b2, d2, g2, e2);
      var n2 = b2.memoizedState;
      h2 !== q2 || r2 !== n2 || Wf.current || jh ? ("function" === typeof y2 && (Di(b2, c2, y2, d2), n2 = b2.memoizedState), (l2 = jh || Fi(b2, c2, l2, d2, r2, n2, k2) || false) ? (m2 || "function" !== typeof g2.UNSAFE_componentWillUpdate && "function" !== typeof g2.componentWillUpdate || ("function" === typeof g2.componentWillUpdate && g2.componentWillUpdate(d2, n2, k2), "function" === typeof g2.UNSAFE_componentWillUpdate && g2.UNSAFE_componentWillUpdate(d2, n2, k2)), "function" === typeof g2.componentDidUpdate && (b2.flags |= 4), "function" === typeof g2.getSnapshotBeforeUpdate && (b2.flags |= 1024)) : ("function" !== typeof g2.componentDidUpdate || h2 === a2.memoizedProps && r2 === a2.memoizedState || (b2.flags |= 4), "function" !== typeof g2.getSnapshotBeforeUpdate || h2 === a2.memoizedProps && r2 === a2.memoizedState || (b2.flags |= 1024), b2.memoizedProps = d2, b2.memoizedState = n2), g2.props = d2, g2.state = n2, g2.context = k2, d2 = l2) : ("function" !== typeof g2.componentDidUpdate || h2 === a2.memoizedProps && r2 === a2.memoizedState || (b2.flags |= 4), "function" !== typeof g2.getSnapshotBeforeUpdate || h2 === a2.memoizedProps && r2 === a2.memoizedState || (b2.flags |= 1024), d2 = false);
    }
    return jj(a2, b2, c2, d2, f2, e2);
  }
  function jj(a2, b2, c2, d2, e2, f2) {
    gj(a2, b2);
    var g2 = 0 !== (b2.flags & 128);
    if (!d2 && !g2) return e2 && dg(b2, c2, false), Zi(a2, b2, f2);
    d2 = b2.stateNode;
    Wi.current = b2;
    var h2 = g2 && "function" !== typeof c2.getDerivedStateFromError ? null : d2.render();
    b2.flags |= 1;
    null !== a2 && g2 ? (b2.child = Ug(b2, a2.child, null, f2), b2.child = Ug(b2, null, h2, f2)) : Xi(a2, b2, h2, f2);
    b2.memoizedState = d2.state;
    e2 && dg(b2, c2, true);
    return b2.child;
  }
  function kj(a2) {
    var b2 = a2.stateNode;
    b2.pendingContext ? ag(a2, b2.pendingContext, b2.pendingContext !== b2.context) : b2.context && ag(a2, b2.context, false);
    yh(a2, b2.containerInfo);
  }
  function lj(a2, b2, c2, d2, e2) {
    Ig();
    Jg(e2);
    b2.flags |= 256;
    Xi(a2, b2, c2, d2);
    return b2.child;
  }
  var mj = { dehydrated: null, treeContext: null, retryLane: 0 };
  function nj(a2) {
    return { baseLanes: a2, cachePool: null, transitions: null };
  }
  function oj(a2, b2, c2) {
    var d2 = b2.pendingProps, e2 = L$2.current, f2 = false, g2 = 0 !== (b2.flags & 128), h2;
    (h2 = g2) || (h2 = null !== a2 && null === a2.memoizedState ? false : 0 !== (e2 & 2));
    if (h2) f2 = true, b2.flags &= -129;
    else if (null === a2 || null !== a2.memoizedState) e2 |= 1;
    G$2(L$2, e2 & 1);
    if (null === a2) {
      Eg(b2);
      a2 = b2.memoizedState;
      if (null !== a2 && (a2 = a2.dehydrated, null !== a2)) return 0 === (b2.mode & 1) ? b2.lanes = 1 : "$!" === a2.data ? b2.lanes = 8 : b2.lanes = 1073741824, null;
      g2 = d2.children;
      a2 = d2.fallback;
      return f2 ? (d2 = b2.mode, f2 = b2.child, g2 = { mode: "hidden", children: g2 }, 0 === (d2 & 1) && null !== f2 ? (f2.childLanes = 0, f2.pendingProps = g2) : f2 = pj(g2, d2, 0, null), a2 = Tg(a2, d2, c2, null), f2.return = b2, a2.return = b2, f2.sibling = a2, b2.child = f2, b2.child.memoizedState = nj(c2), b2.memoizedState = mj, a2) : qj(b2, g2);
    }
    e2 = a2.memoizedState;
    if (null !== e2 && (h2 = e2.dehydrated, null !== h2)) return rj(a2, b2, g2, d2, h2, e2, c2);
    if (f2) {
      f2 = d2.fallback;
      g2 = b2.mode;
      e2 = a2.child;
      h2 = e2.sibling;
      var k2 = { mode: "hidden", children: d2.children };
      0 === (g2 & 1) && b2.child !== e2 ? (d2 = b2.child, d2.childLanes = 0, d2.pendingProps = k2, b2.deletions = null) : (d2 = Pg(e2, k2), d2.subtreeFlags = e2.subtreeFlags & 14680064);
      null !== h2 ? f2 = Pg(h2, f2) : (f2 = Tg(f2, g2, c2, null), f2.flags |= 2);
      f2.return = b2;
      d2.return = b2;
      d2.sibling = f2;
      b2.child = d2;
      d2 = f2;
      f2 = b2.child;
      g2 = a2.child.memoizedState;
      g2 = null === g2 ? nj(c2) : { baseLanes: g2.baseLanes | c2, cachePool: null, transitions: g2.transitions };
      f2.memoizedState = g2;
      f2.childLanes = a2.childLanes & ~c2;
      b2.memoizedState = mj;
      return d2;
    }
    f2 = a2.child;
    a2 = f2.sibling;
    d2 = Pg(f2, { mode: "visible", children: d2.children });
    0 === (b2.mode & 1) && (d2.lanes = c2);
    d2.return = b2;
    d2.sibling = null;
    null !== a2 && (c2 = b2.deletions, null === c2 ? (b2.deletions = [a2], b2.flags |= 16) : c2.push(a2));
    b2.child = d2;
    b2.memoizedState = null;
    return d2;
  }
  function qj(a2, b2) {
    b2 = pj({ mode: "visible", children: b2 }, a2.mode, 0, null);
    b2.return = a2;
    return a2.child = b2;
  }
  function sj(a2, b2, c2, d2) {
    null !== d2 && Jg(d2);
    Ug(b2, a2.child, null, c2);
    a2 = qj(b2, b2.pendingProps.children);
    a2.flags |= 2;
    b2.memoizedState = null;
    return a2;
  }
  function rj(a2, b2, c2, d2, e2, f2, g2) {
    if (c2) {
      if (b2.flags & 256) return b2.flags &= -257, d2 = Ki(Error(p$3(422))), sj(a2, b2, g2, d2);
      if (null !== b2.memoizedState) return b2.child = a2.child, b2.flags |= 128, null;
      f2 = d2.fallback;
      e2 = b2.mode;
      d2 = pj({ mode: "visible", children: d2.children }, e2, 0, null);
      f2 = Tg(f2, e2, g2, null);
      f2.flags |= 2;
      d2.return = b2;
      f2.return = b2;
      d2.sibling = f2;
      b2.child = d2;
      0 !== (b2.mode & 1) && Ug(b2, a2.child, null, g2);
      b2.child.memoizedState = nj(g2);
      b2.memoizedState = mj;
      return f2;
    }
    if (0 === (b2.mode & 1)) return sj(a2, b2, g2, null);
    if ("$!" === e2.data) {
      d2 = e2.nextSibling && e2.nextSibling.dataset;
      if (d2) var h2 = d2.dgst;
      d2 = h2;
      f2 = Error(p$3(419));
      d2 = Ki(f2, d2, void 0);
      return sj(a2, b2, g2, d2);
    }
    h2 = 0 !== (g2 & a2.childLanes);
    if (dh || h2) {
      d2 = Q$1;
      if (null !== d2) {
        switch (g2 & -g2) {
          case 4:
            e2 = 2;
            break;
          case 16:
            e2 = 8;
            break;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            e2 = 32;
            break;
          case 536870912:
            e2 = 268435456;
            break;
          default:
            e2 = 0;
        }
        e2 = 0 !== (e2 & (d2.suspendedLanes | g2)) ? 0 : e2;
        0 !== e2 && e2 !== f2.retryLane && (f2.retryLane = e2, ih(a2, e2), gi(d2, a2, e2, -1));
      }
      tj();
      d2 = Ki(Error(p$3(421)));
      return sj(a2, b2, g2, d2);
    }
    if ("$?" === e2.data) return b2.flags |= 128, b2.child = a2.child, b2 = uj.bind(null, a2), e2._reactRetry = b2, null;
    a2 = f2.treeContext;
    yg = Lf(e2.nextSibling);
    xg = b2;
    I$2 = true;
    zg = null;
    null !== a2 && (og[pg++] = rg, og[pg++] = sg, og[pg++] = qg, rg = a2.id, sg = a2.overflow, qg = b2);
    b2 = qj(b2, d2.children);
    b2.flags |= 4096;
    return b2;
  }
  function vj(a2, b2, c2) {
    a2.lanes |= b2;
    var d2 = a2.alternate;
    null !== d2 && (d2.lanes |= b2);
    bh(a2.return, b2, c2);
  }
  function wj(a2, b2, c2, d2, e2) {
    var f2 = a2.memoizedState;
    null === f2 ? a2.memoizedState = { isBackwards: b2, rendering: null, renderingStartTime: 0, last: d2, tail: c2, tailMode: e2 } : (f2.isBackwards = b2, f2.rendering = null, f2.renderingStartTime = 0, f2.last = d2, f2.tail = c2, f2.tailMode = e2);
  }
  function xj(a2, b2, c2) {
    var d2 = b2.pendingProps, e2 = d2.revealOrder, f2 = d2.tail;
    Xi(a2, b2, d2.children, c2);
    d2 = L$2.current;
    if (0 !== (d2 & 2)) d2 = d2 & 1 | 2, b2.flags |= 128;
    else {
      if (null !== a2 && 0 !== (a2.flags & 128)) a: for (a2 = b2.child; null !== a2; ) {
        if (13 === a2.tag) null !== a2.memoizedState && vj(a2, c2, b2);
        else if (19 === a2.tag) vj(a2, c2, b2);
        else if (null !== a2.child) {
          a2.child.return = a2;
          a2 = a2.child;
          continue;
        }
        if (a2 === b2) break a;
        for (; null === a2.sibling; ) {
          if (null === a2.return || a2.return === b2) break a;
          a2 = a2.return;
        }
        a2.sibling.return = a2.return;
        a2 = a2.sibling;
      }
      d2 &= 1;
    }
    G$2(L$2, d2);
    if (0 === (b2.mode & 1)) b2.memoizedState = null;
    else switch (e2) {
      case "forwards":
        c2 = b2.child;
        for (e2 = null; null !== c2; ) a2 = c2.alternate, null !== a2 && null === Ch(a2) && (e2 = c2), c2 = c2.sibling;
        c2 = e2;
        null === c2 ? (e2 = b2.child, b2.child = null) : (e2 = c2.sibling, c2.sibling = null);
        wj(b2, false, e2, c2, f2);
        break;
      case "backwards":
        c2 = null;
        e2 = b2.child;
        for (b2.child = null; null !== e2; ) {
          a2 = e2.alternate;
          if (null !== a2 && null === Ch(a2)) {
            b2.child = e2;
            break;
          }
          a2 = e2.sibling;
          e2.sibling = c2;
          c2 = e2;
          e2 = a2;
        }
        wj(b2, true, c2, null, f2);
        break;
      case "together":
        wj(b2, false, null, null, void 0);
        break;
      default:
        b2.memoizedState = null;
    }
    return b2.child;
  }
  function ij(a2, b2) {
    0 === (b2.mode & 1) && null !== a2 && (a2.alternate = null, b2.alternate = null, b2.flags |= 2);
  }
  function Zi(a2, b2, c2) {
    null !== a2 && (b2.dependencies = a2.dependencies);
    rh |= b2.lanes;
    if (0 === (c2 & b2.childLanes)) return null;
    if (null !== a2 && b2.child !== a2.child) throw Error(p$3(153));
    if (null !== b2.child) {
      a2 = b2.child;
      c2 = Pg(a2, a2.pendingProps);
      b2.child = c2;
      for (c2.return = b2; null !== a2.sibling; ) a2 = a2.sibling, c2 = c2.sibling = Pg(a2, a2.pendingProps), c2.return = b2;
      c2.sibling = null;
    }
    return b2.child;
  }
  function yj(a2, b2, c2) {
    switch (b2.tag) {
      case 3:
        kj(b2);
        Ig();
        break;
      case 5:
        Ah(b2);
        break;
      case 1:
        Zf(b2.type) && cg(b2);
        break;
      case 4:
        yh(b2, b2.stateNode.containerInfo);
        break;
      case 10:
        var d2 = b2.type._context, e2 = b2.memoizedProps.value;
        G$2(Wg, d2._currentValue);
        d2._currentValue = e2;
        break;
      case 13:
        d2 = b2.memoizedState;
        if (null !== d2) {
          if (null !== d2.dehydrated) return G$2(L$2, L$2.current & 1), b2.flags |= 128, null;
          if (0 !== (c2 & b2.child.childLanes)) return oj(a2, b2, c2);
          G$2(L$2, L$2.current & 1);
          a2 = Zi(a2, b2, c2);
          return null !== a2 ? a2.sibling : null;
        }
        G$2(L$2, L$2.current & 1);
        break;
      case 19:
        d2 = 0 !== (c2 & b2.childLanes);
        if (0 !== (a2.flags & 128)) {
          if (d2) return xj(a2, b2, c2);
          b2.flags |= 128;
        }
        e2 = b2.memoizedState;
        null !== e2 && (e2.rendering = null, e2.tail = null, e2.lastEffect = null);
        G$2(L$2, L$2.current);
        if (d2) break;
        else return null;
      case 22:
      case 23:
        return b2.lanes = 0, dj(a2, b2, c2);
    }
    return Zi(a2, b2, c2);
  }
  var zj, Aj, Bj, Cj;
  zj = function(a2, b2) {
    for (var c2 = b2.child; null !== c2; ) {
      if (5 === c2.tag || 6 === c2.tag) a2.appendChild(c2.stateNode);
      else if (4 !== c2.tag && null !== c2.child) {
        c2.child.return = c2;
        c2 = c2.child;
        continue;
      }
      if (c2 === b2) break;
      for (; null === c2.sibling; ) {
        if (null === c2.return || c2.return === b2) return;
        c2 = c2.return;
      }
      c2.sibling.return = c2.return;
      c2 = c2.sibling;
    }
  };
  Aj = function() {
  };
  Bj = function(a2, b2, c2, d2) {
    var e2 = a2.memoizedProps;
    if (e2 !== d2) {
      a2 = b2.stateNode;
      xh(uh.current);
      var f2 = null;
      switch (c2) {
        case "input":
          e2 = Ya(a2, e2);
          d2 = Ya(a2, d2);
          f2 = [];
          break;
        case "select":
          e2 = A$2({}, e2, { value: void 0 });
          d2 = A$2({}, d2, { value: void 0 });
          f2 = [];
          break;
        case "textarea":
          e2 = gb(a2, e2);
          d2 = gb(a2, d2);
          f2 = [];
          break;
        default:
          "function" !== typeof e2.onClick && "function" === typeof d2.onClick && (a2.onclick = Bf);
      }
      ub(c2, d2);
      var g2;
      c2 = null;
      for (l2 in e2) if (!d2.hasOwnProperty(l2) && e2.hasOwnProperty(l2) && null != e2[l2]) if ("style" === l2) {
        var h2 = e2[l2];
        for (g2 in h2) h2.hasOwnProperty(g2) && (c2 || (c2 = {}), c2[g2] = "");
      } else "dangerouslySetInnerHTML" !== l2 && "children" !== l2 && "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && "autoFocus" !== l2 && (ea.hasOwnProperty(l2) ? f2 || (f2 = []) : (f2 = f2 || []).push(l2, null));
      for (l2 in d2) {
        var k2 = d2[l2];
        h2 = null != e2 ? e2[l2] : void 0;
        if (d2.hasOwnProperty(l2) && k2 !== h2 && (null != k2 || null != h2)) if ("style" === l2) if (h2) {
          for (g2 in h2) !h2.hasOwnProperty(g2) || k2 && k2.hasOwnProperty(g2) || (c2 || (c2 = {}), c2[g2] = "");
          for (g2 in k2) k2.hasOwnProperty(g2) && h2[g2] !== k2[g2] && (c2 || (c2 = {}), c2[g2] = k2[g2]);
        } else c2 || (f2 || (f2 = []), f2.push(
          l2,
          c2
        )), c2 = k2;
        else "dangerouslySetInnerHTML" === l2 ? (k2 = k2 ? k2.__html : void 0, h2 = h2 ? h2.__html : void 0, null != k2 && h2 !== k2 && (f2 = f2 || []).push(l2, k2)) : "children" === l2 ? "string" !== typeof k2 && "number" !== typeof k2 || (f2 = f2 || []).push(l2, "" + k2) : "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && (ea.hasOwnProperty(l2) ? (null != k2 && "onScroll" === l2 && D$2("scroll", a2), f2 || h2 === k2 || (f2 = [])) : (f2 = f2 || []).push(l2, k2));
      }
      c2 && (f2 = f2 || []).push("style", c2);
      var l2 = f2;
      if (b2.updateQueue = l2) b2.flags |= 4;
    }
  };
  Cj = function(a2, b2, c2, d2) {
    c2 !== d2 && (b2.flags |= 4);
  };
  function Dj(a2, b2) {
    if (!I$2) switch (a2.tailMode) {
      case "hidden":
        b2 = a2.tail;
        for (var c2 = null; null !== b2; ) null !== b2.alternate && (c2 = b2), b2 = b2.sibling;
        null === c2 ? a2.tail = null : c2.sibling = null;
        break;
      case "collapsed":
        c2 = a2.tail;
        for (var d2 = null; null !== c2; ) null !== c2.alternate && (d2 = c2), c2 = c2.sibling;
        null === d2 ? b2 || null === a2.tail ? a2.tail = null : a2.tail.sibling = null : d2.sibling = null;
    }
  }
  function S$2(a2) {
    var b2 = null !== a2.alternate && a2.alternate.child === a2.child, c2 = 0, d2 = 0;
    if (b2) for (var e2 = a2.child; null !== e2; ) c2 |= e2.lanes | e2.childLanes, d2 |= e2.subtreeFlags & 14680064, d2 |= e2.flags & 14680064, e2.return = a2, e2 = e2.sibling;
    else for (e2 = a2.child; null !== e2; ) c2 |= e2.lanes | e2.childLanes, d2 |= e2.subtreeFlags, d2 |= e2.flags, e2.return = a2, e2 = e2.sibling;
    a2.subtreeFlags |= d2;
    a2.childLanes = c2;
    return b2;
  }
  function Ej(a2, b2, c2) {
    var d2 = b2.pendingProps;
    wg(b2);
    switch (b2.tag) {
      case 2:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return S$2(b2), null;
      case 1:
        return Zf(b2.type) && $f(), S$2(b2), null;
      case 3:
        d2 = b2.stateNode;
        zh();
        E$2(Wf);
        E$2(H$2);
        Eh();
        d2.pendingContext && (d2.context = d2.pendingContext, d2.pendingContext = null);
        if (null === a2 || null === a2.child) Gg(b2) ? b2.flags |= 4 : null === a2 || a2.memoizedState.isDehydrated && 0 === (b2.flags & 256) || (b2.flags |= 1024, null !== zg && (Fj(zg), zg = null));
        Aj(a2, b2);
        S$2(b2);
        return null;
      case 5:
        Bh(b2);
        var e2 = xh(wh.current);
        c2 = b2.type;
        if (null !== a2 && null != b2.stateNode) Bj(a2, b2, c2, d2, e2), a2.ref !== b2.ref && (b2.flags |= 512, b2.flags |= 2097152);
        else {
          if (!d2) {
            if (null === b2.stateNode) throw Error(p$3(166));
            S$2(b2);
            return null;
          }
          a2 = xh(uh.current);
          if (Gg(b2)) {
            d2 = b2.stateNode;
            c2 = b2.type;
            var f2 = b2.memoizedProps;
            d2[Of] = b2;
            d2[Pf] = f2;
            a2 = 0 !== (b2.mode & 1);
            switch (c2) {
              case "dialog":
                D$2("cancel", d2);
                D$2("close", d2);
                break;
              case "iframe":
              case "object":
              case "embed":
                D$2("load", d2);
                break;
              case "video":
              case "audio":
                for (e2 = 0; e2 < lf.length; e2++) D$2(lf[e2], d2);
                break;
              case "source":
                D$2("error", d2);
                break;
              case "img":
              case "image":
              case "link":
                D$2(
                  "error",
                  d2
                );
                D$2("load", d2);
                break;
              case "details":
                D$2("toggle", d2);
                break;
              case "input":
                Za(d2, f2);
                D$2("invalid", d2);
                break;
              case "select":
                d2._wrapperState = { wasMultiple: !!f2.multiple };
                D$2("invalid", d2);
                break;
              case "textarea":
                hb(d2, f2), D$2("invalid", d2);
            }
            ub(c2, f2);
            e2 = null;
            for (var g2 in f2) if (f2.hasOwnProperty(g2)) {
              var h2 = f2[g2];
              "children" === g2 ? "string" === typeof h2 ? d2.textContent !== h2 && (true !== f2.suppressHydrationWarning && Af(d2.textContent, h2, a2), e2 = ["children", h2]) : "number" === typeof h2 && d2.textContent !== "" + h2 && (true !== f2.suppressHydrationWarning && Af(
                d2.textContent,
                h2,
                a2
              ), e2 = ["children", "" + h2]) : ea.hasOwnProperty(g2) && null != h2 && "onScroll" === g2 && D$2("scroll", d2);
            }
            switch (c2) {
              case "input":
                Va(d2);
                db(d2, f2, true);
                break;
              case "textarea":
                Va(d2);
                jb(d2);
                break;
              case "select":
              case "option":
                break;
              default:
                "function" === typeof f2.onClick && (d2.onclick = Bf);
            }
            d2 = e2;
            b2.updateQueue = d2;
            null !== d2 && (b2.flags |= 4);
          } else {
            g2 = 9 === e2.nodeType ? e2 : e2.ownerDocument;
            "http://www.w3.org/1999/xhtml" === a2 && (a2 = kb(c2));
            "http://www.w3.org/1999/xhtml" === a2 ? "script" === c2 ? (a2 = g2.createElement("div"), a2.innerHTML = "<script><\/script>", a2 = a2.removeChild(a2.firstChild)) : "string" === typeof d2.is ? a2 = g2.createElement(c2, { is: d2.is }) : (a2 = g2.createElement(c2), "select" === c2 && (g2 = a2, d2.multiple ? g2.multiple = true : d2.size && (g2.size = d2.size))) : a2 = g2.createElementNS(a2, c2);
            a2[Of] = b2;
            a2[Pf] = d2;
            zj(a2, b2, false, false);
            b2.stateNode = a2;
            a: {
              g2 = vb(c2, d2);
              switch (c2) {
                case "dialog":
                  D$2("cancel", a2);
                  D$2("close", a2);
                  e2 = d2;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  D$2("load", a2);
                  e2 = d2;
                  break;
                case "video":
                case "audio":
                  for (e2 = 0; e2 < lf.length; e2++) D$2(lf[e2], a2);
                  e2 = d2;
                  break;
                case "source":
                  D$2("error", a2);
                  e2 = d2;
                  break;
                case "img":
                case "image":
                case "link":
                  D$2(
                    "error",
                    a2
                  );
                  D$2("load", a2);
                  e2 = d2;
                  break;
                case "details":
                  D$2("toggle", a2);
                  e2 = d2;
                  break;
                case "input":
                  Za(a2, d2);
                  e2 = Ya(a2, d2);
                  D$2("invalid", a2);
                  break;
                case "option":
                  e2 = d2;
                  break;
                case "select":
                  a2._wrapperState = { wasMultiple: !!d2.multiple };
                  e2 = A$2({}, d2, { value: void 0 });
                  D$2("invalid", a2);
                  break;
                case "textarea":
                  hb(a2, d2);
                  e2 = gb(a2, d2);
                  D$2("invalid", a2);
                  break;
                default:
                  e2 = d2;
              }
              ub(c2, e2);
              h2 = e2;
              for (f2 in h2) if (h2.hasOwnProperty(f2)) {
                var k2 = h2[f2];
                "style" === f2 ? sb(a2, k2) : "dangerouslySetInnerHTML" === f2 ? (k2 = k2 ? k2.__html : void 0, null != k2 && nb(a2, k2)) : "children" === f2 ? "string" === typeof k2 ? ("textarea" !== c2 || "" !== k2) && ob(a2, k2) : "number" === typeof k2 && ob(a2, "" + k2) : "suppressContentEditableWarning" !== f2 && "suppressHydrationWarning" !== f2 && "autoFocus" !== f2 && (ea.hasOwnProperty(f2) ? null != k2 && "onScroll" === f2 && D$2("scroll", a2) : null != k2 && ta(a2, f2, k2, g2));
              }
              switch (c2) {
                case "input":
                  Va(a2);
                  db(a2, d2, false);
                  break;
                case "textarea":
                  Va(a2);
                  jb(a2);
                  break;
                case "option":
                  null != d2.value && a2.setAttribute("value", "" + Sa(d2.value));
                  break;
                case "select":
                  a2.multiple = !!d2.multiple;
                  f2 = d2.value;
                  null != f2 ? fb(a2, !!d2.multiple, f2, false) : null != d2.defaultValue && fb(
                    a2,
                    !!d2.multiple,
                    d2.defaultValue,
                    true
                  );
                  break;
                default:
                  "function" === typeof e2.onClick && (a2.onclick = Bf);
              }
              switch (c2) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  d2 = !!d2.autoFocus;
                  break a;
                case "img":
                  d2 = true;
                  break a;
                default:
                  d2 = false;
              }
            }
            d2 && (b2.flags |= 4);
          }
          null !== b2.ref && (b2.flags |= 512, b2.flags |= 2097152);
        }
        S$2(b2);
        return null;
      case 6:
        if (a2 && null != b2.stateNode) Cj(a2, b2, a2.memoizedProps, d2);
        else {
          if ("string" !== typeof d2 && null === b2.stateNode) throw Error(p$3(166));
          c2 = xh(wh.current);
          xh(uh.current);
          if (Gg(b2)) {
            d2 = b2.stateNode;
            c2 = b2.memoizedProps;
            d2[Of] = b2;
            if (f2 = d2.nodeValue !== c2) {
              if (a2 = xg, null !== a2) switch (a2.tag) {
                case 3:
                  Af(d2.nodeValue, c2, 0 !== (a2.mode & 1));
                  break;
                case 5:
                  true !== a2.memoizedProps.suppressHydrationWarning && Af(d2.nodeValue, c2, 0 !== (a2.mode & 1));
              }
            }
            f2 && (b2.flags |= 4);
          } else d2 = (9 === c2.nodeType ? c2 : c2.ownerDocument).createTextNode(d2), d2[Of] = b2, b2.stateNode = d2;
        }
        S$2(b2);
        return null;
      case 13:
        E$2(L$2);
        d2 = b2.memoizedState;
        if (null === a2 || null !== a2.memoizedState && null !== a2.memoizedState.dehydrated) {
          if (I$2 && null !== yg && 0 !== (b2.mode & 1) && 0 === (b2.flags & 128)) Hg(), Ig(), b2.flags |= 98560, f2 = false;
          else if (f2 = Gg(b2), null !== d2 && null !== d2.dehydrated) {
            if (null === a2) {
              if (!f2) throw Error(p$3(318));
              f2 = b2.memoizedState;
              f2 = null !== f2 ? f2.dehydrated : null;
              if (!f2) throw Error(p$3(317));
              f2[Of] = b2;
            } else Ig(), 0 === (b2.flags & 128) && (b2.memoizedState = null), b2.flags |= 4;
            S$2(b2);
            f2 = false;
          } else null !== zg && (Fj(zg), zg = null), f2 = true;
          if (!f2) return b2.flags & 65536 ? b2 : null;
        }
        if (0 !== (b2.flags & 128)) return b2.lanes = c2, b2;
        d2 = null !== d2;
        d2 !== (null !== a2 && null !== a2.memoizedState) && d2 && (b2.child.flags |= 8192, 0 !== (b2.mode & 1) && (null === a2 || 0 !== (L$2.current & 1) ? 0 === T$2 && (T$2 = 3) : tj()));
        null !== b2.updateQueue && (b2.flags |= 4);
        S$2(b2);
        return null;
      case 4:
        return zh(), Aj(a2, b2), null === a2 && sf(b2.stateNode.containerInfo), S$2(b2), null;
      case 10:
        return ah(b2.type._context), S$2(b2), null;
      case 17:
        return Zf(b2.type) && $f(), S$2(b2), null;
      case 19:
        E$2(L$2);
        f2 = b2.memoizedState;
        if (null === f2) return S$2(b2), null;
        d2 = 0 !== (b2.flags & 128);
        g2 = f2.rendering;
        if (null === g2) if (d2) Dj(f2, false);
        else {
          if (0 !== T$2 || null !== a2 && 0 !== (a2.flags & 128)) for (a2 = b2.child; null !== a2; ) {
            g2 = Ch(a2);
            if (null !== g2) {
              b2.flags |= 128;
              Dj(f2, false);
              d2 = g2.updateQueue;
              null !== d2 && (b2.updateQueue = d2, b2.flags |= 4);
              b2.subtreeFlags = 0;
              d2 = c2;
              for (c2 = b2.child; null !== c2; ) f2 = c2, a2 = d2, f2.flags &= 14680066, g2 = f2.alternate, null === g2 ? (f2.childLanes = 0, f2.lanes = a2, f2.child = null, f2.subtreeFlags = 0, f2.memoizedProps = null, f2.memoizedState = null, f2.updateQueue = null, f2.dependencies = null, f2.stateNode = null) : (f2.childLanes = g2.childLanes, f2.lanes = g2.lanes, f2.child = g2.child, f2.subtreeFlags = 0, f2.deletions = null, f2.memoizedProps = g2.memoizedProps, f2.memoizedState = g2.memoizedState, f2.updateQueue = g2.updateQueue, f2.type = g2.type, a2 = g2.dependencies, f2.dependencies = null === a2 ? null : { lanes: a2.lanes, firstContext: a2.firstContext }), c2 = c2.sibling;
              G$2(L$2, L$2.current & 1 | 2);
              return b2.child;
            }
            a2 = a2.sibling;
          }
          null !== f2.tail && B$2() > Gj && (b2.flags |= 128, d2 = true, Dj(f2, false), b2.lanes = 4194304);
        }
        else {
          if (!d2) if (a2 = Ch(g2), null !== a2) {
            if (b2.flags |= 128, d2 = true, c2 = a2.updateQueue, null !== c2 && (b2.updateQueue = c2, b2.flags |= 4), Dj(f2, true), null === f2.tail && "hidden" === f2.tailMode && !g2.alternate && !I$2) return S$2(b2), null;
          } else 2 * B$2() - f2.renderingStartTime > Gj && 1073741824 !== c2 && (b2.flags |= 128, d2 = true, Dj(f2, false), b2.lanes = 4194304);
          f2.isBackwards ? (g2.sibling = b2.child, b2.child = g2) : (c2 = f2.last, null !== c2 ? c2.sibling = g2 : b2.child = g2, f2.last = g2);
        }
        if (null !== f2.tail) return b2 = f2.tail, f2.rendering = b2, f2.tail = b2.sibling, f2.renderingStartTime = B$2(), b2.sibling = null, c2 = L$2.current, G$2(L$2, d2 ? c2 & 1 | 2 : c2 & 1), b2;
        S$2(b2);
        return null;
      case 22:
      case 23:
        return Hj(), d2 = null !== b2.memoizedState, null !== a2 && null !== a2.memoizedState !== d2 && (b2.flags |= 8192), d2 && 0 !== (b2.mode & 1) ? 0 !== (fj & 1073741824) && (S$2(b2), b2.subtreeFlags & 6 && (b2.flags |= 8192)) : S$2(b2), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(p$3(156, b2.tag));
  }
  function Ij(a2, b2) {
    wg(b2);
    switch (b2.tag) {
      case 1:
        return Zf(b2.type) && $f(), a2 = b2.flags, a2 & 65536 ? (b2.flags = a2 & -65537 | 128, b2) : null;
      case 3:
        return zh(), E$2(Wf), E$2(H$2), Eh(), a2 = b2.flags, 0 !== (a2 & 65536) && 0 === (a2 & 128) ? (b2.flags = a2 & -65537 | 128, b2) : null;
      case 5:
        return Bh(b2), null;
      case 13:
        E$2(L$2);
        a2 = b2.memoizedState;
        if (null !== a2 && null !== a2.dehydrated) {
          if (null === b2.alternate) throw Error(p$3(340));
          Ig();
        }
        a2 = b2.flags;
        return a2 & 65536 ? (b2.flags = a2 & -65537 | 128, b2) : null;
      case 19:
        return E$2(L$2), null;
      case 4:
        return zh(), null;
      case 10:
        return ah(b2.type._context), null;
      case 22:
      case 23:
        return Hj(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Jj = false, U$2 = false, Kj = "function" === typeof WeakSet ? WeakSet : Set, V = null;
  function Lj(a2, b2) {
    var c2 = a2.ref;
    if (null !== c2) if ("function" === typeof c2) try {
      c2(null);
    } catch (d2) {
      W$2(a2, b2, d2);
    }
    else c2.current = null;
  }
  function Mj(a2, b2, c2) {
    try {
      c2();
    } catch (d2) {
      W$2(a2, b2, d2);
    }
  }
  var Nj = false;
  function Oj(a2, b2) {
    Cf = dd;
    a2 = Me$1();
    if (Ne(a2)) {
      if ("selectionStart" in a2) var c2 = { start: a2.selectionStart, end: a2.selectionEnd };
      else a: {
        c2 = (c2 = a2.ownerDocument) && c2.defaultView || window;
        var d2 = c2.getSelection && c2.getSelection();
        if (d2 && 0 !== d2.rangeCount) {
          c2 = d2.anchorNode;
          var e2 = d2.anchorOffset, f2 = d2.focusNode;
          d2 = d2.focusOffset;
          try {
            c2.nodeType, f2.nodeType;
          } catch (F2) {
            c2 = null;
            break a;
          }
          var g2 = 0, h2 = -1, k2 = -1, l2 = 0, m2 = 0, q2 = a2, r2 = null;
          b: for (; ; ) {
            for (var y2; ; ) {
              q2 !== c2 || 0 !== e2 && 3 !== q2.nodeType || (h2 = g2 + e2);
              q2 !== f2 || 0 !== d2 && 3 !== q2.nodeType || (k2 = g2 + d2);
              3 === q2.nodeType && (g2 += q2.nodeValue.length);
              if (null === (y2 = q2.firstChild)) break;
              r2 = q2;
              q2 = y2;
            }
            for (; ; ) {
              if (q2 === a2) break b;
              r2 === c2 && ++l2 === e2 && (h2 = g2);
              r2 === f2 && ++m2 === d2 && (k2 = g2);
              if (null !== (y2 = q2.nextSibling)) break;
              q2 = r2;
              r2 = q2.parentNode;
            }
            q2 = y2;
          }
          c2 = -1 === h2 || -1 === k2 ? null : { start: h2, end: k2 };
        } else c2 = null;
      }
      c2 = c2 || { start: 0, end: 0 };
    } else c2 = null;
    Df = { focusedElem: a2, selectionRange: c2 };
    dd = false;
    for (V = b2; null !== V; ) if (b2 = V, a2 = b2.child, 0 !== (b2.subtreeFlags & 1028) && null !== a2) a2.return = b2, V = a2;
    else for (; null !== V; ) {
      b2 = V;
      try {
        var n2 = b2.alternate;
        if (0 !== (b2.flags & 1024)) switch (b2.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (null !== n2) {
              var t2 = n2.memoizedProps, J2 = n2.memoizedState, x2 = b2.stateNode, w2 = x2.getSnapshotBeforeUpdate(b2.elementType === b2.type ? t2 : Ci(b2.type, t2), J2);
              x2.__reactInternalSnapshotBeforeUpdate = w2;
            }
            break;
          case 3:
            var u2 = b2.stateNode.containerInfo;
            1 === u2.nodeType ? u2.textContent = "" : 9 === u2.nodeType && u2.documentElement && u2.removeChild(u2.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(p$3(163));
        }
      } catch (F2) {
        W$2(b2, b2.return, F2);
      }
      a2 = b2.sibling;
      if (null !== a2) {
        a2.return = b2.return;
        V = a2;
        break;
      }
      V = b2.return;
    }
    n2 = Nj;
    Nj = false;
    return n2;
  }
  function Pj(a2, b2, c2) {
    var d2 = b2.updateQueue;
    d2 = null !== d2 ? d2.lastEffect : null;
    if (null !== d2) {
      var e2 = d2 = d2.next;
      do {
        if ((e2.tag & a2) === a2) {
          var f2 = e2.destroy;
          e2.destroy = void 0;
          void 0 !== f2 && Mj(b2, c2, f2);
        }
        e2 = e2.next;
      } while (e2 !== d2);
    }
  }
  function Qj(a2, b2) {
    b2 = b2.updateQueue;
    b2 = null !== b2 ? b2.lastEffect : null;
    if (null !== b2) {
      var c2 = b2 = b2.next;
      do {
        if ((c2.tag & a2) === a2) {
          var d2 = c2.create;
          c2.destroy = d2();
        }
        c2 = c2.next;
      } while (c2 !== b2);
    }
  }
  function Rj(a2) {
    var b2 = a2.ref;
    if (null !== b2) {
      var c2 = a2.stateNode;
      switch (a2.tag) {
        case 5:
          a2 = c2;
          break;
        default:
          a2 = c2;
      }
      "function" === typeof b2 ? b2(a2) : b2.current = a2;
    }
  }
  function Sj(a2) {
    var b2 = a2.alternate;
    null !== b2 && (a2.alternate = null, Sj(b2));
    a2.child = null;
    a2.deletions = null;
    a2.sibling = null;
    5 === a2.tag && (b2 = a2.stateNode, null !== b2 && (delete b2[Of], delete b2[Pf], delete b2[of], delete b2[Qf], delete b2[Rf]));
    a2.stateNode = null;
    a2.return = null;
    a2.dependencies = null;
    a2.memoizedProps = null;
    a2.memoizedState = null;
    a2.pendingProps = null;
    a2.stateNode = null;
    a2.updateQueue = null;
  }
  function Tj(a2) {
    return 5 === a2.tag || 3 === a2.tag || 4 === a2.tag;
  }
  function Uj(a2) {
    a: for (; ; ) {
      for (; null === a2.sibling; ) {
        if (null === a2.return || Tj(a2.return)) return null;
        a2 = a2.return;
      }
      a2.sibling.return = a2.return;
      for (a2 = a2.sibling; 5 !== a2.tag && 6 !== a2.tag && 18 !== a2.tag; ) {
        if (a2.flags & 2) continue a;
        if (null === a2.child || 4 === a2.tag) continue a;
        else a2.child.return = a2, a2 = a2.child;
      }
      if (!(a2.flags & 2)) return a2.stateNode;
    }
  }
  function Vj(a2, b2, c2) {
    var d2 = a2.tag;
    if (5 === d2 || 6 === d2) a2 = a2.stateNode, b2 ? 8 === c2.nodeType ? c2.parentNode.insertBefore(a2, b2) : c2.insertBefore(a2, b2) : (8 === c2.nodeType ? (b2 = c2.parentNode, b2.insertBefore(a2, c2)) : (b2 = c2, b2.appendChild(a2)), c2 = c2._reactRootContainer, null !== c2 && void 0 !== c2 || null !== b2.onclick || (b2.onclick = Bf));
    else if (4 !== d2 && (a2 = a2.child, null !== a2)) for (Vj(a2, b2, c2), a2 = a2.sibling; null !== a2; ) Vj(a2, b2, c2), a2 = a2.sibling;
  }
  function Wj(a2, b2, c2) {
    var d2 = a2.tag;
    if (5 === d2 || 6 === d2) a2 = a2.stateNode, b2 ? c2.insertBefore(a2, b2) : c2.appendChild(a2);
    else if (4 !== d2 && (a2 = a2.child, null !== a2)) for (Wj(a2, b2, c2), a2 = a2.sibling; null !== a2; ) Wj(a2, b2, c2), a2 = a2.sibling;
  }
  var X$1 = null, Xj = false;
  function Yj(a2, b2, c2) {
    for (c2 = c2.child; null !== c2; ) Zj(a2, b2, c2), c2 = c2.sibling;
  }
  function Zj(a2, b2, c2) {
    if (lc && "function" === typeof lc.onCommitFiberUnmount) try {
      lc.onCommitFiberUnmount(kc, c2);
    } catch (h2) {
    }
    switch (c2.tag) {
      case 5:
        U$2 || Lj(c2, b2);
      case 6:
        var d2 = X$1, e2 = Xj;
        X$1 = null;
        Yj(a2, b2, c2);
        X$1 = d2;
        Xj = e2;
        null !== X$1 && (Xj ? (a2 = X$1, c2 = c2.stateNode, 8 === a2.nodeType ? a2.parentNode.removeChild(c2) : a2.removeChild(c2)) : X$1.removeChild(c2.stateNode));
        break;
      case 18:
        null !== X$1 && (Xj ? (a2 = X$1, c2 = c2.stateNode, 8 === a2.nodeType ? Kf(a2.parentNode, c2) : 1 === a2.nodeType && Kf(a2, c2), bd(a2)) : Kf(X$1, c2.stateNode));
        break;
      case 4:
        d2 = X$1;
        e2 = Xj;
        X$1 = c2.stateNode.containerInfo;
        Xj = true;
        Yj(a2, b2, c2);
        X$1 = d2;
        Xj = e2;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!U$2 && (d2 = c2.updateQueue, null !== d2 && (d2 = d2.lastEffect, null !== d2))) {
          e2 = d2 = d2.next;
          do {
            var f2 = e2, g2 = f2.destroy;
            f2 = f2.tag;
            void 0 !== g2 && (0 !== (f2 & 2) ? Mj(c2, b2, g2) : 0 !== (f2 & 4) && Mj(c2, b2, g2));
            e2 = e2.next;
          } while (e2 !== d2);
        }
        Yj(a2, b2, c2);
        break;
      case 1:
        if (!U$2 && (Lj(c2, b2), d2 = c2.stateNode, "function" === typeof d2.componentWillUnmount)) try {
          d2.props = c2.memoizedProps, d2.state = c2.memoizedState, d2.componentWillUnmount();
        } catch (h2) {
          W$2(c2, b2, h2);
        }
        Yj(a2, b2, c2);
        break;
      case 21:
        Yj(a2, b2, c2);
        break;
      case 22:
        c2.mode & 1 ? (U$2 = (d2 = U$2) || null !== c2.memoizedState, Yj(a2, b2, c2), U$2 = d2) : Yj(a2, b2, c2);
        break;
      default:
        Yj(a2, b2, c2);
    }
  }
  function ak(a2) {
    var b2 = a2.updateQueue;
    if (null !== b2) {
      a2.updateQueue = null;
      var c2 = a2.stateNode;
      null === c2 && (c2 = a2.stateNode = new Kj());
      b2.forEach(function(b3) {
        var d2 = bk.bind(null, a2, b3);
        c2.has(b3) || (c2.add(b3), b3.then(d2, d2));
      });
    }
  }
  function ck(a2, b2) {
    var c2 = b2.deletions;
    if (null !== c2) for (var d2 = 0; d2 < c2.length; d2++) {
      var e2 = c2[d2];
      try {
        var f2 = a2, g2 = b2, h2 = g2;
        a: for (; null !== h2; ) {
          switch (h2.tag) {
            case 5:
              X$1 = h2.stateNode;
              Xj = false;
              break a;
            case 3:
              X$1 = h2.stateNode.containerInfo;
              Xj = true;
              break a;
            case 4:
              X$1 = h2.stateNode.containerInfo;
              Xj = true;
              break a;
          }
          h2 = h2.return;
        }
        if (null === X$1) throw Error(p$3(160));
        Zj(f2, g2, e2);
        X$1 = null;
        Xj = false;
        var k2 = e2.alternate;
        null !== k2 && (k2.return = null);
        e2.return = null;
      } catch (l2) {
        W$2(e2, b2, l2);
      }
    }
    if (b2.subtreeFlags & 12854) for (b2 = b2.child; null !== b2; ) dk(b2, a2), b2 = b2.sibling;
  }
  function dk(a2, b2) {
    var c2 = a2.alternate, d2 = a2.flags;
    switch (a2.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        ck(b2, a2);
        ek(a2);
        if (d2 & 4) {
          try {
            Pj(3, a2, a2.return), Qj(3, a2);
          } catch (t2) {
            W$2(a2, a2.return, t2);
          }
          try {
            Pj(5, a2, a2.return);
          } catch (t2) {
            W$2(a2, a2.return, t2);
          }
        }
        break;
      case 1:
        ck(b2, a2);
        ek(a2);
        d2 & 512 && null !== c2 && Lj(c2, c2.return);
        break;
      case 5:
        ck(b2, a2);
        ek(a2);
        d2 & 512 && null !== c2 && Lj(c2, c2.return);
        if (a2.flags & 32) {
          var e2 = a2.stateNode;
          try {
            ob(e2, "");
          } catch (t2) {
            W$2(a2, a2.return, t2);
          }
        }
        if (d2 & 4 && (e2 = a2.stateNode, null != e2)) {
          var f2 = a2.memoizedProps, g2 = null !== c2 ? c2.memoizedProps : f2, h2 = a2.type, k2 = a2.updateQueue;
          a2.updateQueue = null;
          if (null !== k2) try {
            "input" === h2 && "radio" === f2.type && null != f2.name && ab(e2, f2);
            vb(h2, g2);
            var l2 = vb(h2, f2);
            for (g2 = 0; g2 < k2.length; g2 += 2) {
              var m2 = k2[g2], q2 = k2[g2 + 1];
              "style" === m2 ? sb(e2, q2) : "dangerouslySetInnerHTML" === m2 ? nb(e2, q2) : "children" === m2 ? ob(e2, q2) : ta(e2, m2, q2, l2);
            }
            switch (h2) {
              case "input":
                bb(e2, f2);
                break;
              case "textarea":
                ib(e2, f2);
                break;
              case "select":
                var r2 = e2._wrapperState.wasMultiple;
                e2._wrapperState.wasMultiple = !!f2.multiple;
                var y2 = f2.value;
                null != y2 ? fb(e2, !!f2.multiple, y2, false) : r2 !== !!f2.multiple && (null != f2.defaultValue ? fb(
                  e2,
                  !!f2.multiple,
                  f2.defaultValue,
                  true
                ) : fb(e2, !!f2.multiple, f2.multiple ? [] : "", false));
            }
            e2[Pf] = f2;
          } catch (t2) {
            W$2(a2, a2.return, t2);
          }
        }
        break;
      case 6:
        ck(b2, a2);
        ek(a2);
        if (d2 & 4) {
          if (null === a2.stateNode) throw Error(p$3(162));
          e2 = a2.stateNode;
          f2 = a2.memoizedProps;
          try {
            e2.nodeValue = f2;
          } catch (t2) {
            W$2(a2, a2.return, t2);
          }
        }
        break;
      case 3:
        ck(b2, a2);
        ek(a2);
        if (d2 & 4 && null !== c2 && c2.memoizedState.isDehydrated) try {
          bd(b2.containerInfo);
        } catch (t2) {
          W$2(a2, a2.return, t2);
        }
        break;
      case 4:
        ck(b2, a2);
        ek(a2);
        break;
      case 13:
        ck(b2, a2);
        ek(a2);
        e2 = a2.child;
        e2.flags & 8192 && (f2 = null !== e2.memoizedState, e2.stateNode.isHidden = f2, !f2 || null !== e2.alternate && null !== e2.alternate.memoizedState || (fk = B$2()));
        d2 & 4 && ak(a2);
        break;
      case 22:
        m2 = null !== c2 && null !== c2.memoizedState;
        a2.mode & 1 ? (U$2 = (l2 = U$2) || m2, ck(b2, a2), U$2 = l2) : ck(b2, a2);
        ek(a2);
        if (d2 & 8192) {
          l2 = null !== a2.memoizedState;
          if ((a2.stateNode.isHidden = l2) && !m2 && 0 !== (a2.mode & 1)) for (V = a2, m2 = a2.child; null !== m2; ) {
            for (q2 = V = m2; null !== V; ) {
              r2 = V;
              y2 = r2.child;
              switch (r2.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Pj(4, r2, r2.return);
                  break;
                case 1:
                  Lj(r2, r2.return);
                  var n2 = r2.stateNode;
                  if ("function" === typeof n2.componentWillUnmount) {
                    d2 = r2;
                    c2 = r2.return;
                    try {
                      b2 = d2, n2.props = b2.memoizedProps, n2.state = b2.memoizedState, n2.componentWillUnmount();
                    } catch (t2) {
                      W$2(d2, c2, t2);
                    }
                  }
                  break;
                case 5:
                  Lj(r2, r2.return);
                  break;
                case 22:
                  if (null !== r2.memoizedState) {
                    gk(q2);
                    continue;
                  }
              }
              null !== y2 ? (y2.return = r2, V = y2) : gk(q2);
            }
            m2 = m2.sibling;
          }
          a: for (m2 = null, q2 = a2; ; ) {
            if (5 === q2.tag) {
              if (null === m2) {
                m2 = q2;
                try {
                  e2 = q2.stateNode, l2 ? (f2 = e2.style, "function" === typeof f2.setProperty ? f2.setProperty("display", "none", "important") : f2.display = "none") : (h2 = q2.stateNode, k2 = q2.memoizedProps.style, g2 = void 0 !== k2 && null !== k2 && k2.hasOwnProperty("display") ? k2.display : null, h2.style.display = rb("display", g2));
                } catch (t2) {
                  W$2(a2, a2.return, t2);
                }
              }
            } else if (6 === q2.tag) {
              if (null === m2) try {
                q2.stateNode.nodeValue = l2 ? "" : q2.memoizedProps;
              } catch (t2) {
                W$2(a2, a2.return, t2);
              }
            } else if ((22 !== q2.tag && 23 !== q2.tag || null === q2.memoizedState || q2 === a2) && null !== q2.child) {
              q2.child.return = q2;
              q2 = q2.child;
              continue;
            }
            if (q2 === a2) break a;
            for (; null === q2.sibling; ) {
              if (null === q2.return || q2.return === a2) break a;
              m2 === q2 && (m2 = null);
              q2 = q2.return;
            }
            m2 === q2 && (m2 = null);
            q2.sibling.return = q2.return;
            q2 = q2.sibling;
          }
        }
        break;
      case 19:
        ck(b2, a2);
        ek(a2);
        d2 & 4 && ak(a2);
        break;
      case 21:
        break;
      default:
        ck(
          b2,
          a2
        ), ek(a2);
    }
  }
  function ek(a2) {
    var b2 = a2.flags;
    if (b2 & 2) {
      try {
        a: {
          for (var c2 = a2.return; null !== c2; ) {
            if (Tj(c2)) {
              var d2 = c2;
              break a;
            }
            c2 = c2.return;
          }
          throw Error(p$3(160));
        }
        switch (d2.tag) {
          case 5:
            var e2 = d2.stateNode;
            d2.flags & 32 && (ob(e2, ""), d2.flags &= -33);
            var f2 = Uj(a2);
            Wj(a2, f2, e2);
            break;
          case 3:
          case 4:
            var g2 = d2.stateNode.containerInfo, h2 = Uj(a2);
            Vj(a2, h2, g2);
            break;
          default:
            throw Error(p$3(161));
        }
      } catch (k2) {
        W$2(a2, a2.return, k2);
      }
      a2.flags &= -3;
    }
    b2 & 4096 && (a2.flags &= -4097);
  }
  function hk(a2, b2, c2) {
    V = a2;
    ik(a2);
  }
  function ik(a2, b2, c2) {
    for (var d2 = 0 !== (a2.mode & 1); null !== V; ) {
      var e2 = V, f2 = e2.child;
      if (22 === e2.tag && d2) {
        var g2 = null !== e2.memoizedState || Jj;
        if (!g2) {
          var h2 = e2.alternate, k2 = null !== h2 && null !== h2.memoizedState || U$2;
          h2 = Jj;
          var l2 = U$2;
          Jj = g2;
          if ((U$2 = k2) && !l2) for (V = e2; null !== V; ) g2 = V, k2 = g2.child, 22 === g2.tag && null !== g2.memoizedState ? jk(e2) : null !== k2 ? (k2.return = g2, V = k2) : jk(e2);
          for (; null !== f2; ) V = f2, ik(f2), f2 = f2.sibling;
          V = e2;
          Jj = h2;
          U$2 = l2;
        }
        kk(a2);
      } else 0 !== (e2.subtreeFlags & 8772) && null !== f2 ? (f2.return = e2, V = f2) : kk(a2);
    }
  }
  function kk(a2) {
    for (; null !== V; ) {
      var b2 = V;
      if (0 !== (b2.flags & 8772)) {
        var c2 = b2.alternate;
        try {
          if (0 !== (b2.flags & 8772)) switch (b2.tag) {
            case 0:
            case 11:
            case 15:
              U$2 || Qj(5, b2);
              break;
            case 1:
              var d2 = b2.stateNode;
              if (b2.flags & 4 && !U$2) if (null === c2) d2.componentDidMount();
              else {
                var e2 = b2.elementType === b2.type ? c2.memoizedProps : Ci(b2.type, c2.memoizedProps);
                d2.componentDidUpdate(e2, c2.memoizedState, d2.__reactInternalSnapshotBeforeUpdate);
              }
              var f2 = b2.updateQueue;
              null !== f2 && sh(b2, f2, d2);
              break;
            case 3:
              var g2 = b2.updateQueue;
              if (null !== g2) {
                c2 = null;
                if (null !== b2.child) switch (b2.child.tag) {
                  case 5:
                    c2 = b2.child.stateNode;
                    break;
                  case 1:
                    c2 = b2.child.stateNode;
                }
                sh(b2, g2, c2);
              }
              break;
            case 5:
              var h2 = b2.stateNode;
              if (null === c2 && b2.flags & 4) {
                c2 = h2;
                var k2 = b2.memoizedProps;
                switch (b2.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    k2.autoFocus && c2.focus();
                    break;
                  case "img":
                    k2.src && (c2.src = k2.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (null === b2.memoizedState) {
                var l2 = b2.alternate;
                if (null !== l2) {
                  var m2 = l2.memoizedState;
                  if (null !== m2) {
                    var q2 = m2.dehydrated;
                    null !== q2 && bd(q2);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(p$3(163));
          }
          U$2 || b2.flags & 512 && Rj(b2);
        } catch (r2) {
          W$2(b2, b2.return, r2);
        }
      }
      if (b2 === a2) {
        V = null;
        break;
      }
      c2 = b2.sibling;
      if (null !== c2) {
        c2.return = b2.return;
        V = c2;
        break;
      }
      V = b2.return;
    }
  }
  function gk(a2) {
    for (; null !== V; ) {
      var b2 = V;
      if (b2 === a2) {
        V = null;
        break;
      }
      var c2 = b2.sibling;
      if (null !== c2) {
        c2.return = b2.return;
        V = c2;
        break;
      }
      V = b2.return;
    }
  }
  function jk(a2) {
    for (; null !== V; ) {
      var b2 = V;
      try {
        switch (b2.tag) {
          case 0:
          case 11:
          case 15:
            var c2 = b2.return;
            try {
              Qj(4, b2);
            } catch (k2) {
              W$2(b2, c2, k2);
            }
            break;
          case 1:
            var d2 = b2.stateNode;
            if ("function" === typeof d2.componentDidMount) {
              var e2 = b2.return;
              try {
                d2.componentDidMount();
              } catch (k2) {
                W$2(b2, e2, k2);
              }
            }
            var f2 = b2.return;
            try {
              Rj(b2);
            } catch (k2) {
              W$2(b2, f2, k2);
            }
            break;
          case 5:
            var g2 = b2.return;
            try {
              Rj(b2);
            } catch (k2) {
              W$2(b2, g2, k2);
            }
        }
      } catch (k2) {
        W$2(b2, b2.return, k2);
      }
      if (b2 === a2) {
        V = null;
        break;
      }
      var h2 = b2.sibling;
      if (null !== h2) {
        h2.return = b2.return;
        V = h2;
        break;
      }
      V = b2.return;
    }
  }
  var lk = Math.ceil, mk = ua.ReactCurrentDispatcher, nk = ua.ReactCurrentOwner, ok = ua.ReactCurrentBatchConfig, K$2 = 0, Q$1 = null, Y$2 = null, Z$2 = 0, fj = 0, ej = Uf(0), T$2 = 0, pk = null, rh = 0, qk = 0, rk = 0, sk = null, tk = null, fk = 0, Gj = Infinity, uk = null, Oi = false, Pi = null, Ri = null, vk = false, wk = null, xk = 0, yk = 0, zk = null, Ak = -1, Bk = 0;
  function R$2() {
    return 0 !== (K$2 & 6) ? B$2() : -1 !== Ak ? Ak : Ak = B$2();
  }
  function yi(a2) {
    if (0 === (a2.mode & 1)) return 1;
    if (0 !== (K$2 & 2) && 0 !== Z$2) return Z$2 & -Z$2;
    if (null !== Kg.transition) return 0 === Bk && (Bk = yc()), Bk;
    a2 = C$2;
    if (0 !== a2) return a2;
    a2 = window.event;
    a2 = void 0 === a2 ? 16 : jd(a2.type);
    return a2;
  }
  function gi(a2, b2, c2, d2) {
    if (50 < yk) throw yk = 0, zk = null, Error(p$3(185));
    Ac(a2, c2, d2);
    if (0 === (K$2 & 2) || a2 !== Q$1) a2 === Q$1 && (0 === (K$2 & 2) && (qk |= c2), 4 === T$2 && Ck(a2, Z$2)), Dk(a2, d2), 1 === c2 && 0 === K$2 && 0 === (b2.mode & 1) && (Gj = B$2() + 500, fg && jg());
  }
  function Dk(a2, b2) {
    var c2 = a2.callbackNode;
    wc(a2, b2);
    var d2 = uc(a2, a2 === Q$1 ? Z$2 : 0);
    if (0 === d2) null !== c2 && bc(c2), a2.callbackNode = null, a2.callbackPriority = 0;
    else if (b2 = d2 & -d2, a2.callbackPriority !== b2) {
      null != c2 && bc(c2);
      if (1 === b2) 0 === a2.tag ? ig(Ek.bind(null, a2)) : hg(Ek.bind(null, a2)), Jf(function() {
        0 === (K$2 & 6) && jg();
      }), c2 = null;
      else {
        switch (Dc(d2)) {
          case 1:
            c2 = fc;
            break;
          case 4:
            c2 = gc;
            break;
          case 16:
            c2 = hc;
            break;
          case 536870912:
            c2 = jc;
            break;
          default:
            c2 = hc;
        }
        c2 = Fk(c2, Gk.bind(null, a2));
      }
      a2.callbackPriority = b2;
      a2.callbackNode = c2;
    }
  }
  function Gk(a2, b2) {
    Ak = -1;
    Bk = 0;
    if (0 !== (K$2 & 6)) throw Error(p$3(327));
    var c2 = a2.callbackNode;
    if (Hk() && a2.callbackNode !== c2) return null;
    var d2 = uc(a2, a2 === Q$1 ? Z$2 : 0);
    if (0 === d2) return null;
    if (0 !== (d2 & 30) || 0 !== (d2 & a2.expiredLanes) || b2) b2 = Ik(a2, d2);
    else {
      b2 = d2;
      var e2 = K$2;
      K$2 |= 2;
      var f2 = Jk();
      if (Q$1 !== a2 || Z$2 !== b2) uk = null, Gj = B$2() + 500, Kk(a2, b2);
      do
        try {
          Lk();
          break;
        } catch (h2) {
          Mk(a2, h2);
        }
      while (1);
      $g();
      mk.current = f2;
      K$2 = e2;
      null !== Y$2 ? b2 = 0 : (Q$1 = null, Z$2 = 0, b2 = T$2);
    }
    if (0 !== b2) {
      2 === b2 && (e2 = xc(a2), 0 !== e2 && (d2 = e2, b2 = Nk(a2, e2)));
      if (1 === b2) throw c2 = pk, Kk(a2, 0), Ck(a2, d2), Dk(a2, B$2()), c2;
      if (6 === b2) Ck(a2, d2);
      else {
        e2 = a2.current.alternate;
        if (0 === (d2 & 30) && !Ok(e2) && (b2 = Ik(a2, d2), 2 === b2 && (f2 = xc(a2), 0 !== f2 && (d2 = f2, b2 = Nk(a2, f2))), 1 === b2)) throw c2 = pk, Kk(a2, 0), Ck(a2, d2), Dk(a2, B$2()), c2;
        a2.finishedWork = e2;
        a2.finishedLanes = d2;
        switch (b2) {
          case 0:
          case 1:
            throw Error(p$3(345));
          case 2:
            Pk(a2, tk, uk);
            break;
          case 3:
            Ck(a2, d2);
            if ((d2 & 130023424) === d2 && (b2 = fk + 500 - B$2(), 10 < b2)) {
              if (0 !== uc(a2, 0)) break;
              e2 = a2.suspendedLanes;
              if ((e2 & d2) !== d2) {
                R$2();
                a2.pingedLanes |= a2.suspendedLanes & e2;
                break;
              }
              a2.timeoutHandle = Ff(Pk.bind(null, a2, tk, uk), b2);
              break;
            }
            Pk(a2, tk, uk);
            break;
          case 4:
            Ck(a2, d2);
            if ((d2 & 4194240) === d2) break;
            b2 = a2.eventTimes;
            for (e2 = -1; 0 < d2; ) {
              var g2 = 31 - oc(d2);
              f2 = 1 << g2;
              g2 = b2[g2];
              g2 > e2 && (e2 = g2);
              d2 &= ~f2;
            }
            d2 = e2;
            d2 = B$2() - d2;
            d2 = (120 > d2 ? 120 : 480 > d2 ? 480 : 1080 > d2 ? 1080 : 1920 > d2 ? 1920 : 3e3 > d2 ? 3e3 : 4320 > d2 ? 4320 : 1960 * lk(d2 / 1960)) - d2;
            if (10 < d2) {
              a2.timeoutHandle = Ff(Pk.bind(null, a2, tk, uk), d2);
              break;
            }
            Pk(a2, tk, uk);
            break;
          case 5:
            Pk(a2, tk, uk);
            break;
          default:
            throw Error(p$3(329));
        }
      }
    }
    Dk(a2, B$2());
    return a2.callbackNode === c2 ? Gk.bind(null, a2) : null;
  }
  function Nk(a2, b2) {
    var c2 = sk;
    a2.current.memoizedState.isDehydrated && (Kk(a2, b2).flags |= 256);
    a2 = Ik(a2, b2);
    2 !== a2 && (b2 = tk, tk = c2, null !== b2 && Fj(b2));
    return a2;
  }
  function Fj(a2) {
    null === tk ? tk = a2 : tk.push.apply(tk, a2);
  }
  function Ok(a2) {
    for (var b2 = a2; ; ) {
      if (b2.flags & 16384) {
        var c2 = b2.updateQueue;
        if (null !== c2 && (c2 = c2.stores, null !== c2)) for (var d2 = 0; d2 < c2.length; d2++) {
          var e2 = c2[d2], f2 = e2.getSnapshot;
          e2 = e2.value;
          try {
            if (!He$1(f2(), e2)) return false;
          } catch (g2) {
            return false;
          }
        }
      }
      c2 = b2.child;
      if (b2.subtreeFlags & 16384 && null !== c2) c2.return = b2, b2 = c2;
      else {
        if (b2 === a2) break;
        for (; null === b2.sibling; ) {
          if (null === b2.return || b2.return === a2) return true;
          b2 = b2.return;
        }
        b2.sibling.return = b2.return;
        b2 = b2.sibling;
      }
    }
    return true;
  }
  function Ck(a2, b2) {
    b2 &= ~rk;
    b2 &= ~qk;
    a2.suspendedLanes |= b2;
    a2.pingedLanes &= ~b2;
    for (a2 = a2.expirationTimes; 0 < b2; ) {
      var c2 = 31 - oc(b2), d2 = 1 << c2;
      a2[c2] = -1;
      b2 &= ~d2;
    }
  }
  function Ek(a2) {
    if (0 !== (K$2 & 6)) throw Error(p$3(327));
    Hk();
    var b2 = uc(a2, 0);
    if (0 === (b2 & 1)) return Dk(a2, B$2()), null;
    var c2 = Ik(a2, b2);
    if (0 !== a2.tag && 2 === c2) {
      var d2 = xc(a2);
      0 !== d2 && (b2 = d2, c2 = Nk(a2, d2));
    }
    if (1 === c2) throw c2 = pk, Kk(a2, 0), Ck(a2, b2), Dk(a2, B$2()), c2;
    if (6 === c2) throw Error(p$3(345));
    a2.finishedWork = a2.current.alternate;
    a2.finishedLanes = b2;
    Pk(a2, tk, uk);
    Dk(a2, B$2());
    return null;
  }
  function Qk(a2, b2) {
    var c2 = K$2;
    K$2 |= 1;
    try {
      return a2(b2);
    } finally {
      K$2 = c2, 0 === K$2 && (Gj = B$2() + 500, fg && jg());
    }
  }
  function Rk(a2) {
    null !== wk && 0 === wk.tag && 0 === (K$2 & 6) && Hk();
    var b2 = K$2;
    K$2 |= 1;
    var c2 = ok.transition, d2 = C$2;
    try {
      if (ok.transition = null, C$2 = 1, a2) return a2();
    } finally {
      C$2 = d2, ok.transition = c2, K$2 = b2, 0 === (K$2 & 6) && jg();
    }
  }
  function Hj() {
    fj = ej.current;
    E$2(ej);
  }
  function Kk(a2, b2) {
    a2.finishedWork = null;
    a2.finishedLanes = 0;
    var c2 = a2.timeoutHandle;
    -1 !== c2 && (a2.timeoutHandle = -1, Gf(c2));
    if (null !== Y$2) for (c2 = Y$2.return; null !== c2; ) {
      var d2 = c2;
      wg(d2);
      switch (d2.tag) {
        case 1:
          d2 = d2.type.childContextTypes;
          null !== d2 && void 0 !== d2 && $f();
          break;
        case 3:
          zh();
          E$2(Wf);
          E$2(H$2);
          Eh();
          break;
        case 5:
          Bh(d2);
          break;
        case 4:
          zh();
          break;
        case 13:
          E$2(L$2);
          break;
        case 19:
          E$2(L$2);
          break;
        case 10:
          ah(d2.type._context);
          break;
        case 22:
        case 23:
          Hj();
      }
      c2 = c2.return;
    }
    Q$1 = a2;
    Y$2 = a2 = Pg(a2.current, null);
    Z$2 = fj = b2;
    T$2 = 0;
    pk = null;
    rk = qk = rh = 0;
    tk = sk = null;
    if (null !== fh) {
      for (b2 = 0; b2 < fh.length; b2++) if (c2 = fh[b2], d2 = c2.interleaved, null !== d2) {
        c2.interleaved = null;
        var e2 = d2.next, f2 = c2.pending;
        if (null !== f2) {
          var g2 = f2.next;
          f2.next = e2;
          d2.next = g2;
        }
        c2.pending = d2;
      }
      fh = null;
    }
    return a2;
  }
  function Mk(a2, b2) {
    do {
      var c2 = Y$2;
      try {
        $g();
        Fh.current = Rh;
        if (Ih) {
          for (var d2 = M$2.memoizedState; null !== d2; ) {
            var e2 = d2.queue;
            null !== e2 && (e2.pending = null);
            d2 = d2.next;
          }
          Ih = false;
        }
        Hh = 0;
        O$1 = N$2 = M$2 = null;
        Jh = false;
        Kh = 0;
        nk.current = null;
        if (null === c2 || null === c2.return) {
          T$2 = 1;
          pk = b2;
          Y$2 = null;
          break;
        }
        a: {
          var f2 = a2, g2 = c2.return, h2 = c2, k2 = b2;
          b2 = Z$2;
          h2.flags |= 32768;
          if (null !== k2 && "object" === typeof k2 && "function" === typeof k2.then) {
            var l2 = k2, m2 = h2, q2 = m2.tag;
            if (0 === (m2.mode & 1) && (0 === q2 || 11 === q2 || 15 === q2)) {
              var r2 = m2.alternate;
              r2 ? (m2.updateQueue = r2.updateQueue, m2.memoizedState = r2.memoizedState, m2.lanes = r2.lanes) : (m2.updateQueue = null, m2.memoizedState = null);
            }
            var y2 = Ui(g2);
            if (null !== y2) {
              y2.flags &= -257;
              Vi(y2, g2, h2, f2, b2);
              y2.mode & 1 && Si(f2, l2, b2);
              b2 = y2;
              k2 = l2;
              var n2 = b2.updateQueue;
              if (null === n2) {
                var t2 = /* @__PURE__ */ new Set();
                t2.add(k2);
                b2.updateQueue = t2;
              } else n2.add(k2);
              break a;
            } else {
              if (0 === (b2 & 1)) {
                Si(f2, l2, b2);
                tj();
                break a;
              }
              k2 = Error(p$3(426));
            }
          } else if (I$2 && h2.mode & 1) {
            var J2 = Ui(g2);
            if (null !== J2) {
              0 === (J2.flags & 65536) && (J2.flags |= 256);
              Vi(J2, g2, h2, f2, b2);
              Jg(Ji(k2, h2));
              break a;
            }
          }
          f2 = k2 = Ji(k2, h2);
          4 !== T$2 && (T$2 = 2);
          null === sk ? sk = [f2] : sk.push(f2);
          f2 = g2;
          do {
            switch (f2.tag) {
              case 3:
                f2.flags |= 65536;
                b2 &= -b2;
                f2.lanes |= b2;
                var x2 = Ni(f2, k2, b2);
                ph(f2, x2);
                break a;
              case 1:
                h2 = k2;
                var w2 = f2.type, u2 = f2.stateNode;
                if (0 === (f2.flags & 128) && ("function" === typeof w2.getDerivedStateFromError || null !== u2 && "function" === typeof u2.componentDidCatch && (null === Ri || !Ri.has(u2)))) {
                  f2.flags |= 65536;
                  b2 &= -b2;
                  f2.lanes |= b2;
                  var F2 = Qi(f2, h2, b2);
                  ph(f2, F2);
                  break a;
                }
            }
            f2 = f2.return;
          } while (null !== f2);
        }
        Sk(c2);
      } catch (na) {
        b2 = na;
        Y$2 === c2 && null !== c2 && (Y$2 = c2 = c2.return);
        continue;
      }
      break;
    } while (1);
  }
  function Jk() {
    var a2 = mk.current;
    mk.current = Rh;
    return null === a2 ? Rh : a2;
  }
  function tj() {
    if (0 === T$2 || 3 === T$2 || 2 === T$2) T$2 = 4;
    null === Q$1 || 0 === (rh & 268435455) && 0 === (qk & 268435455) || Ck(Q$1, Z$2);
  }
  function Ik(a2, b2) {
    var c2 = K$2;
    K$2 |= 2;
    var d2 = Jk();
    if (Q$1 !== a2 || Z$2 !== b2) uk = null, Kk(a2, b2);
    do
      try {
        Tk();
        break;
      } catch (e2) {
        Mk(a2, e2);
      }
    while (1);
    $g();
    K$2 = c2;
    mk.current = d2;
    if (null !== Y$2) throw Error(p$3(261));
    Q$1 = null;
    Z$2 = 0;
    return T$2;
  }
  function Tk() {
    for (; null !== Y$2; ) Uk(Y$2);
  }
  function Lk() {
    for (; null !== Y$2 && !cc(); ) Uk(Y$2);
  }
  function Uk(a2) {
    var b2 = Vk(a2.alternate, a2, fj);
    a2.memoizedProps = a2.pendingProps;
    null === b2 ? Sk(a2) : Y$2 = b2;
    nk.current = null;
  }
  function Sk(a2) {
    var b2 = a2;
    do {
      var c2 = b2.alternate;
      a2 = b2.return;
      if (0 === (b2.flags & 32768)) {
        if (c2 = Ej(c2, b2, fj), null !== c2) {
          Y$2 = c2;
          return;
        }
      } else {
        c2 = Ij(c2, b2);
        if (null !== c2) {
          c2.flags &= 32767;
          Y$2 = c2;
          return;
        }
        if (null !== a2) a2.flags |= 32768, a2.subtreeFlags = 0, a2.deletions = null;
        else {
          T$2 = 6;
          Y$2 = null;
          return;
        }
      }
      b2 = b2.sibling;
      if (null !== b2) {
        Y$2 = b2;
        return;
      }
      Y$2 = b2 = a2;
    } while (null !== b2);
    0 === T$2 && (T$2 = 5);
  }
  function Pk(a2, b2, c2) {
    var d2 = C$2, e2 = ok.transition;
    try {
      ok.transition = null, C$2 = 1, Wk(a2, b2, c2, d2);
    } finally {
      ok.transition = e2, C$2 = d2;
    }
    return null;
  }
  function Wk(a2, b2, c2, d2) {
    do
      Hk();
    while (null !== wk);
    if (0 !== (K$2 & 6)) throw Error(p$3(327));
    c2 = a2.finishedWork;
    var e2 = a2.finishedLanes;
    if (null === c2) return null;
    a2.finishedWork = null;
    a2.finishedLanes = 0;
    if (c2 === a2.current) throw Error(p$3(177));
    a2.callbackNode = null;
    a2.callbackPriority = 0;
    var f2 = c2.lanes | c2.childLanes;
    Bc(a2, f2);
    a2 === Q$1 && (Y$2 = Q$1 = null, Z$2 = 0);
    0 === (c2.subtreeFlags & 2064) && 0 === (c2.flags & 2064) || vk || (vk = true, Fk(hc, function() {
      Hk();
      return null;
    }));
    f2 = 0 !== (c2.flags & 15990);
    if (0 !== (c2.subtreeFlags & 15990) || f2) {
      f2 = ok.transition;
      ok.transition = null;
      var g2 = C$2;
      C$2 = 1;
      var h2 = K$2;
      K$2 |= 4;
      nk.current = null;
      Oj(a2, c2);
      dk(c2, a2);
      Oe$1(Df);
      dd = !!Cf;
      Df = Cf = null;
      a2.current = c2;
      hk(c2);
      dc();
      K$2 = h2;
      C$2 = g2;
      ok.transition = f2;
    } else a2.current = c2;
    vk && (vk = false, wk = a2, xk = e2);
    f2 = a2.pendingLanes;
    0 === f2 && (Ri = null);
    mc(c2.stateNode);
    Dk(a2, B$2());
    if (null !== b2) for (d2 = a2.onRecoverableError, c2 = 0; c2 < b2.length; c2++) e2 = b2[c2], d2(e2.value, { componentStack: e2.stack, digest: e2.digest });
    if (Oi) throw Oi = false, a2 = Pi, Pi = null, a2;
    0 !== (xk & 1) && 0 !== a2.tag && Hk();
    f2 = a2.pendingLanes;
    0 !== (f2 & 1) ? a2 === zk ? yk++ : (yk = 0, zk = a2) : yk = 0;
    jg();
    return null;
  }
  function Hk() {
    if (null !== wk) {
      var a2 = Dc(xk), b2 = ok.transition, c2 = C$2;
      try {
        ok.transition = null;
        C$2 = 16 > a2 ? 16 : a2;
        if (null === wk) var d2 = false;
        else {
          a2 = wk;
          wk = null;
          xk = 0;
          if (0 !== (K$2 & 6)) throw Error(p$3(331));
          var e2 = K$2;
          K$2 |= 4;
          for (V = a2.current; null !== V; ) {
            var f2 = V, g2 = f2.child;
            if (0 !== (V.flags & 16)) {
              var h2 = f2.deletions;
              if (null !== h2) {
                for (var k2 = 0; k2 < h2.length; k2++) {
                  var l2 = h2[k2];
                  for (V = l2; null !== V; ) {
                    var m2 = V;
                    switch (m2.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Pj(8, m2, f2);
                    }
                    var q2 = m2.child;
                    if (null !== q2) q2.return = m2, V = q2;
                    else for (; null !== V; ) {
                      m2 = V;
                      var r2 = m2.sibling, y2 = m2.return;
                      Sj(m2);
                      if (m2 === l2) {
                        V = null;
                        break;
                      }
                      if (null !== r2) {
                        r2.return = y2;
                        V = r2;
                        break;
                      }
                      V = y2;
                    }
                  }
                }
                var n2 = f2.alternate;
                if (null !== n2) {
                  var t2 = n2.child;
                  if (null !== t2) {
                    n2.child = null;
                    do {
                      var J2 = t2.sibling;
                      t2.sibling = null;
                      t2 = J2;
                    } while (null !== t2);
                  }
                }
                V = f2;
              }
            }
            if (0 !== (f2.subtreeFlags & 2064) && null !== g2) g2.return = f2, V = g2;
            else b: for (; null !== V; ) {
              f2 = V;
              if (0 !== (f2.flags & 2048)) switch (f2.tag) {
                case 0:
                case 11:
                case 15:
                  Pj(9, f2, f2.return);
              }
              var x2 = f2.sibling;
              if (null !== x2) {
                x2.return = f2.return;
                V = x2;
                break b;
              }
              V = f2.return;
            }
          }
          var w2 = a2.current;
          for (V = w2; null !== V; ) {
            g2 = V;
            var u2 = g2.child;
            if (0 !== (g2.subtreeFlags & 2064) && null !== u2) u2.return = g2, V = u2;
            else b: for (g2 = w2; null !== V; ) {
              h2 = V;
              if (0 !== (h2.flags & 2048)) try {
                switch (h2.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Qj(9, h2);
                }
              } catch (na) {
                W$2(h2, h2.return, na);
              }
              if (h2 === g2) {
                V = null;
                break b;
              }
              var F2 = h2.sibling;
              if (null !== F2) {
                F2.return = h2.return;
                V = F2;
                break b;
              }
              V = h2.return;
            }
          }
          K$2 = e2;
          jg();
          if (lc && "function" === typeof lc.onPostCommitFiberRoot) try {
            lc.onPostCommitFiberRoot(kc, a2);
          } catch (na) {
          }
          d2 = true;
        }
        return d2;
      } finally {
        C$2 = c2, ok.transition = b2;
      }
    }
    return false;
  }
  function Xk(a2, b2, c2) {
    b2 = Ji(c2, b2);
    b2 = Ni(a2, b2, 1);
    a2 = nh(a2, b2, 1);
    b2 = R$2();
    null !== a2 && (Ac(a2, 1, b2), Dk(a2, b2));
  }
  function W$2(a2, b2, c2) {
    if (3 === a2.tag) Xk(a2, a2, c2);
    else for (; null !== b2; ) {
      if (3 === b2.tag) {
        Xk(b2, a2, c2);
        break;
      } else if (1 === b2.tag) {
        var d2 = b2.stateNode;
        if ("function" === typeof b2.type.getDerivedStateFromError || "function" === typeof d2.componentDidCatch && (null === Ri || !Ri.has(d2))) {
          a2 = Ji(c2, a2);
          a2 = Qi(b2, a2, 1);
          b2 = nh(b2, a2, 1);
          a2 = R$2();
          null !== b2 && (Ac(b2, 1, a2), Dk(b2, a2));
          break;
        }
      }
      b2 = b2.return;
    }
  }
  function Ti(a2, b2, c2) {
    var d2 = a2.pingCache;
    null !== d2 && d2.delete(b2);
    b2 = R$2();
    a2.pingedLanes |= a2.suspendedLanes & c2;
    Q$1 === a2 && (Z$2 & c2) === c2 && (4 === T$2 || 3 === T$2 && (Z$2 & 130023424) === Z$2 && 500 > B$2() - fk ? Kk(a2, 0) : rk |= c2);
    Dk(a2, b2);
  }
  function Yk(a2, b2) {
    0 === b2 && (0 === (a2.mode & 1) ? b2 = 1 : (b2 = sc, sc <<= 1, 0 === (sc & 130023424) && (sc = 4194304)));
    var c2 = R$2();
    a2 = ih(a2, b2);
    null !== a2 && (Ac(a2, b2, c2), Dk(a2, c2));
  }
  function uj(a2) {
    var b2 = a2.memoizedState, c2 = 0;
    null !== b2 && (c2 = b2.retryLane);
    Yk(a2, c2);
  }
  function bk(a2, b2) {
    var c2 = 0;
    switch (a2.tag) {
      case 13:
        var d2 = a2.stateNode;
        var e2 = a2.memoizedState;
        null !== e2 && (c2 = e2.retryLane);
        break;
      case 19:
        d2 = a2.stateNode;
        break;
      default:
        throw Error(p$3(314));
    }
    null !== d2 && d2.delete(b2);
    Yk(a2, c2);
  }
  var Vk;
  Vk = function(a2, b2, c2) {
    if (null !== a2) if (a2.memoizedProps !== b2.pendingProps || Wf.current) dh = true;
    else {
      if (0 === (a2.lanes & c2) && 0 === (b2.flags & 128)) return dh = false, yj(a2, b2, c2);
      dh = 0 !== (a2.flags & 131072) ? true : false;
    }
    else dh = false, I$2 && 0 !== (b2.flags & 1048576) && ug(b2, ng, b2.index);
    b2.lanes = 0;
    switch (b2.tag) {
      case 2:
        var d2 = b2.type;
        ij(a2, b2);
        a2 = b2.pendingProps;
        var e2 = Yf(b2, H$2.current);
        ch(b2, c2);
        e2 = Nh(null, b2, d2, a2, e2, c2);
        var f2 = Sh();
        b2.flags |= 1;
        "object" === typeof e2 && null !== e2 && "function" === typeof e2.render && void 0 === e2.$$typeof ? (b2.tag = 1, b2.memoizedState = null, b2.updateQueue = null, Zf(d2) ? (f2 = true, cg(b2)) : f2 = false, b2.memoizedState = null !== e2.state && void 0 !== e2.state ? e2.state : null, kh(b2), e2.updater = Ei, b2.stateNode = e2, e2._reactInternals = b2, Ii(b2, d2, a2, c2), b2 = jj(null, b2, d2, true, f2, c2)) : (b2.tag = 0, I$2 && f2 && vg(b2), Xi(null, b2, e2, c2), b2 = b2.child);
        return b2;
      case 16:
        d2 = b2.elementType;
        a: {
          ij(a2, b2);
          a2 = b2.pendingProps;
          e2 = d2._init;
          d2 = e2(d2._payload);
          b2.type = d2;
          e2 = b2.tag = Zk(d2);
          a2 = Ci(d2, a2);
          switch (e2) {
            case 0:
              b2 = cj(null, b2, d2, a2, c2);
              break a;
            case 1:
              b2 = hj(null, b2, d2, a2, c2);
              break a;
            case 11:
              b2 = Yi(null, b2, d2, a2, c2);
              break a;
            case 14:
              b2 = $i(null, b2, d2, Ci(d2.type, a2), c2);
              break a;
          }
          throw Error(p$3(
            306,
            d2,
            ""
          ));
        }
        return b2;
      case 0:
        return d2 = b2.type, e2 = b2.pendingProps, e2 = b2.elementType === d2 ? e2 : Ci(d2, e2), cj(a2, b2, d2, e2, c2);
      case 1:
        return d2 = b2.type, e2 = b2.pendingProps, e2 = b2.elementType === d2 ? e2 : Ci(d2, e2), hj(a2, b2, d2, e2, c2);
      case 3:
        a: {
          kj(b2);
          if (null === a2) throw Error(p$3(387));
          d2 = b2.pendingProps;
          f2 = b2.memoizedState;
          e2 = f2.element;
          lh(a2, b2);
          qh(b2, d2, null, c2);
          var g2 = b2.memoizedState;
          d2 = g2.element;
          if (f2.isDehydrated) if (f2 = { element: d2, isDehydrated: false, cache: g2.cache, pendingSuspenseBoundaries: g2.pendingSuspenseBoundaries, transitions: g2.transitions }, b2.updateQueue.baseState = f2, b2.memoizedState = f2, b2.flags & 256) {
            e2 = Ji(Error(p$3(423)), b2);
            b2 = lj(a2, b2, d2, c2, e2);
            break a;
          } else if (d2 !== e2) {
            e2 = Ji(Error(p$3(424)), b2);
            b2 = lj(a2, b2, d2, c2, e2);
            break a;
          } else for (yg = Lf(b2.stateNode.containerInfo.firstChild), xg = b2, I$2 = true, zg = null, c2 = Vg(b2, null, d2, c2), b2.child = c2; c2; ) c2.flags = c2.flags & -3 | 4096, c2 = c2.sibling;
          else {
            Ig();
            if (d2 === e2) {
              b2 = Zi(a2, b2, c2);
              break a;
            }
            Xi(a2, b2, d2, c2);
          }
          b2 = b2.child;
        }
        return b2;
      case 5:
        return Ah(b2), null === a2 && Eg(b2), d2 = b2.type, e2 = b2.pendingProps, f2 = null !== a2 ? a2.memoizedProps : null, g2 = e2.children, Ef(d2, e2) ? g2 = null : null !== f2 && Ef(d2, f2) && (b2.flags |= 32), gj(a2, b2), Xi(a2, b2, g2, c2), b2.child;
      case 6:
        return null === a2 && Eg(b2), null;
      case 13:
        return oj(a2, b2, c2);
      case 4:
        return yh(b2, b2.stateNode.containerInfo), d2 = b2.pendingProps, null === a2 ? b2.child = Ug(b2, null, d2, c2) : Xi(a2, b2, d2, c2), b2.child;
      case 11:
        return d2 = b2.type, e2 = b2.pendingProps, e2 = b2.elementType === d2 ? e2 : Ci(d2, e2), Yi(a2, b2, d2, e2, c2);
      case 7:
        return Xi(a2, b2, b2.pendingProps, c2), b2.child;
      case 8:
        return Xi(a2, b2, b2.pendingProps.children, c2), b2.child;
      case 12:
        return Xi(a2, b2, b2.pendingProps.children, c2), b2.child;
      case 10:
        a: {
          d2 = b2.type._context;
          e2 = b2.pendingProps;
          f2 = b2.memoizedProps;
          g2 = e2.value;
          G$2(Wg, d2._currentValue);
          d2._currentValue = g2;
          if (null !== f2) if (He$1(f2.value, g2)) {
            if (f2.children === e2.children && !Wf.current) {
              b2 = Zi(a2, b2, c2);
              break a;
            }
          } else for (f2 = b2.child, null !== f2 && (f2.return = b2); null !== f2; ) {
            var h2 = f2.dependencies;
            if (null !== h2) {
              g2 = f2.child;
              for (var k2 = h2.firstContext; null !== k2; ) {
                if (k2.context === d2) {
                  if (1 === f2.tag) {
                    k2 = mh(-1, c2 & -c2);
                    k2.tag = 2;
                    var l2 = f2.updateQueue;
                    if (null !== l2) {
                      l2 = l2.shared;
                      var m2 = l2.pending;
                      null === m2 ? k2.next = k2 : (k2.next = m2.next, m2.next = k2);
                      l2.pending = k2;
                    }
                  }
                  f2.lanes |= c2;
                  k2 = f2.alternate;
                  null !== k2 && (k2.lanes |= c2);
                  bh(
                    f2.return,
                    c2,
                    b2
                  );
                  h2.lanes |= c2;
                  break;
                }
                k2 = k2.next;
              }
            } else if (10 === f2.tag) g2 = f2.type === b2.type ? null : f2.child;
            else if (18 === f2.tag) {
              g2 = f2.return;
              if (null === g2) throw Error(p$3(341));
              g2.lanes |= c2;
              h2 = g2.alternate;
              null !== h2 && (h2.lanes |= c2);
              bh(g2, c2, b2);
              g2 = f2.sibling;
            } else g2 = f2.child;
            if (null !== g2) g2.return = f2;
            else for (g2 = f2; null !== g2; ) {
              if (g2 === b2) {
                g2 = null;
                break;
              }
              f2 = g2.sibling;
              if (null !== f2) {
                f2.return = g2.return;
                g2 = f2;
                break;
              }
              g2 = g2.return;
            }
            f2 = g2;
          }
          Xi(a2, b2, e2.children, c2);
          b2 = b2.child;
        }
        return b2;
      case 9:
        return e2 = b2.type, d2 = b2.pendingProps.children, ch(b2, c2), e2 = eh(e2), d2 = d2(e2), b2.flags |= 1, Xi(a2, b2, d2, c2), b2.child;
      case 14:
        return d2 = b2.type, e2 = Ci(d2, b2.pendingProps), e2 = Ci(d2.type, e2), $i(a2, b2, d2, e2, c2);
      case 15:
        return bj(a2, b2, b2.type, b2.pendingProps, c2);
      case 17:
        return d2 = b2.type, e2 = b2.pendingProps, e2 = b2.elementType === d2 ? e2 : Ci(d2, e2), ij(a2, b2), b2.tag = 1, Zf(d2) ? (a2 = true, cg(b2)) : a2 = false, ch(b2, c2), Gi(b2, d2, e2), Ii(b2, d2, e2, c2), jj(null, b2, d2, true, a2, c2);
      case 19:
        return xj(a2, b2, c2);
      case 22:
        return dj(a2, b2, c2);
    }
    throw Error(p$3(156, b2.tag));
  };
  function Fk(a2, b2) {
    return ac(a2, b2);
  }
  function $k(a2, b2, c2, d2) {
    this.tag = a2;
    this.key = c2;
    this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
    this.index = 0;
    this.ref = null;
    this.pendingProps = b2;
    this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
    this.mode = d2;
    this.subtreeFlags = this.flags = 0;
    this.deletions = null;
    this.childLanes = this.lanes = 0;
    this.alternate = null;
  }
  function Bg(a2, b2, c2, d2) {
    return new $k(a2, b2, c2, d2);
  }
  function aj(a2) {
    a2 = a2.prototype;
    return !(!a2 || !a2.isReactComponent);
  }
  function Zk(a2) {
    if ("function" === typeof a2) return aj(a2) ? 1 : 0;
    if (void 0 !== a2 && null !== a2) {
      a2 = a2.$$typeof;
      if (a2 === Da) return 11;
      if (a2 === Ga) return 14;
    }
    return 2;
  }
  function Pg(a2, b2) {
    var c2 = a2.alternate;
    null === c2 ? (c2 = Bg(a2.tag, b2, a2.key, a2.mode), c2.elementType = a2.elementType, c2.type = a2.type, c2.stateNode = a2.stateNode, c2.alternate = a2, a2.alternate = c2) : (c2.pendingProps = b2, c2.type = a2.type, c2.flags = 0, c2.subtreeFlags = 0, c2.deletions = null);
    c2.flags = a2.flags & 14680064;
    c2.childLanes = a2.childLanes;
    c2.lanes = a2.lanes;
    c2.child = a2.child;
    c2.memoizedProps = a2.memoizedProps;
    c2.memoizedState = a2.memoizedState;
    c2.updateQueue = a2.updateQueue;
    b2 = a2.dependencies;
    c2.dependencies = null === b2 ? null : { lanes: b2.lanes, firstContext: b2.firstContext };
    c2.sibling = a2.sibling;
    c2.index = a2.index;
    c2.ref = a2.ref;
    return c2;
  }
  function Rg(a2, b2, c2, d2, e2, f2) {
    var g2 = 2;
    d2 = a2;
    if ("function" === typeof a2) aj(a2) && (g2 = 1);
    else if ("string" === typeof a2) g2 = 5;
    else a: switch (a2) {
      case ya:
        return Tg(c2.children, e2, f2, b2);
      case za:
        g2 = 8;
        e2 |= 8;
        break;
      case Aa:
        return a2 = Bg(12, c2, b2, e2 | 2), a2.elementType = Aa, a2.lanes = f2, a2;
      case Ea:
        return a2 = Bg(13, c2, b2, e2), a2.elementType = Ea, a2.lanes = f2, a2;
      case Fa:
        return a2 = Bg(19, c2, b2, e2), a2.elementType = Fa, a2.lanes = f2, a2;
      case Ia:
        return pj(c2, e2, f2, b2);
      default:
        if ("object" === typeof a2 && null !== a2) switch (a2.$$typeof) {
          case Ba:
            g2 = 10;
            break a;
          case Ca:
            g2 = 9;
            break a;
          case Da:
            g2 = 11;
            break a;
          case Ga:
            g2 = 14;
            break a;
          case Ha:
            g2 = 16;
            d2 = null;
            break a;
        }
        throw Error(p$3(130, null == a2 ? a2 : typeof a2, ""));
    }
    b2 = Bg(g2, c2, b2, e2);
    b2.elementType = a2;
    b2.type = d2;
    b2.lanes = f2;
    return b2;
  }
  function Tg(a2, b2, c2, d2) {
    a2 = Bg(7, a2, d2, b2);
    a2.lanes = c2;
    return a2;
  }
  function pj(a2, b2, c2, d2) {
    a2 = Bg(22, a2, d2, b2);
    a2.elementType = Ia;
    a2.lanes = c2;
    a2.stateNode = { isHidden: false };
    return a2;
  }
  function Qg(a2, b2, c2) {
    a2 = Bg(6, a2, null, b2);
    a2.lanes = c2;
    return a2;
  }
  function Sg(a2, b2, c2) {
    b2 = Bg(4, null !== a2.children ? a2.children : [], a2.key, b2);
    b2.lanes = c2;
    b2.stateNode = { containerInfo: a2.containerInfo, pendingChildren: null, implementation: a2.implementation };
    return b2;
  }
  function al(a2, b2, c2, d2, e2) {
    this.tag = b2;
    this.containerInfo = a2;
    this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
    this.timeoutHandle = -1;
    this.callbackNode = this.pendingContext = this.context = null;
    this.callbackPriority = 0;
    this.eventTimes = zc(0);
    this.expirationTimes = zc(-1);
    this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
    this.entanglements = zc(0);
    this.identifierPrefix = d2;
    this.onRecoverableError = e2;
    this.mutableSourceEagerHydrationData = null;
  }
  function bl(a2, b2, c2, d2, e2, f2, g2, h2, k2) {
    a2 = new al(a2, b2, c2, h2, k2);
    1 === b2 ? (b2 = 1, true === f2 && (b2 |= 8)) : b2 = 0;
    f2 = Bg(3, null, null, b2);
    a2.current = f2;
    f2.stateNode = a2;
    f2.memoizedState = { element: d2, isDehydrated: c2, cache: null, transitions: null, pendingSuspenseBoundaries: null };
    kh(f2);
    return a2;
  }
  function cl(a2, b2, c2) {
    var d2 = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
    return { $$typeof: wa, key: null == d2 ? null : "" + d2, children: a2, containerInfo: b2, implementation: c2 };
  }
  function dl(a2) {
    if (!a2) return Vf;
    a2 = a2._reactInternals;
    a: {
      if (Vb(a2) !== a2 || 1 !== a2.tag) throw Error(p$3(170));
      var b2 = a2;
      do {
        switch (b2.tag) {
          case 3:
            b2 = b2.stateNode.context;
            break a;
          case 1:
            if (Zf(b2.type)) {
              b2 = b2.stateNode.__reactInternalMemoizedMergedChildContext;
              break a;
            }
        }
        b2 = b2.return;
      } while (null !== b2);
      throw Error(p$3(171));
    }
    if (1 === a2.tag) {
      var c2 = a2.type;
      if (Zf(c2)) return bg(a2, c2, b2);
    }
    return b2;
  }
  function el(a2, b2, c2, d2, e2, f2, g2, h2, k2) {
    a2 = bl(c2, d2, true, a2, e2, f2, g2, h2, k2);
    a2.context = dl(null);
    c2 = a2.current;
    d2 = R$2();
    e2 = yi(c2);
    f2 = mh(d2, e2);
    f2.callback = void 0 !== b2 && null !== b2 ? b2 : null;
    nh(c2, f2, e2);
    a2.current.lanes = e2;
    Ac(a2, e2, d2);
    Dk(a2, d2);
    return a2;
  }
  function fl(a2, b2, c2, d2) {
    var e2 = b2.current, f2 = R$2(), g2 = yi(e2);
    c2 = dl(c2);
    null === b2.context ? b2.context = c2 : b2.pendingContext = c2;
    b2 = mh(f2, g2);
    b2.payload = { element: a2 };
    d2 = void 0 === d2 ? null : d2;
    null !== d2 && (b2.callback = d2);
    a2 = nh(e2, b2, g2);
    null !== a2 && (gi(a2, e2, g2, f2), oh(a2, e2, g2));
    return g2;
  }
  function gl(a2) {
    a2 = a2.current;
    if (!a2.child) return null;
    switch (a2.child.tag) {
      case 5:
        return a2.child.stateNode;
      default:
        return a2.child.stateNode;
    }
  }
  function hl$1(a2, b2) {
    a2 = a2.memoizedState;
    if (null !== a2 && null !== a2.dehydrated) {
      var c2 = a2.retryLane;
      a2.retryLane = 0 !== c2 && c2 < b2 ? c2 : b2;
    }
  }
  function il(a2, b2) {
    hl$1(a2, b2);
    (a2 = a2.alternate) && hl$1(a2, b2);
  }
  function jl() {
    return null;
  }
  var kl = "function" === typeof reportError ? reportError : function(a2) {
    console.error(a2);
  };
  function ll(a2) {
    this._internalRoot = a2;
  }
  ml$1.prototype.render = ll.prototype.render = function(a2) {
    var b2 = this._internalRoot;
    if (null === b2) throw Error(p$3(409));
    fl(a2, b2, null, null);
  };
  ml$1.prototype.unmount = ll.prototype.unmount = function() {
    var a2 = this._internalRoot;
    if (null !== a2) {
      this._internalRoot = null;
      var b2 = a2.containerInfo;
      Rk(function() {
        fl(null, a2, null, null);
      });
      b2[uf] = null;
    }
  };
  function ml$1(a2) {
    this._internalRoot = a2;
  }
  ml$1.prototype.unstable_scheduleHydration = function(a2) {
    if (a2) {
      var b2 = Hc();
      a2 = { blockedOn: null, target: a2, priority: b2 };
      for (var c2 = 0; c2 < Qc.length && 0 !== b2 && b2 < Qc[c2].priority; c2++) ;
      Qc.splice(c2, 0, a2);
      0 === c2 && Vc(a2);
    }
  };
  function nl$1(a2) {
    return !(!a2 || 1 !== a2.nodeType && 9 !== a2.nodeType && 11 !== a2.nodeType);
  }
  function ol(a2) {
    return !(!a2 || 1 !== a2.nodeType && 9 !== a2.nodeType && 11 !== a2.nodeType && (8 !== a2.nodeType || " react-mount-point-unstable " !== a2.nodeValue));
  }
  function pl() {
  }
  function ql(a2, b2, c2, d2, e2) {
    if (e2) {
      if ("function" === typeof d2) {
        var f2 = d2;
        d2 = function() {
          var a3 = gl(g2);
          f2.call(a3);
        };
      }
      var g2 = el(b2, d2, a2, 0, null, false, false, "", pl);
      a2._reactRootContainer = g2;
      a2[uf] = g2.current;
      sf(8 === a2.nodeType ? a2.parentNode : a2);
      Rk();
      return g2;
    }
    for (; e2 = a2.lastChild; ) a2.removeChild(e2);
    if ("function" === typeof d2) {
      var h2 = d2;
      d2 = function() {
        var a3 = gl(k2);
        h2.call(a3);
      };
    }
    var k2 = bl(a2, 0, false, null, null, false, false, "", pl);
    a2._reactRootContainer = k2;
    a2[uf] = k2.current;
    sf(8 === a2.nodeType ? a2.parentNode : a2);
    Rk(function() {
      fl(b2, k2, c2, d2);
    });
    return k2;
  }
  function rl(a2, b2, c2, d2, e2) {
    var f2 = c2._reactRootContainer;
    if (f2) {
      var g2 = f2;
      if ("function" === typeof e2) {
        var h2 = e2;
        e2 = function() {
          var a3 = gl(g2);
          h2.call(a3);
        };
      }
      fl(b2, g2, a2, e2);
    } else g2 = ql(c2, b2, a2, e2, d2);
    return gl(g2);
  }
  Ec = function(a2) {
    switch (a2.tag) {
      case 3:
        var b2 = a2.stateNode;
        if (b2.current.memoizedState.isDehydrated) {
          var c2 = tc(b2.pendingLanes);
          0 !== c2 && (Cc(b2, c2 | 1), Dk(b2, B$2()), 0 === (K$2 & 6) && (Gj = B$2() + 500, jg()));
        }
        break;
      case 13:
        Rk(function() {
          var b3 = ih(a2, 1);
          if (null !== b3) {
            var c3 = R$2();
            gi(b3, a2, 1, c3);
          }
        }), il(a2, 1);
    }
  };
  Fc = function(a2) {
    if (13 === a2.tag) {
      var b2 = ih(a2, 134217728);
      if (null !== b2) {
        var c2 = R$2();
        gi(b2, a2, 134217728, c2);
      }
      il(a2, 134217728);
    }
  };
  Gc = function(a2) {
    if (13 === a2.tag) {
      var b2 = yi(a2), c2 = ih(a2, b2);
      if (null !== c2) {
        var d2 = R$2();
        gi(c2, a2, b2, d2);
      }
      il(a2, b2);
    }
  };
  Hc = function() {
    return C$2;
  };
  Ic = function(a2, b2) {
    var c2 = C$2;
    try {
      return C$2 = a2, b2();
    } finally {
      C$2 = c2;
    }
  };
  yb = function(a2, b2, c2) {
    switch (b2) {
      case "input":
        bb(a2, c2);
        b2 = c2.name;
        if ("radio" === c2.type && null != b2) {
          for (c2 = a2; c2.parentNode; ) c2 = c2.parentNode;
          c2 = c2.querySelectorAll("input[name=" + JSON.stringify("" + b2) + '][type="radio"]');
          for (b2 = 0; b2 < c2.length; b2++) {
            var d2 = c2[b2];
            if (d2 !== a2 && d2.form === a2.form) {
              var e2 = Db(d2);
              if (!e2) throw Error(p$3(90));
              Wa(d2);
              bb(d2, e2);
            }
          }
        }
        break;
      case "textarea":
        ib(a2, c2);
        break;
      case "select":
        b2 = c2.value, null != b2 && fb(a2, !!c2.multiple, b2, false);
    }
  };
  Gb = Qk;
  Hb = Rk;
  var sl$1 = { usingClientEntryPoint: false, Events: [Cb, ue, Db, Eb, Fb, Qk] }, tl = { findFiberByHostInstance: Wc, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" };
  var ul = { bundleType: tl.bundleType, version: tl.version, rendererPackageName: tl.rendererPackageName, rendererConfig: tl.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ua.ReactCurrentDispatcher, findHostInstanceByFiber: function(a2) {
    a2 = Zb(a2);
    return null === a2 ? null : a2.stateNode;
  }, findFiberByHostInstance: tl.findFiberByHostInstance || jl, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
    var vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!vl.isDisabled && vl.supportsFiber) try {
      kc = vl.inject(ul), lc = vl;
    } catch (a2) {
    }
  }
  reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = sl$1;
  reactDom_production_min.createPortal = function(a2, b2) {
    var c2 = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
    if (!nl$1(b2)) throw Error(p$3(200));
    return cl(a2, b2, null, c2);
  };
  reactDom_production_min.createRoot = function(a2, b2) {
    if (!nl$1(a2)) throw Error(p$3(299));
    var c2 = false, d2 = "", e2 = kl;
    null !== b2 && void 0 !== b2 && (true === b2.unstable_strictMode && (c2 = true), void 0 !== b2.identifierPrefix && (d2 = b2.identifierPrefix), void 0 !== b2.onRecoverableError && (e2 = b2.onRecoverableError));
    b2 = bl(a2, 1, false, null, null, c2, false, d2, e2);
    a2[uf] = b2.current;
    sf(8 === a2.nodeType ? a2.parentNode : a2);
    return new ll(b2);
  };
  reactDom_production_min.findDOMNode = function(a2) {
    if (null == a2) return null;
    if (1 === a2.nodeType) return a2;
    var b2 = a2._reactInternals;
    if (void 0 === b2) {
      if ("function" === typeof a2.render) throw Error(p$3(188));
      a2 = Object.keys(a2).join(",");
      throw Error(p$3(268, a2));
    }
    a2 = Zb(b2);
    a2 = null === a2 ? null : a2.stateNode;
    return a2;
  };
  reactDom_production_min.flushSync = function(a2) {
    return Rk(a2);
  };
  reactDom_production_min.hydrate = function(a2, b2, c2) {
    if (!ol(b2)) throw Error(p$3(200));
    return rl(null, a2, b2, true, c2);
  };
  reactDom_production_min.hydrateRoot = function(a2, b2, c2) {
    if (!nl$1(a2)) throw Error(p$3(405));
    var d2 = null != c2 && c2.hydratedSources || null, e2 = false, f2 = "", g2 = kl;
    null !== c2 && void 0 !== c2 && (true === c2.unstable_strictMode && (e2 = true), void 0 !== c2.identifierPrefix && (f2 = c2.identifierPrefix), void 0 !== c2.onRecoverableError && (g2 = c2.onRecoverableError));
    b2 = el(b2, null, a2, 1, null != c2 ? c2 : null, e2, false, f2, g2);
    a2[uf] = b2.current;
    sf(a2);
    if (d2) for (a2 = 0; a2 < d2.length; a2++) c2 = d2[a2], e2 = c2._getVersion, e2 = e2(c2._source), null == b2.mutableSourceEagerHydrationData ? b2.mutableSourceEagerHydrationData = [c2, e2] : b2.mutableSourceEagerHydrationData.push(
      c2,
      e2
    );
    return new ml$1(b2);
  };
  reactDom_production_min.render = function(a2, b2, c2) {
    if (!ol(b2)) throw Error(p$3(200));
    return rl(null, a2, b2, false, c2);
  };
  reactDom_production_min.unmountComponentAtNode = function(a2) {
    if (!ol(a2)) throw Error(p$3(40));
    return a2._reactRootContainer ? (Rk(function() {
      rl(null, null, a2, false, function() {
        a2._reactRootContainer = null;
        a2[uf] = null;
      });
    }), true) : false;
  };
  reactDom_production_min.unstable_batchedUpdates = Qk;
  reactDom_production_min.unstable_renderSubtreeIntoContainer = function(a2, b2, c2, d2) {
    if (!ol(c2)) throw Error(p$3(200));
    if (null == a2 || void 0 === a2._reactInternals) throw Error(p$3(38));
    return rl(a2, b2, c2, false, d2);
  };
  reactDom_production_min.version = "18.3.1-next-f1338f8080-20240426";
  function checkDCE() {
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
      return;
    }
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
    } catch (err) {
      console.error(err);
    }
  }
  {
    checkDCE();
    reactDom.exports = reactDom_production_min;
  }
  var reactDomExports = reactDom.exports;
  var m$2 = reactDomExports;
  {
    client.createRoot = m$2.createRoot;
    client.hydrateRoot = m$2.hydrateRoot;
  }
  const createStoreImpl = (createState) => {
    let state;
    const listeners = /* @__PURE__ */ new Set();
    const setState2 = (partial, replace) => {
      const nextState = typeof partial === "function" ? partial(state) : partial;
      if (!Object.is(nextState, state)) {
        const previousState = state;
        state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
        listeners.forEach((listener) => listener(state, previousState));
      }
    };
    const getState2 = () => state;
    const getInitialState = () => initialState;
    const subscribe = (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    };
    const api2 = { setState: setState2, getState: getState2, getInitialState, subscribe };
    const initialState = state = createState(setState2, getState2, api2);
    return api2;
  };
  const createStore = (createState) => createState ? createStoreImpl(createState) : createStoreImpl;
  const identity = (arg) => arg;
  function useStore(api2, selector = identity) {
    const slice = React.useSyncExternalStore(
      api2.subscribe,
      React.useCallback(() => selector(api2.getState()), [api2, selector]),
      React.useCallback(() => selector(api2.getInitialState()), [api2, selector])
    );
    React.useDebugValue(slice);
    return slice;
  }
  const createImpl = (createState) => {
    const api2 = createStore(createState);
    const useBoundStore = (selector) => useStore(api2, selector);
    Object.assign(useBoundStore, api2);
    return useBoundStore;
  };
  const create$1 = (createState) => createImpl;
  const __vite_import_meta_env__ = { "BASE_URL": "./", "DEV": false, "MODE": "production", "PROD": true, "SSR": false };
  const shouldDispatchFromDevtools = (api2) => !!api2.dispatchFromDevtools && typeof api2.dispatch === "function";
  const trackedConnections = /* @__PURE__ */ new Map();
  const getTrackedConnectionState = (name) => {
    const api2 = trackedConnections.get(name);
    if (!api2) return {};
    return Object.fromEntries(
      Object.entries(api2.stores).map(([key, api22]) => [key, api22.getState()])
    );
  };
  const extractConnectionInformation = (store2, extensionConnector, options) => {
    if (store2 === void 0) {
      return {
        type: "untracked",
        connection: extensionConnector.connect(options)
      };
    }
    const existingConnection = trackedConnections.get(options.name);
    if (existingConnection) {
      return { type: "tracked", store: store2, ...existingConnection };
    }
    const newConnection = {
      connection: extensionConnector.connect(options),
      stores: {}
    };
    trackedConnections.set(options.name, newConnection);
    return { type: "tracked", store: store2, ...newConnection };
  };
  const removeStoreFromTrackedConnections = (name, store2) => {
    if (store2 === void 0) return;
    const connectionInfo = trackedConnections.get(name);
    if (!connectionInfo) return;
    delete connectionInfo.stores[store2];
    if (Object.keys(connectionInfo.stores).length === 0) {
      trackedConnections.delete(name);
    }
  };
  const findCallerName = (stack) => {
    var _a, _b;
    if (!stack) return void 0;
    const traceLines = stack.split("\n");
    const apiSetStateLineIndex = traceLines.findIndex(
      (traceLine) => traceLine.includes("api.setState")
    );
    if (apiSetStateLineIndex < 0) return void 0;
    const callerLine = ((_a = traceLines[apiSetStateLineIndex + 1]) == null ? void 0 : _a.trim()) || "";
    return (_b = /.+ (.+) .+/.exec(callerLine)) == null ? void 0 : _b[1];
  };
  const devtoolsImpl = (fn, devtoolsOptions = {}) => (set, get, api2) => {
    const { enabled, anonymousActionType, store: store2, ...options } = devtoolsOptions;
    let extensionConnector;
    try {
      extensionConnector = (enabled != null ? enabled : (__vite_import_meta_env__ ? "production" : void 0) !== "production") && window.__REDUX_DEVTOOLS_EXTENSION__;
    } catch (e2) {
    }
    if (!extensionConnector) {
      return fn(set, get, api2);
    }
    const { connection, ...connectionInformation } = extractConnectionInformation(store2, extensionConnector, options);
    let isRecording = true;
    api2.setState = (state, replace, nameOrAction) => {
      const r2 = set(state, replace);
      if (!isRecording) return r2;
      const action = nameOrAction === void 0 ? {
        type: anonymousActionType || findCallerName(new Error().stack) || "anonymous"
      } : typeof nameOrAction === "string" ? { type: nameOrAction } : nameOrAction;
      if (store2 === void 0) {
        connection == null ? void 0 : connection.send(action, get());
        return r2;
      }
      connection == null ? void 0 : connection.send(
        {
          ...action,
          type: `${store2}/${action.type}`
        },
        {
          ...getTrackedConnectionState(options.name),
          [store2]: api2.getState()
        }
      );
      return r2;
    };
    api2.devtools = {
      cleanup: () => {
        if (connection && typeof connection.unsubscribe === "function") {
          connection.unsubscribe();
        }
        removeStoreFromTrackedConnections(options.name, store2);
      }
    };
    const setStateFromDevtools = (...a2) => {
      const originalIsRecording = isRecording;
      isRecording = false;
      set(...a2);
      isRecording = originalIsRecording;
    };
    const initialState = fn(api2.setState, get, api2);
    if (connectionInformation.type === "untracked") {
      connection == null ? void 0 : connection.init(initialState);
    } else {
      connectionInformation.stores[connectionInformation.store] = api2;
      connection == null ? void 0 : connection.init(
        Object.fromEntries(
          Object.entries(connectionInformation.stores).map(([key, store22]) => [
            key,
            key === connectionInformation.store ? initialState : store22.getState()
          ])
        )
      );
    }
    if (shouldDispatchFromDevtools(api2)) {
      let didWarnAboutReservedActionType = false;
      const originalDispatch = api2.dispatch;
      api2.dispatch = (...args) => {
        if ((__vite_import_meta_env__ ? "production" : void 0) !== "production" && args[0].type === "__setState" && !didWarnAboutReservedActionType) {
          console.warn(
            '[zustand devtools middleware] "__setState" action type is reserved to set state from the devtools. Avoid using it.'
          );
          didWarnAboutReservedActionType = true;
        }
        originalDispatch(...args);
      };
    }
    connection.subscribe((message) => {
      var _a;
      switch (message.type) {
        case "ACTION":
          if (typeof message.payload !== "string") {
            console.error(
              "[zustand devtools middleware] Unsupported action format"
            );
            return;
          }
          return parseJsonThen(
            message.payload,
            (action) => {
              if (action.type === "__setState") {
                if (store2 === void 0) {
                  setStateFromDevtools(action.state);
                  return;
                }
                if (Object.keys(action.state).length !== 1) {
                  console.error(
                    `
                    [zustand devtools middleware] Unsupported __setState action format.
                    When using 'store' option in devtools(), the 'state' should have only one key, which is a value of 'store' that was passed in devtools(),
                    and value of this only key should be a state object. Example: { "type": "__setState", "state": { "abc123Store": { "foo": "bar" } } }
                    `
                  );
                }
                const stateFromDevtools = action.state[store2];
                if (stateFromDevtools === void 0 || stateFromDevtools === null) {
                  return;
                }
                if (JSON.stringify(api2.getState()) !== JSON.stringify(stateFromDevtools)) {
                  setStateFromDevtools(stateFromDevtools);
                }
                return;
              }
              if (shouldDispatchFromDevtools(api2)) {
                api2.dispatch(action);
              }
            }
          );
        case "DISPATCH":
          switch (message.payload.type) {
            case "RESET":
              setStateFromDevtools(initialState);
              if (store2 === void 0) {
                return connection == null ? void 0 : connection.init(api2.getState());
              }
              return connection == null ? void 0 : connection.init(getTrackedConnectionState(options.name));
            case "COMMIT":
              if (store2 === void 0) {
                connection == null ? void 0 : connection.init(api2.getState());
                return;
              }
              return connection == null ? void 0 : connection.init(getTrackedConnectionState(options.name));
            case "ROLLBACK":
              return parseJsonThen(message.state, (state) => {
                if (store2 === void 0) {
                  setStateFromDevtools(state);
                  connection == null ? void 0 : connection.init(api2.getState());
                  return;
                }
                setStateFromDevtools(state[store2]);
                connection == null ? void 0 : connection.init(getTrackedConnectionState(options.name));
              });
            case "JUMP_TO_STATE":
            case "JUMP_TO_ACTION":
              return parseJsonThen(message.state, (state) => {
                if (store2 === void 0) {
                  setStateFromDevtools(state);
                  return;
                }
                if (JSON.stringify(api2.getState()) !== JSON.stringify(state[store2])) {
                  setStateFromDevtools(state[store2]);
                }
              });
            case "IMPORT_STATE": {
              const { nextLiftedState } = message.payload;
              const lastComputedState = (_a = nextLiftedState.computedStates.slice(-1)[0]) == null ? void 0 : _a.state;
              if (!lastComputedState) return;
              if (store2 === void 0) {
                setStateFromDevtools(lastComputedState);
              } else {
                setStateFromDevtools(lastComputedState[store2]);
              }
              connection == null ? void 0 : connection.send(
                null,
                // FIXME no-any
                nextLiftedState
              );
              return;
            }
            case "PAUSE_RECORDING":
              return isRecording = !isRecording;
          }
          return;
      }
    });
    return initialState;
  };
  const devtools = devtoolsImpl;
  const parseJsonThen = (stringified, fn) => {
    let parsed;
    try {
      parsed = JSON.parse(stringified);
    } catch (e2) {
      console.error(
        "[zustand devtools middleware] Could not parse the received json",
        e2
      );
    }
    if (parsed !== void 0) fn(parsed);
  };
  const DEFAULT_ACTION_TYPES = [
    "analfingering",
    "analfisting",
    "analsex",
    "analtoying",
    "anilingus",
    "bathing",
    "blowjob",
    "boobjob",
    "breastsmothering",
    "buttjob",
    "buttsmothering",
    "cuddling",
    "cumonbutt",
    "cumonchest",
    "cumonvulva",
    "cunnilingus",
    "dancing",
    "deepthroat",
    "facial",
    "femalemasturbation",
    "footjob",
    "frenchkissing",
    "grindingfoot",
    "grindingobject",
    "grindingpenis",
    "grindingthigh",
    "gropingbreast",
    "gropingbutt",
    "gropingtesticles",
    "handjob",
    "holdingarm",
    "holdingbody",
    "holdingchin",
    "holdingfoot",
    "holdinghand",
    "holdinghead",
    "holdinghip",
    "holdingleg",
    "holdingneck",
    "holdingthigh",
    "hugging",
    "kissing",
    "kissingcheek",
    "kissingfoot",
    "kissinghand",
    "kissingneck",
    "leglocking",
    "lickingnipple",
    "lickingpenis",
    "lickingtesticles",
    "lickingvagina",
    "malemasturbation",
    "mounting",
    "oralfingering",
    "pattinghead",
    "pullinghair",
    "rimjob",
    "rubbingclitoris",
    "rubbingpenisagainstface",
    "spectating",
    "spooning",
    "strokinghead",
    "suckingnipple",
    "thighjob",
    "ticklingfoot",
    "tribbing",
    "vaginalfingering",
    "vaginalfisting",
    "vaginalsex",
    "vaginaltoying",
    "vampirebite"
  ];
  const DEFAULT_ACTOR_TAGS = [
    "allfours",
    "bendover",
    "drowsy",
    "facingaway",
    "handstanding",
    "kneeling",
    "lyingback",
    "lyingfront",
    "lyingside",
    "onbottom",
    "ontop",
    "sitting",
    "sleeping",
    "spreadlegs",
    "squatting",
    "standing",
    "suspended",
    "upsidedown"
  ];
  const DEFAULT_SCENE_TAGS = [
    "cowgirl",
    "doggystyle",
    "facesitting",
    "gay",
    "idle",
    "lesbian",
    "missionary",
    "prone",
    "reversecowgirl",
    "sixtynine",
    "spitroast",
    "transition"
  ];
  const useNavigatorStore = create$1()(
    devtools((set) => ({
      visible: false,
      setVisible: (visible) => set({ visible }),
      scenes: [],
      setScenes: (scenes) => set({ scenes }),
      setSceneHasCustomDescription: (sceneId, hasDescription) => set((state) => ({
        scenes: state.scenes.map(
          (s2) => s2.id.toLowerCase() === sceneId.toLowerCase() ? { ...s2, hasCustomDescription: hasDescription } : s2
        )
      })),
      currentThread: null,
      setCurrentThread: (currentThread) => set({ currentThread }),
      playerThreadRunning: true,
      setPlayerThreadRunning: (playerThreadRunning) => set({ playerThreadRunning }),
      currentSceneId: "",
      setCurrentSceneId: (currentSceneId) => set({ currentSceneId }),
      sceneSuggestions: {
        actionTypes: DEFAULT_ACTION_TYPES,
        actorTags: DEFAULT_ACTOR_TAGS,
        sceneTags: DEFAULT_SCENE_TAGS,
        actionTagSuggestions: {}
      },
      setSceneSuggestions: (sceneSuggestions) => set({ sceneSuggestions }),
      ostimNetSuggestions: {
        intents: ["platonic", "romantic", "transactional", "dom", "aggressive"],
        positions: ["cowgirl", "reversecowgirl", "missionary", "doggy"]
      },
      setOStimNetSuggestions: (ostimNetSuggestions) => set({ ostimNetSuggestions })
    }))
  );
  /*!
   * Font Awesome Free 7.2.0 by @fontawesome - https://fontawesome.com
   * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
   * Copyright 2026 Fonticons, Inc.
   */
  function _arrayLikeToArray$1(r2, a2) {
    (null == a2 || a2 > r2.length) && (a2 = r2.length);
    for (var e2 = 0, n2 = Array(a2); e2 < a2; e2++) n2[e2] = r2[e2];
    return n2;
  }
  function _arrayWithHoles$1(r2) {
    if (Array.isArray(r2)) return r2;
  }
  function _arrayWithoutHoles(r2) {
    if (Array.isArray(r2)) return _arrayLikeToArray$1(r2);
  }
  function _classCallCheck(a2, n2) {
    if (!(a2 instanceof n2)) throw new TypeError("Cannot call a class as a function");
  }
  function _defineProperties(e2, r2) {
    for (var t2 = 0; t2 < r2.length; t2++) {
      var o2 = r2[t2];
      o2.enumerable = o2.enumerable || false, o2.configurable = true, "value" in o2 && (o2.writable = true), Object.defineProperty(e2, _toPropertyKey$1(o2.key), o2);
    }
  }
  function _createClass(e2, r2, t2) {
    return r2 && _defineProperties(e2.prototype, r2), Object.defineProperty(e2, "prototype", {
      writable: false
    }), e2;
  }
  function _createForOfIteratorHelper(r2, e2) {
    var t2 = "undefined" != typeof Symbol && r2[Symbol.iterator] || r2["@@iterator"];
    if (!t2) {
      if (Array.isArray(r2) || (t2 = _unsupportedIterableToArray$1(r2)) || e2) {
        t2 && (r2 = t2);
        var n2 = 0, F2 = function() {
        };
        return {
          s: F2,
          n: function() {
            return n2 >= r2.length ? {
              done: true
            } : {
              done: false,
              value: r2[n2++]
            };
          },
          e: function(r3) {
            throw r3;
          },
          f: F2
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var o2, a2 = true, u2 = false;
    return {
      s: function() {
        t2 = t2.call(r2);
      },
      n: function() {
        var r3 = t2.next();
        return a2 = r3.done, r3;
      },
      e: function(r3) {
        u2 = true, o2 = r3;
      },
      f: function() {
        try {
          a2 || null == t2.return || t2.return();
        } finally {
          if (u2) throw o2;
        }
      }
    };
  }
  function _defineProperty$2(e2, r2, t2) {
    return (r2 = _toPropertyKey$1(r2)) in e2 ? Object.defineProperty(e2, r2, {
      value: t2,
      enumerable: true,
      configurable: true,
      writable: true
    }) : e2[r2] = t2, e2;
  }
  function _iterableToArray(r2) {
    if ("undefined" != typeof Symbol && null != r2[Symbol.iterator] || null != r2["@@iterator"]) return Array.from(r2);
  }
  function _iterableToArrayLimit$1(r2, l2) {
    var t2 = null == r2 ? null : "undefined" != typeof Symbol && r2[Symbol.iterator] || r2["@@iterator"];
    if (null != t2) {
      var e2, n2, i2, u2, a2 = [], f2 = true, o2 = false;
      try {
        if (i2 = (t2 = t2.call(r2)).next, 0 === l2) {
          if (Object(t2) !== t2) return;
          f2 = false;
        } else for (; !(f2 = (e2 = i2.call(t2)).done) && (a2.push(e2.value), a2.length !== l2); f2 = true) ;
      } catch (r3) {
        o2 = true, n2 = r3;
      } finally {
        try {
          if (!f2 && null != t2.return && (u2 = t2.return(), Object(u2) !== u2)) return;
        } finally {
          if (o2) throw n2;
        }
      }
      return a2;
    }
  }
  function _nonIterableRest$1() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function ownKeys$2(e2, r2) {
    var t2 = Object.keys(e2);
    if (Object.getOwnPropertySymbols) {
      var o2 = Object.getOwnPropertySymbols(e2);
      r2 && (o2 = o2.filter(function(r3) {
        return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
      })), t2.push.apply(t2, o2);
    }
    return t2;
  }
  function _objectSpread2$2(e2) {
    for (var r2 = 1; r2 < arguments.length; r2++) {
      var t2 = null != arguments[r2] ? arguments[r2] : {};
      r2 % 2 ? ownKeys$2(Object(t2), true).forEach(function(r3) {
        _defineProperty$2(e2, r3, t2[r3]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$2(Object(t2)).forEach(function(r3) {
        Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
      });
    }
    return e2;
  }
  function _slicedToArray$1(r2, e2) {
    return _arrayWithHoles$1(r2) || _iterableToArrayLimit$1(r2, e2) || _unsupportedIterableToArray$1(r2, e2) || _nonIterableRest$1();
  }
  function _toConsumableArray(r2) {
    return _arrayWithoutHoles(r2) || _iterableToArray(r2) || _unsupportedIterableToArray$1(r2) || _nonIterableSpread();
  }
  function _toPrimitive$1(t2, r2) {
    if ("object" != typeof t2 || !t2) return t2;
    var e2 = t2[Symbol.toPrimitive];
    if (void 0 !== e2) {
      var i2 = e2.call(t2, r2);
      if ("object" != typeof i2) return i2;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r2 ? String : Number)(t2);
  }
  function _toPropertyKey$1(t2) {
    var i2 = _toPrimitive$1(t2, "string");
    return "symbol" == typeof i2 ? i2 : i2 + "";
  }
  function _typeof(o2) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o3) {
      return typeof o3;
    } : function(o3) {
      return o3 && "function" == typeof Symbol && o3.constructor === Symbol && o3 !== Symbol.prototype ? "symbol" : typeof o3;
    }, _typeof(o2);
  }
  function _unsupportedIterableToArray$1(r2, a2) {
    if (r2) {
      if ("string" == typeof r2) return _arrayLikeToArray$1(r2, a2);
      var t2 = {}.toString.call(r2).slice(8, -1);
      return "Object" === t2 && r2.constructor && (t2 = r2.constructor.name), "Map" === t2 || "Set" === t2 ? Array.from(r2) : "Arguments" === t2 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t2) ? _arrayLikeToArray$1(r2, a2) : void 0;
    }
  }
  var noop = function noop2() {
  };
  var _WINDOW = {};
  var _DOCUMENT = {};
  var _MUTATION_OBSERVER = null;
  var _PERFORMANCE = {
    mark: noop,
    measure: noop
  };
  try {
    if (typeof window !== "undefined") _WINDOW = window;
    if (typeof document !== "undefined") _DOCUMENT = document;
    if (typeof MutationObserver !== "undefined") _MUTATION_OBSERVER = MutationObserver;
    if (typeof performance !== "undefined") _PERFORMANCE = performance;
  } catch (e2) {
  }
  var _ref = _WINDOW.navigator || {}, _ref$userAgent = _ref.userAgent, userAgent = _ref$userAgent === void 0 ? "" : _ref$userAgent;
  var WINDOW = _WINDOW;
  var DOCUMENT = _DOCUMENT;
  var MUTATION_OBSERVER = _MUTATION_OBSERVER;
  var PERFORMANCE = _PERFORMANCE;
  !!WINDOW.document;
  var IS_DOM = !!DOCUMENT.documentElement && !!DOCUMENT.head && typeof DOCUMENT.addEventListener === "function" && typeof DOCUMENT.createElement === "function";
  var IS_IE = ~userAgent.indexOf("MSIE") || ~userAgent.indexOf("Trident/");
  var _ht;
  var G = /fa(k|kd|s|r|l|t|d|dr|dl|dt|b|slr|slpr|wsb|tl|ns|nds|es|gt|jr|jfr|jdr|usb|ufsb|udsb|cr|ss|sr|sl|st|sds|sdr|sdl|sdt)?[\-\ ]/, M = /Font ?Awesome ?([567 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit|Notdog Duo|Notdog|Chisel|Etch|Graphite|Thumbprint|Jelly Fill|Jelly Duo|Jelly|Utility|Utility Fill|Utility Duo|Slab Press|Slab|Whiteboard)?.*/i;
  var Q = {
    classic: {
      fa: "solid",
      fas: "solid",
      "fa-solid": "solid",
      far: "regular",
      "fa-regular": "regular",
      fal: "light",
      "fa-light": "light",
      fat: "thin",
      "fa-thin": "thin",
      fab: "brands",
      "fa-brands": "brands"
    },
    duotone: {
      fa: "solid",
      fad: "solid",
      "fa-solid": "solid",
      "fa-duotone": "solid",
      fadr: "regular",
      "fa-regular": "regular",
      fadl: "light",
      "fa-light": "light",
      fadt: "thin",
      "fa-thin": "thin"
    },
    sharp: {
      fa: "solid",
      fass: "solid",
      "fa-solid": "solid",
      fasr: "regular",
      "fa-regular": "regular",
      fasl: "light",
      "fa-light": "light",
      fast: "thin",
      "fa-thin": "thin"
    },
    "sharp-duotone": {
      fa: "solid",
      fasds: "solid",
      "fa-solid": "solid",
      fasdr: "regular",
      "fa-regular": "regular",
      fasdl: "light",
      "fa-light": "light",
      fasdt: "thin",
      "fa-thin": "thin"
    },
    slab: {
      "fa-regular": "regular",
      faslr: "regular"
    },
    "slab-press": {
      "fa-regular": "regular",
      faslpr: "regular"
    },
    thumbprint: {
      "fa-light": "light",
      fatl: "light"
    },
    whiteboard: {
      "fa-semibold": "semibold",
      fawsb: "semibold"
    },
    notdog: {
      "fa-solid": "solid",
      fans: "solid"
    },
    "notdog-duo": {
      "fa-solid": "solid",
      fands: "solid"
    },
    etch: {
      "fa-solid": "solid",
      faes: "solid"
    },
    graphite: {
      "fa-thin": "thin",
      fagt: "thin"
    },
    jelly: {
      "fa-regular": "regular",
      fajr: "regular"
    },
    "jelly-fill": {
      "fa-regular": "regular",
      fajfr: "regular"
    },
    "jelly-duo": {
      "fa-regular": "regular",
      fajdr: "regular"
    },
    chisel: {
      "fa-regular": "regular",
      facr: "regular"
    },
    utility: {
      "fa-semibold": "semibold",
      fausb: "semibold"
    },
    "utility-duo": {
      "fa-semibold": "semibold",
      faudsb: "semibold"
    },
    "utility-fill": {
      "fa-semibold": "semibold",
      faufsb: "semibold"
    }
  }, X = {
    GROUP: "duotone-group",
    PRIMARY: "primary",
    SECONDARY: "secondary"
  }, Z$1 = ["fa-classic", "fa-duotone", "fa-sharp", "fa-sharp-duotone", "fa-thumbprint", "fa-whiteboard", "fa-notdog", "fa-notdog-duo", "fa-chisel", "fa-etch", "fa-graphite", "fa-jelly", "fa-jelly-fill", "fa-jelly-duo", "fa-slab", "fa-slab-press", "fa-utility", "fa-utility-duo", "fa-utility-fill"];
  var i = "classic", t = "duotone", d = "sharp", l$1 = "sharp-duotone", f = "chisel", h$1 = "etch", n = "graphite", g = "jelly", o = "jelly-duo", u = "jelly-fill", m = "notdog", e = "notdog-duo", y = "slab", p = "slab-press", s = "thumbprint", w = "utility", a = "utility-duo", x = "utility-fill", b = "whiteboard", c = "Classic", I = "Duotone", F = "Sharp", v$1 = "Sharp Duotone", S = "Chisel", A = "Etch", P = "Graphite", j = "Jelly", B = "Jelly Duo", N = "Jelly Fill", k$1 = "Notdog", D$1 = "Notdog Duo", T = "Slab", C = "Slab Press", W = "Thumbprint", K = "Utility", R = "Utility Duo", L = "Utility Fill", U = "Whiteboard", dt = [i, t, d, l$1, f, h$1, n, g, o, u, m, e, y, p, s, w, a, x, b];
  _ht = {}, _defineProperty$2(_defineProperty$2(_defineProperty$2(_defineProperty$2(_defineProperty$2(_defineProperty$2(_defineProperty$2(_defineProperty$2(_defineProperty$2(_defineProperty$2(_ht, i, c), t, I), d, F), l$1, v$1), f, S), h$1, A), n, P), g, j), o, B), u, N), _defineProperty$2(_defineProperty$2(_defineProperty$2(_defineProperty$2(_defineProperty$2(_defineProperty$2(_defineProperty$2(_defineProperty$2(_defineProperty$2(_ht, m, k$1), e, D$1), y, T), p, C), s, W), w, K), a, R), x, L), b, U);
  var yt = {
    classic: {
      900: "fas",
      400: "far",
      normal: "far",
      300: "fal",
      100: "fat"
    },
    duotone: {
      900: "fad",
      400: "fadr",
      300: "fadl",
      100: "fadt"
    },
    sharp: {
      900: "fass",
      400: "fasr",
      300: "fasl",
      100: "fast"
    },
    "sharp-duotone": {
      900: "fasds",
      400: "fasdr",
      300: "fasdl",
      100: "fasdt"
    },
    slab: {
      400: "faslr"
    },
    "slab-press": {
      400: "faslpr"
    },
    whiteboard: {
      600: "fawsb"
    },
    thumbprint: {
      300: "fatl"
    },
    notdog: {
      900: "fans"
    },
    "notdog-duo": {
      900: "fands"
    },
    etch: {
      900: "faes"
    },
    graphite: {
      100: "fagt"
    },
    chisel: {
      400: "facr"
    },
    jelly: {
      400: "fajr"
    },
    "jelly-fill": {
      400: "fajfr"
    },
    "jelly-duo": {
      400: "fajdr"
    },
    utility: {
      600: "fausb"
    },
    "utility-duo": {
      600: "faudsb"
    },
    "utility-fill": {
      600: "faufsb"
    }
  };
  var Kt = {
    "Font Awesome 7 Free": {
      900: "fas",
      400: "far"
    },
    "Font Awesome 7 Pro": {
      900: "fas",
      400: "far",
      normal: "far",
      300: "fal",
      100: "fat"
    },
    "Font Awesome 7 Brands": {
      400: "fab",
      normal: "fab"
    },
    "Font Awesome 7 Duotone": {
      900: "fad",
      400: "fadr",
      normal: "fadr",
      300: "fadl",
      100: "fadt"
    },
    "Font Awesome 7 Sharp": {
      900: "fass",
      400: "fasr",
      normal: "fasr",
      300: "fasl",
      100: "fast"
    },
    "Font Awesome 7 Sharp Duotone": {
      900: "fasds",
      400: "fasdr",
      normal: "fasdr",
      300: "fasdl",
      100: "fasdt"
    },
    "Font Awesome 7 Jelly": {
      400: "fajr",
      normal: "fajr"
    },
    "Font Awesome 7 Jelly Fill": {
      400: "fajfr",
      normal: "fajfr"
    },
    "Font Awesome 7 Jelly Duo": {
      400: "fajdr",
      normal: "fajdr"
    },
    "Font Awesome 7 Slab": {
      400: "faslr",
      normal: "faslr"
    },
    "Font Awesome 7 Slab Press": {
      400: "faslpr",
      normal: "faslpr"
    },
    "Font Awesome 7 Thumbprint": {
      300: "fatl",
      normal: "fatl"
    },
    "Font Awesome 7 Notdog": {
      900: "fans",
      normal: "fans"
    },
    "Font Awesome 7 Notdog Duo": {
      900: "fands",
      normal: "fands"
    },
    "Font Awesome 7 Etch": {
      900: "faes",
      normal: "faes"
    },
    "Font Awesome 7 Graphite": {
      100: "fagt",
      normal: "fagt"
    },
    "Font Awesome 7 Chisel": {
      400: "facr",
      normal: "facr"
    },
    "Font Awesome 7 Whiteboard": {
      600: "fawsb",
      normal: "fawsb"
    },
    "Font Awesome 7 Utility": {
      600: "fausb",
      normal: "fausb"
    },
    "Font Awesome 7 Utility Duo": {
      600: "faudsb",
      normal: "faudsb"
    },
    "Font Awesome 7 Utility Fill": {
      600: "faufsb",
      normal: "faufsb"
    }
  };
  var Et = /* @__PURE__ */ new Map([["classic", {
    defaultShortPrefixId: "fas",
    defaultStyleId: "solid",
    styleIds: ["solid", "regular", "light", "thin", "brands"],
    futureStyleIds: [],
    defaultFontWeight: 900
  }], ["duotone", {
    defaultShortPrefixId: "fad",
    defaultStyleId: "solid",
    styleIds: ["solid", "regular", "light", "thin"],
    futureStyleIds: [],
    defaultFontWeight: 900
  }], ["sharp", {
    defaultShortPrefixId: "fass",
    defaultStyleId: "solid",
    styleIds: ["solid", "regular", "light", "thin"],
    futureStyleIds: [],
    defaultFontWeight: 900
  }], ["sharp-duotone", {
    defaultShortPrefixId: "fasds",
    defaultStyleId: "solid",
    styleIds: ["solid", "regular", "light", "thin"],
    futureStyleIds: [],
    defaultFontWeight: 900
  }], ["chisel", {
    defaultShortPrefixId: "facr",
    defaultStyleId: "regular",
    styleIds: ["regular"],
    futureStyleIds: [],
    defaultFontWeight: 400
  }], ["etch", {
    defaultShortPrefixId: "faes",
    defaultStyleId: "solid",
    styleIds: ["solid"],
    futureStyleIds: [],
    defaultFontWeight: 900
  }], ["graphite", {
    defaultShortPrefixId: "fagt",
    defaultStyleId: "thin",
    styleIds: ["thin"],
    futureStyleIds: [],
    defaultFontWeight: 100
  }], ["jelly", {
    defaultShortPrefixId: "fajr",
    defaultStyleId: "regular",
    styleIds: ["regular"],
    futureStyleIds: [],
    defaultFontWeight: 400
  }], ["jelly-duo", {
    defaultShortPrefixId: "fajdr",
    defaultStyleId: "regular",
    styleIds: ["regular"],
    futureStyleIds: [],
    defaultFontWeight: 400
  }], ["jelly-fill", {
    defaultShortPrefixId: "fajfr",
    defaultStyleId: "regular",
    styleIds: ["regular"],
    futureStyleIds: [],
    defaultFontWeight: 400
  }], ["notdog", {
    defaultShortPrefixId: "fans",
    defaultStyleId: "solid",
    styleIds: ["solid"],
    futureStyleIds: [],
    defaultFontWeight: 900
  }], ["notdog-duo", {
    defaultShortPrefixId: "fands",
    defaultStyleId: "solid",
    styleIds: ["solid"],
    futureStyleIds: [],
    defaultFontWeight: 900
  }], ["slab", {
    defaultShortPrefixId: "faslr",
    defaultStyleId: "regular",
    styleIds: ["regular"],
    futureStyleIds: [],
    defaultFontWeight: 400
  }], ["slab-press", {
    defaultShortPrefixId: "faslpr",
    defaultStyleId: "regular",
    styleIds: ["regular"],
    futureStyleIds: [],
    defaultFontWeight: 400
  }], ["thumbprint", {
    defaultShortPrefixId: "fatl",
    defaultStyleId: "light",
    styleIds: ["light"],
    futureStyleIds: [],
    defaultFontWeight: 300
  }], ["utility", {
    defaultShortPrefixId: "fausb",
    defaultStyleId: "semibold",
    styleIds: ["semibold"],
    futureStyleIds: [],
    defaultFontWeight: 600
  }], ["utility-duo", {
    defaultShortPrefixId: "faudsb",
    defaultStyleId: "semibold",
    styleIds: ["semibold"],
    futureStyleIds: [],
    defaultFontWeight: 600
  }], ["utility-fill", {
    defaultShortPrefixId: "faufsb",
    defaultStyleId: "semibold",
    styleIds: ["semibold"],
    futureStyleIds: [],
    defaultFontWeight: 600
  }], ["whiteboard", {
    defaultShortPrefixId: "fawsb",
    defaultStyleId: "semibold",
    styleIds: ["semibold"],
    futureStyleIds: [],
    defaultFontWeight: 600
  }]]), Mt = {
    chisel: {
      regular: "facr"
    },
    classic: {
      brands: "fab",
      light: "fal",
      regular: "far",
      solid: "fas",
      thin: "fat"
    },
    duotone: {
      light: "fadl",
      regular: "fadr",
      solid: "fad",
      thin: "fadt"
    },
    etch: {
      solid: "faes"
    },
    graphite: {
      thin: "fagt"
    },
    jelly: {
      regular: "fajr"
    },
    "jelly-duo": {
      regular: "fajdr"
    },
    "jelly-fill": {
      regular: "fajfr"
    },
    notdog: {
      solid: "fans"
    },
    "notdog-duo": {
      solid: "fands"
    },
    sharp: {
      light: "fasl",
      regular: "fasr",
      solid: "fass",
      thin: "fast"
    },
    "sharp-duotone": {
      light: "fasdl",
      regular: "fasdr",
      solid: "fasds",
      thin: "fasdt"
    },
    slab: {
      regular: "faslr"
    },
    "slab-press": {
      regular: "faslpr"
    },
    thumbprint: {
      light: "fatl"
    },
    utility: {
      semibold: "fausb"
    },
    "utility-duo": {
      semibold: "faudsb"
    },
    "utility-fill": {
      semibold: "faufsb"
    },
    whiteboard: {
      semibold: "fawsb"
    }
  };
  var Ht = ["fak", "fa-kit", "fakd", "fa-kit-duotone"], Qt = {
    kit: {
      fak: "kit",
      "fa-kit": "kit"
    },
    "kit-duotone": {
      fakd: "kit-duotone",
      "fa-kit-duotone": "kit-duotone"
    }
  }, Xt = ["kit"];
  var J = "kit", r = "kit-duotone", E = "Kit", _$1 = "Kit Duotone";
  _defineProperty$2(_defineProperty$2({}, J, E), r, _$1);
  var sl = {
    kit: {
      "fa-kit": "fak"
    }
  };
  var hl = {
    "Font Awesome Kit": {
      400: "fak",
      normal: "fak"
    },
    "Font Awesome Kit Duotone": {
      400: "fakd",
      normal: "fakd"
    }
  }, nl = {
    kit: {
      fak: "fa-kit"
    }
  };
  var ml = {
    kit: {
      kit: "fak"
    },
    "kit-duotone": {
      "kit-duotone": "fakd"
    }
  };
  var _wt;
  var t$1 = {
    GROUP: "duotone-group",
    SWAP_OPACITY: "swap-opacity",
    PRIMARY: "primary",
    SECONDARY: "secondary"
  }, f$1 = ["fa-classic", "fa-duotone", "fa-sharp", "fa-sharp-duotone", "fa-thumbprint", "fa-whiteboard", "fa-notdog", "fa-notdog-duo", "fa-chisel", "fa-etch", "fa-graphite", "fa-jelly", "fa-jelly-fill", "fa-jelly-duo", "fa-slab", "fa-slab-press", "fa-utility", "fa-utility-duo", "fa-utility-fill"];
  var h$1$1 = "classic", o$1 = "duotone", n$1 = "sharp", s$1 = "sharp-duotone", u$1 = "chisel", g$1 = "etch", y$1 = "graphite", m$1 = "jelly", a$1 = "jelly-duo", p$1 = "jelly-fill", w$1 = "notdog", e$1 = "notdog-duo", b$1 = "slab", c$1 = "slab-press", r$1 = "thumbprint", x$1 = "utility", i$1 = "utility-duo", I$1 = "utility-fill", F$1 = "whiteboard", v$1$1 = "Classic", S$1 = "Duotone", A$1 = "Sharp", P$1 = "Sharp Duotone", j$1 = "Chisel", B$1 = "Etch", N$1 = "Graphite", k$1$1 = "Jelly", D$1$1 = "Jelly Duo", C$1 = "Jelly Fill", T$1 = "Notdog", L$1 = "Notdog Duo", W$1 = "Slab", R$1 = "Slab Press", K$1 = "Thumbprint", U$1 = "Utility", J$1 = "Utility Duo", E$1 = "Utility Fill", _$1$1 = "Whiteboard";
  _wt = {}, _defineProperty$2(_defineProperty$2(_defineProperty$2(_defineProperty$2(_defineProperty$2(_defineProperty$2(_defineProperty$2(_defineProperty$2(_defineProperty$2(_defineProperty$2(_wt, h$1$1, v$1$1), o$1, S$1), n$1, A$1), s$1, P$1), u$1, j$1), g$1, B$1), y$1, N$1), m$1, k$1$1), a$1, D$1$1), p$1, C$1), _defineProperty$2(_defineProperty$2(_defineProperty$2(_defineProperty$2(_defineProperty$2(_defineProperty$2(_defineProperty$2(_defineProperty$2(_defineProperty$2(_wt, w$1, T$1), e$1, L$1), b$1, W$1), c$1, R$1), r$1, K$1), x$1, U$1), i$1, J$1), I$1, E$1), F$1, _$1$1);
  var G$1 = "kit", d$1 = "kit-duotone", M$1 = "Kit", O = "Kit Duotone";
  _defineProperty$2(_defineProperty$2({}, G$1, M$1), d$1, O);
  var Hl = {
    classic: {
      "fa-brands": "fab",
      "fa-duotone": "fad",
      "fa-light": "fal",
      "fa-regular": "far",
      "fa-solid": "fas",
      "fa-thin": "fat"
    },
    duotone: {
      "fa-regular": "fadr",
      "fa-light": "fadl",
      "fa-thin": "fadt"
    },
    sharp: {
      "fa-solid": "fass",
      "fa-regular": "fasr",
      "fa-light": "fasl",
      "fa-thin": "fast"
    },
    "sharp-duotone": {
      "fa-solid": "fasds",
      "fa-regular": "fasdr",
      "fa-light": "fasdl",
      "fa-thin": "fasdt"
    },
    slab: {
      "fa-regular": "faslr"
    },
    "slab-press": {
      "fa-regular": "faslpr"
    },
    whiteboard: {
      "fa-semibold": "fawsb"
    },
    thumbprint: {
      "fa-light": "fatl"
    },
    notdog: {
      "fa-solid": "fans"
    },
    "notdog-duo": {
      "fa-solid": "fands"
    },
    etch: {
      "fa-solid": "faes"
    },
    graphite: {
      "fa-thin": "fagt"
    },
    jelly: {
      "fa-regular": "fajr"
    },
    "jelly-fill": {
      "fa-regular": "fajfr"
    },
    "jelly-duo": {
      "fa-regular": "fajdr"
    },
    chisel: {
      "fa-regular": "facr"
    },
    utility: {
      "fa-semibold": "fausb"
    },
    "utility-duo": {
      "fa-semibold": "faudsb"
    },
    "utility-fill": {
      "fa-semibold": "faufsb"
    }
  }, Y$1 = {
    classic: ["fas", "far", "fal", "fat", "fad"],
    duotone: ["fadr", "fadl", "fadt"],
    sharp: ["fass", "fasr", "fasl", "fast"],
    "sharp-duotone": ["fasds", "fasdr", "fasdl", "fasdt"],
    slab: ["faslr"],
    "slab-press": ["faslpr"],
    whiteboard: ["fawsb"],
    thumbprint: ["fatl"],
    notdog: ["fans"],
    "notdog-duo": ["fands"],
    etch: ["faes"],
    graphite: ["fagt"],
    jelly: ["fajr"],
    "jelly-fill": ["fajfr"],
    "jelly-duo": ["fajdr"],
    chisel: ["facr"],
    utility: ["fausb"],
    "utility-duo": ["faudsb"],
    "utility-fill": ["faufsb"]
  }, Xl = {
    classic: {
      fab: "fa-brands",
      fad: "fa-duotone",
      fal: "fa-light",
      far: "fa-regular",
      fas: "fa-solid",
      fat: "fa-thin"
    },
    duotone: {
      fadr: "fa-regular",
      fadl: "fa-light",
      fadt: "fa-thin"
    },
    sharp: {
      fass: "fa-solid",
      fasr: "fa-regular",
      fasl: "fa-light",
      fast: "fa-thin"
    },
    "sharp-duotone": {
      fasds: "fa-solid",
      fasdr: "fa-regular",
      fasdl: "fa-light",
      fasdt: "fa-thin"
    },
    slab: {
      faslr: "fa-regular"
    },
    "slab-press": {
      faslpr: "fa-regular"
    },
    whiteboard: {
      fawsb: "fa-semibold"
    },
    thumbprint: {
      fatl: "fa-light"
    },
    notdog: {
      fans: "fa-solid"
    },
    "notdog-duo": {
      fands: "fa-solid"
    },
    etch: {
      faes: "fa-solid"
    },
    graphite: {
      fagt: "fa-thin"
    },
    jelly: {
      fajr: "fa-regular"
    },
    "jelly-fill": {
      fajfr: "fa-regular"
    },
    "jelly-duo": {
      fajdr: "fa-regular"
    },
    chisel: {
      facr: "fa-regular"
    },
    utility: {
      fausb: "fa-semibold"
    },
    "utility-duo": {
      faudsb: "fa-semibold"
    },
    "utility-fill": {
      faufsb: "fa-semibold"
    }
  }, V$1 = ["fa-solid", "fa-regular", "fa-light", "fa-thin", "fa-duotone", "fa-brands", "fa-semibold"], lo = ["fa", "fas", "far", "fal", "fat", "fad", "fadr", "fadl", "fadt", "fab", "fass", "fasr", "fasl", "fast", "fasds", "fasdr", "fasdl", "fasdt", "faslr", "faslpr", "fawsb", "fatl", "fans", "fands", "faes", "fagt", "fajr", "fajfr", "fajdr", "facr", "fausb", "faudsb", "faufsb"].concat(f$1, V$1), $$1 = ["solid", "regular", "light", "thin", "duotone", "brands", "semibold"], z$1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], q$1 = z$1.concat([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]), H$1 = ["aw", "fw", "pull-left", "pull-right"], so = [].concat(_toConsumableArray(Object.keys(Y$1)), $$1, H$1, ["2xs", "xs", "sm", "lg", "xl", "2xl", "beat", "border", "fade", "beat-fade", "bounce", "flip-both", "flip-horizontal", "flip-vertical", "flip", "inverse", "layers", "layers-bottom-left", "layers-bottom-right", "layers-counter", "layers-text", "layers-top-left", "layers-top-right", "li", "pull-end", "pull-start", "pulse", "rotate-180", "rotate-270", "rotate-90", "rotate-by", "shake", "spin-pulse", "spin-reverse", "spin", "stack-1x", "stack-2x", "stack", "ul", "width-auto", "width-fixed", t$1.GROUP, t$1.SWAP_OPACITY, t$1.PRIMARY, t$1.SECONDARY]).concat(z$1.map(function(l2) {
    return "".concat(l2, "x");
  })).concat(q$1.map(function(l2) {
    return "w-".concat(l2);
  }));
  var fo = {
    "Font Awesome 5 Free": {
      900: "fas",
      400: "far"
    },
    "Font Awesome 5 Pro": {
      900: "fas",
      400: "far",
      normal: "far",
      300: "fal"
    },
    "Font Awesome 5 Brands": {
      400: "fab",
      normal: "fab"
    },
    "Font Awesome 5 Duotone": {
      900: "fad"
    }
  };
  var NAMESPACE_IDENTIFIER = "___FONT_AWESOME___";
  var UNITS_IN_GRID = 16;
  var DEFAULT_CSS_PREFIX = "fa";
  var DEFAULT_REPLACEMENT_CLASS = "svg-inline--fa";
  var DATA_FA_I2SVG = "data-fa-i2svg";
  var DATA_FA_PSEUDO_ELEMENT = "data-fa-pseudo-element";
  var DATA_FA_PSEUDO_ELEMENT_PENDING = "data-fa-pseudo-element-pending";
  var DATA_PREFIX = "data-prefix";
  var DATA_ICON = "data-icon";
  var HTML_CLASS_I2SVG_BASE_CLASS = "fontawesome-i2svg";
  var MUTATION_APPROACH_ASYNC = "async";
  var TAGNAMES_TO_SKIP_FOR_PSEUDOELEMENTS = ["HTML", "HEAD", "STYLE", "SCRIPT"];
  var PSEUDO_ELEMENTS = ["::before", "::after", ":before", ":after"];
  var PRODUCTION = function() {
    try {
      return true;
    } catch (e$$1) {
      return false;
    }
  }();
  function familyProxy(obj) {
    return new Proxy(obj, {
      get: function get2(target, prop) {
        return prop in target ? target[prop] : target[i];
      }
    });
  }
  var _PREFIX_TO_STYLE = _objectSpread2$2({}, Q);
  _PREFIX_TO_STYLE[i] = _objectSpread2$2(_objectSpread2$2(_objectSpread2$2(_objectSpread2$2({}, {
    "fa-duotone": "duotone"
  }), Q[i]), Qt["kit"]), Qt["kit-duotone"]);
  var PREFIX_TO_STYLE = familyProxy(_PREFIX_TO_STYLE);
  var _STYLE_TO_PREFIX = _objectSpread2$2({}, Mt);
  _STYLE_TO_PREFIX[i] = _objectSpread2$2(_objectSpread2$2(_objectSpread2$2(_objectSpread2$2({}, {
    duotone: "fad"
  }), _STYLE_TO_PREFIX[i]), ml["kit"]), ml["kit-duotone"]);
  var STYLE_TO_PREFIX = familyProxy(_STYLE_TO_PREFIX);
  var _PREFIX_TO_LONG_STYLE = _objectSpread2$2({}, Xl);
  _PREFIX_TO_LONG_STYLE[i] = _objectSpread2$2(_objectSpread2$2({}, _PREFIX_TO_LONG_STYLE[i]), nl["kit"]);
  var PREFIX_TO_LONG_STYLE = familyProxy(_PREFIX_TO_LONG_STYLE);
  var _LONG_STYLE_TO_PREFIX = _objectSpread2$2({}, Hl);
  _LONG_STYLE_TO_PREFIX[i] = _objectSpread2$2(_objectSpread2$2({}, _LONG_STYLE_TO_PREFIX[i]), sl["kit"]);
  familyProxy(_LONG_STYLE_TO_PREFIX);
  var ICON_SELECTION_SYNTAX_PATTERN = G;
  var LAYERS_TEXT_CLASSNAME = "fa-layers-text";
  var FONT_FAMILY_PATTERN = M;
  var _FONT_WEIGHT_TO_PREFIX = _objectSpread2$2({}, yt);
  familyProxy(_FONT_WEIGHT_TO_PREFIX);
  var ATTRIBUTES_WATCHED_FOR_MUTATION = ["class", "data-prefix", "data-icon", "data-fa-transform", "data-fa-mask"];
  var DUOTONE_CLASSES = X;
  var RESERVED_CLASSES = [].concat(_toConsumableArray(Xt), _toConsumableArray(so));
  var initial = WINDOW.FontAwesomeConfig || {};
  function getAttrConfig(attr) {
    var element = DOCUMENT.querySelector("script[" + attr + "]");
    if (element) {
      return element.getAttribute(attr);
    }
  }
  function coerce(val) {
    if (val === "") return true;
    if (val === "false") return false;
    if (val === "true") return true;
    return val;
  }
  if (DOCUMENT && typeof DOCUMENT.querySelector === "function") {
    var attrs = [["data-family-prefix", "familyPrefix"], ["data-css-prefix", "cssPrefix"], ["data-family-default", "familyDefault"], ["data-style-default", "styleDefault"], ["data-replacement-class", "replacementClass"], ["data-auto-replace-svg", "autoReplaceSvg"], ["data-auto-add-css", "autoAddCss"], ["data-search-pseudo-elements", "searchPseudoElements"], ["data-search-pseudo-elements-warnings", "searchPseudoElementsWarnings"], ["data-search-pseudo-elements-full-scan", "searchPseudoElementsFullScan"], ["data-observe-mutations", "observeMutations"], ["data-mutate-approach", "mutateApproach"], ["data-keep-original-source", "keepOriginalSource"], ["data-measure-performance", "measurePerformance"], ["data-show-missing-icons", "showMissingIcons"]];
    attrs.forEach(function(_ref2) {
      var _ref22 = _slicedToArray$1(_ref2, 2), attr = _ref22[0], key = _ref22[1];
      var val = coerce(getAttrConfig(attr));
      if (val !== void 0 && val !== null) {
        initial[key] = val;
      }
    });
  }
  var _default = {
    styleDefault: "solid",
    familyDefault: i,
    cssPrefix: DEFAULT_CSS_PREFIX,
    replacementClass: DEFAULT_REPLACEMENT_CLASS,
    autoReplaceSvg: true,
    autoAddCss: true,
    searchPseudoElements: false,
    searchPseudoElementsWarnings: true,
    searchPseudoElementsFullScan: false,
    observeMutations: true,
    mutateApproach: "async",
    keepOriginalSource: true,
    measurePerformance: false,
    showMissingIcons: true
  };
  if (initial.familyPrefix) {
    initial.cssPrefix = initial.familyPrefix;
  }
  var _config = _objectSpread2$2(_objectSpread2$2({}, _default), initial);
  if (!_config.autoReplaceSvg) _config.observeMutations = false;
  var config$2 = {};
  Object.keys(_default).forEach(function(key) {
    Object.defineProperty(config$2, key, {
      enumerable: true,
      set: function set2(val) {
        _config[key] = val;
        _onChangeCb.forEach(function(cb2) {
          return cb2(config$2);
        });
      },
      get: function get2() {
        return _config[key];
      }
    });
  });
  Object.defineProperty(config$2, "familyPrefix", {
    enumerable: true,
    set: function set(val) {
      _config.cssPrefix = val;
      _onChangeCb.forEach(function(cb2) {
        return cb2(config$2);
      });
    },
    get: function get() {
      return _config.cssPrefix;
    }
  });
  WINDOW.FontAwesomeConfig = config$2;
  var _onChangeCb = [];
  function onChange(cb2) {
    _onChangeCb.push(cb2);
    return function() {
      _onChangeCb.splice(_onChangeCb.indexOf(cb2), 1);
    };
  }
  var d$2 = UNITS_IN_GRID;
  var meaninglessTransform = {
    size: 16,
    x: 0,
    y: 0,
    rotate: 0,
    flipX: false,
    flipY: false
  };
  function insertCss(css2) {
    if (!css2 || !IS_DOM) {
      return;
    }
    var style = DOCUMENT.createElement("style");
    style.setAttribute("type", "text/css");
    style.innerHTML = css2;
    var headChildren = DOCUMENT.head.childNodes;
    var beforeChild = null;
    for (var i2 = headChildren.length - 1; i2 > -1; i2--) {
      var child = headChildren[i2];
      var tagName = (child.tagName || "").toUpperCase();
      if (["STYLE", "LINK"].indexOf(tagName) > -1) {
        beforeChild = child;
      }
    }
    DOCUMENT.head.insertBefore(style, beforeChild);
    return css2;
  }
  var idPool = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  function nextUniqueId() {
    var size = 12;
    var id2 = "";
    while (size-- > 0) {
      id2 += idPool[Math.random() * 62 | 0];
    }
    return id2;
  }
  function toArray(obj) {
    var array = [];
    for (var i2 = (obj || []).length >>> 0; i2--; ) {
      array[i2] = obj[i2];
    }
    return array;
  }
  function classArray(node) {
    if (node.classList) {
      return toArray(node.classList);
    } else {
      return (node.getAttribute("class") || "").split(" ").filter(function(i2) {
        return i2;
      });
    }
  }
  function htmlEscape(str) {
    return "".concat(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function joinAttributes(attributes) {
    return Object.keys(attributes || {}).reduce(function(acc, attributeName) {
      return acc + "".concat(attributeName, '="').concat(htmlEscape(attributes[attributeName]), '" ');
    }, "").trim();
  }
  function joinStyles(styles2) {
    return Object.keys(styles2 || {}).reduce(function(acc, styleName) {
      return acc + "".concat(styleName, ": ").concat(styles2[styleName].trim(), ";");
    }, "");
  }
  function transformIsMeaningful(transform) {
    return transform.size !== meaninglessTransform.size || transform.x !== meaninglessTransform.x || transform.y !== meaninglessTransform.y || transform.rotate !== meaninglessTransform.rotate || transform.flipX || transform.flipY;
  }
  function transformForSvg(_ref2) {
    var transform = _ref2.transform, containerWidth = _ref2.containerWidth, iconWidth = _ref2.iconWidth;
    var outer = {
      transform: "translate(".concat(containerWidth / 2, " 256)")
    };
    var innerTranslate = "translate(".concat(transform.x * 32, ", ").concat(transform.y * 32, ") ");
    var innerScale = "scale(".concat(transform.size / 16 * (transform.flipX ? -1 : 1), ", ").concat(transform.size / 16 * (transform.flipY ? -1 : 1), ") ");
    var innerRotate = "rotate(".concat(transform.rotate, " 0 0)");
    var inner = {
      transform: "".concat(innerTranslate, " ").concat(innerScale, " ").concat(innerRotate)
    };
    var path = {
      transform: "translate(".concat(iconWidth / 2 * -1, " -256)")
    };
    return {
      outer,
      inner,
      path
    };
  }
  function transformForCss(_ref2) {
    var transform = _ref2.transform, _ref2$width = _ref2.width, width = _ref2$width === void 0 ? UNITS_IN_GRID : _ref2$width, _ref2$height = _ref2.height, height = _ref2$height === void 0 ? UNITS_IN_GRID : _ref2$height;
    var val = "";
    if (IS_IE) {
      val += "translate(".concat(transform.x / d$2 - width / 2, "em, ").concat(transform.y / d$2 - height / 2, "em) ");
    } else {
      val += "translate(calc(-50% + ".concat(transform.x / d$2, "em), calc(-50% + ").concat(transform.y / d$2, "em)) ");
    }
    val += "scale(".concat(transform.size / d$2 * (transform.flipX ? -1 : 1), ", ").concat(transform.size / d$2 * (transform.flipY ? -1 : 1), ") ");
    val += "rotate(".concat(transform.rotate, "deg) ");
    return val;
  }
  var baseStyles = ":root, :host {\n  --fa-font-solid: normal 900 1em/1 'Font Awesome 7 Free';\n  --fa-font-regular: normal 400 1em/1 'Font Awesome 7 Free';\n  --fa-font-light: normal 300 1em/1 'Font Awesome 7 Pro';\n  --fa-font-thin: normal 100 1em/1 'Font Awesome 7 Pro';\n  --fa-font-duotone: normal 900 1em/1 'Font Awesome 7 Duotone';\n  --fa-font-duotone-regular: normal 400 1em/1 'Font Awesome 7 Duotone';\n  --fa-font-duotone-light: normal 300 1em/1 'Font Awesome 7 Duotone';\n  --fa-font-duotone-thin: normal 100 1em/1 'Font Awesome 7 Duotone';\n  --fa-font-brands: normal 400 1em/1 'Font Awesome 7 Brands';\n  --fa-font-sharp-solid: normal 900 1em/1 'Font Awesome 7 Sharp';\n  --fa-font-sharp-regular: normal 400 1em/1 'Font Awesome 7 Sharp';\n  --fa-font-sharp-light: normal 300 1em/1 'Font Awesome 7 Sharp';\n  --fa-font-sharp-thin: normal 100 1em/1 'Font Awesome 7 Sharp';\n  --fa-font-sharp-duotone-solid: normal 900 1em/1 'Font Awesome 7 Sharp Duotone';\n  --fa-font-sharp-duotone-regular: normal 400 1em/1 'Font Awesome 7 Sharp Duotone';\n  --fa-font-sharp-duotone-light: normal 300 1em/1 'Font Awesome 7 Sharp Duotone';\n  --fa-font-sharp-duotone-thin: normal 100 1em/1 'Font Awesome 7 Sharp Duotone';\n  --fa-font-slab-regular: normal 400 1em/1 'Font Awesome 7 Slab';\n  --fa-font-slab-press-regular: normal 400 1em/1 'Font Awesome 7 Slab Press';\n  --fa-font-whiteboard-semibold: normal 600 1em/1 'Font Awesome 7 Whiteboard';\n  --fa-font-thumbprint-light: normal 300 1em/1 'Font Awesome 7 Thumbprint';\n  --fa-font-notdog-solid: normal 900 1em/1 'Font Awesome 7 Notdog';\n  --fa-font-notdog-duo-solid: normal 900 1em/1 'Font Awesome 7 Notdog Duo';\n  --fa-font-etch-solid: normal 900 1em/1 'Font Awesome 7 Etch';\n  --fa-font-graphite-thin: normal 100 1em/1 'Font Awesome 7 Graphite';\n  --fa-font-jelly-regular: normal 400 1em/1 'Font Awesome 7 Jelly';\n  --fa-font-jelly-fill-regular: normal 400 1em/1 'Font Awesome 7 Jelly Fill';\n  --fa-font-jelly-duo-regular: normal 400 1em/1 'Font Awesome 7 Jelly Duo';\n  --fa-font-chisel-regular: normal 400 1em/1 'Font Awesome 7 Chisel';\n  --fa-font-utility-semibold: normal 600 1em/1 'Font Awesome 7 Utility';\n  --fa-font-utility-duo-semibold: normal 600 1em/1 'Font Awesome 7 Utility Duo';\n  --fa-font-utility-fill-semibold: normal 600 1em/1 'Font Awesome 7 Utility Fill';\n}\n\n.svg-inline--fa {\n  box-sizing: content-box;\n  display: var(--fa-display, inline-block);\n  height: 1em;\n  overflow: visible;\n  vertical-align: -0.125em;\n  width: var(--fa-width, 1.25em);\n}\n.svg-inline--fa.fa-2xs {\n  vertical-align: 0.1em;\n}\n.svg-inline--fa.fa-xs {\n  vertical-align: 0em;\n}\n.svg-inline--fa.fa-sm {\n  vertical-align: -0.0714285714em;\n}\n.svg-inline--fa.fa-lg {\n  vertical-align: -0.2em;\n}\n.svg-inline--fa.fa-xl {\n  vertical-align: -0.25em;\n}\n.svg-inline--fa.fa-2xl {\n  vertical-align: -0.3125em;\n}\n.svg-inline--fa.fa-pull-left,\n.svg-inline--fa .fa-pull-start {\n  float: inline-start;\n  margin-inline-end: var(--fa-pull-margin, 0.3em);\n}\n.svg-inline--fa.fa-pull-right,\n.svg-inline--fa .fa-pull-end {\n  float: inline-end;\n  margin-inline-start: var(--fa-pull-margin, 0.3em);\n}\n.svg-inline--fa.fa-li {\n  width: var(--fa-li-width, 2em);\n  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));\n  inset-block-start: 0.25em; /* syncing vertical alignment with Web Font rendering */\n}\n\n.fa-layers-counter, .fa-layers-text {\n  display: inline-block;\n  position: absolute;\n  text-align: center;\n}\n\n.fa-layers {\n  display: inline-block;\n  height: 1em;\n  position: relative;\n  text-align: center;\n  vertical-align: -0.125em;\n  width: var(--fa-width, 1.25em);\n}\n.fa-layers .svg-inline--fa {\n  inset: 0;\n  margin: auto;\n  position: absolute;\n  transform-origin: center center;\n}\n\n.fa-layers-text {\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  transform-origin: center center;\n}\n\n.fa-layers-counter {\n  background-color: var(--fa-counter-background-color, #ff253a);\n  border-radius: var(--fa-counter-border-radius, 1em);\n  box-sizing: border-box;\n  color: var(--fa-inverse, #fff);\n  line-height: var(--fa-counter-line-height, 1);\n  max-width: var(--fa-counter-max-width, 5em);\n  min-width: var(--fa-counter-min-width, 1.5em);\n  overflow: hidden;\n  padding: var(--fa-counter-padding, 0.25em 0.5em);\n  right: var(--fa-right, 0);\n  text-overflow: ellipsis;\n  top: var(--fa-top, 0);\n  transform: scale(var(--fa-counter-scale, 0.25));\n  transform-origin: top right;\n}\n\n.fa-layers-bottom-right {\n  bottom: var(--fa-bottom, 0);\n  right: var(--fa-right, 0);\n  top: auto;\n  transform: scale(var(--fa-layers-scale, 0.25));\n  transform-origin: bottom right;\n}\n\n.fa-layers-bottom-left {\n  bottom: var(--fa-bottom, 0);\n  left: var(--fa-left, 0);\n  right: auto;\n  top: auto;\n  transform: scale(var(--fa-layers-scale, 0.25));\n  transform-origin: bottom left;\n}\n\n.fa-layers-top-right {\n  top: var(--fa-top, 0);\n  right: var(--fa-right, 0);\n  transform: scale(var(--fa-layers-scale, 0.25));\n  transform-origin: top right;\n}\n\n.fa-layers-top-left {\n  left: var(--fa-left, 0);\n  right: auto;\n  top: var(--fa-top, 0);\n  transform: scale(var(--fa-layers-scale, 0.25));\n  transform-origin: top left;\n}\n\n.fa-1x {\n  font-size: 1em;\n}\n\n.fa-2x {\n  font-size: 2em;\n}\n\n.fa-3x {\n  font-size: 3em;\n}\n\n.fa-4x {\n  font-size: 4em;\n}\n\n.fa-5x {\n  font-size: 5em;\n}\n\n.fa-6x {\n  font-size: 6em;\n}\n\n.fa-7x {\n  font-size: 7em;\n}\n\n.fa-8x {\n  font-size: 8em;\n}\n\n.fa-9x {\n  font-size: 9em;\n}\n\n.fa-10x {\n  font-size: 10em;\n}\n\n.fa-2xs {\n  font-size: calc(10 / 16 * 1em); /* converts a 10px size into an em-based value that's relative to the scale's 16px base */\n  line-height: calc(1 / 10 * 1em); /* sets the line-height of the icon back to that of it's parent */\n  vertical-align: calc((6 / 10 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */\n}\n\n.fa-xs {\n  font-size: calc(12 / 16 * 1em); /* converts a 12px size into an em-based value that's relative to the scale's 16px base */\n  line-height: calc(1 / 12 * 1em); /* sets the line-height of the icon back to that of it's parent */\n  vertical-align: calc((6 / 12 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */\n}\n\n.fa-sm {\n  font-size: calc(14 / 16 * 1em); /* converts a 14px size into an em-based value that's relative to the scale's 16px base */\n  line-height: calc(1 / 14 * 1em); /* sets the line-height of the icon back to that of it's parent */\n  vertical-align: calc((6 / 14 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */\n}\n\n.fa-lg {\n  font-size: calc(20 / 16 * 1em); /* converts a 20px size into an em-based value that's relative to the scale's 16px base */\n  line-height: calc(1 / 20 * 1em); /* sets the line-height of the icon back to that of it's parent */\n  vertical-align: calc((6 / 20 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */\n}\n\n.fa-xl {\n  font-size: calc(24 / 16 * 1em); /* converts a 24px size into an em-based value that's relative to the scale's 16px base */\n  line-height: calc(1 / 24 * 1em); /* sets the line-height of the icon back to that of it's parent */\n  vertical-align: calc((6 / 24 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */\n}\n\n.fa-2xl {\n  font-size: calc(32 / 16 * 1em); /* converts a 32px size into an em-based value that's relative to the scale's 16px base */\n  line-height: calc(1 / 32 * 1em); /* sets the line-height of the icon back to that of it's parent */\n  vertical-align: calc((6 / 32 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */\n}\n\n.fa-width-auto {\n  --fa-width: auto;\n}\n\n.fa-fw,\n.fa-width-fixed {\n  --fa-width: 1.25em;\n}\n\n.fa-ul {\n  list-style-type: none;\n  margin-inline-start: var(--fa-li-margin, 2.5em);\n  padding-inline-start: 0;\n}\n.fa-ul > li {\n  position: relative;\n}\n\n.fa-li {\n  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));\n  position: absolute;\n  text-align: center;\n  width: var(--fa-li-width, 2em);\n  line-height: inherit;\n}\n\n/* Heads Up: Bordered Icons will not be supported in the future!\n  - This feature will be deprecated in the next major release of Font Awesome (v8)!\n  - You may continue to use it in this version *v7), but it will not be supported in Font Awesome v8.\n*/\n/* Notes:\n* --@{v.$css-prefix}-border-width = 1/16 by default (to render as ~1px based on a 16px default font-size)\n* --@{v.$css-prefix}-border-padding =\n  ** 3/16 for vertical padding (to give ~2px of vertical whitespace around an icon considering it's vertical alignment)\n  ** 4/16 for horizontal padding (to give ~4px of horizontal whitespace around an icon)\n*/\n.fa-border {\n  border-color: var(--fa-border-color, #eee);\n  border-radius: var(--fa-border-radius, 0.1em);\n  border-style: var(--fa-border-style, solid);\n  border-width: var(--fa-border-width, 0.0625em);\n  box-sizing: var(--fa-border-box-sizing, content-box);\n  padding: var(--fa-border-padding, 0.1875em 0.25em);\n}\n\n.fa-pull-left,\n.fa-pull-start {\n  float: inline-start;\n  margin-inline-end: var(--fa-pull-margin, 0.3em);\n}\n\n.fa-pull-right,\n.fa-pull-end {\n  float: inline-end;\n  margin-inline-start: var(--fa-pull-margin, 0.3em);\n}\n\n.fa-beat {\n  animation-name: fa-beat;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, ease-in-out);\n}\n\n.fa-bounce {\n  animation-name: fa-bounce;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));\n}\n\n.fa-fade {\n  animation-name: fa-fade;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));\n}\n\n.fa-beat-fade {\n  animation-name: fa-beat-fade;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));\n}\n\n.fa-flip {\n  animation-name: fa-flip;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, ease-in-out);\n}\n\n.fa-shake {\n  animation-name: fa-shake;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, linear);\n}\n\n.fa-spin {\n  animation-name: fa-spin;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 2s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, linear);\n}\n\n.fa-spin-reverse {\n  --fa-animation-direction: reverse;\n}\n\n.fa-pulse,\n.fa-spin-pulse {\n  animation-name: fa-spin;\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, steps(8));\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .fa-beat,\n  .fa-bounce,\n  .fa-fade,\n  .fa-beat-fade,\n  .fa-flip,\n  .fa-pulse,\n  .fa-shake,\n  .fa-spin,\n  .fa-spin-pulse {\n    animation: none !important;\n    transition: none !important;\n  }\n}\n@keyframes fa-beat {\n  0%, 90% {\n    transform: scale(1);\n  }\n  45% {\n    transform: scale(var(--fa-beat-scale, 1.25));\n  }\n}\n@keyframes fa-bounce {\n  0% {\n    transform: scale(1, 1) translateY(0);\n  }\n  10% {\n    transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);\n  }\n  30% {\n    transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));\n  }\n  50% {\n    transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);\n  }\n  57% {\n    transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));\n  }\n  64% {\n    transform: scale(1, 1) translateY(0);\n  }\n  100% {\n    transform: scale(1, 1) translateY(0);\n  }\n}\n@keyframes fa-fade {\n  50% {\n    opacity: var(--fa-fade-opacity, 0.4);\n  }\n}\n@keyframes fa-beat-fade {\n  0%, 100% {\n    opacity: var(--fa-beat-fade-opacity, 0.4);\n    transform: scale(1);\n  }\n  50% {\n    opacity: 1;\n    transform: scale(var(--fa-beat-fade-scale, 1.125));\n  }\n}\n@keyframes fa-flip {\n  50% {\n    transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));\n  }\n}\n@keyframes fa-shake {\n  0% {\n    transform: rotate(-15deg);\n  }\n  4% {\n    transform: rotate(15deg);\n  }\n  8%, 24% {\n    transform: rotate(-18deg);\n  }\n  12%, 28% {\n    transform: rotate(18deg);\n  }\n  16% {\n    transform: rotate(-22deg);\n  }\n  20% {\n    transform: rotate(22deg);\n  }\n  32% {\n    transform: rotate(-12deg);\n  }\n  36% {\n    transform: rotate(12deg);\n  }\n  40%, 100% {\n    transform: rotate(0deg);\n  }\n}\n@keyframes fa-spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n.fa-rotate-90 {\n  transform: rotate(90deg);\n}\n\n.fa-rotate-180 {\n  transform: rotate(180deg);\n}\n\n.fa-rotate-270 {\n  transform: rotate(270deg);\n}\n\n.fa-flip-horizontal {\n  transform: scale(-1, 1);\n}\n\n.fa-flip-vertical {\n  transform: scale(1, -1);\n}\n\n.fa-flip-both,\n.fa-flip-horizontal.fa-flip-vertical {\n  transform: scale(-1, -1);\n}\n\n.fa-rotate-by {\n  transform: rotate(var(--fa-rotate-angle, 0));\n}\n\n.svg-inline--fa .fa-primary {\n  fill: var(--fa-primary-color, currentColor);\n  opacity: var(--fa-primary-opacity, 1);\n}\n\n.svg-inline--fa .fa-secondary {\n  fill: var(--fa-secondary-color, currentColor);\n  opacity: var(--fa-secondary-opacity, 0.4);\n}\n\n.svg-inline--fa.fa-swap-opacity .fa-primary {\n  opacity: var(--fa-secondary-opacity, 0.4);\n}\n\n.svg-inline--fa.fa-swap-opacity .fa-secondary {\n  opacity: var(--fa-primary-opacity, 1);\n}\n\n.svg-inline--fa mask .fa-primary,\n.svg-inline--fa mask .fa-secondary {\n  fill: black;\n}\n\n.svg-inline--fa.fa-inverse {\n  fill: var(--fa-inverse, #fff);\n}\n\n.fa-stack {\n  display: inline-block;\n  height: 2em;\n  line-height: 2em;\n  position: relative;\n  vertical-align: middle;\n  width: 2.5em;\n}\n\n.fa-inverse {\n  color: var(--fa-inverse, #fff);\n}\n\n.svg-inline--fa.fa-stack-1x {\n  --fa-width: 1.25em;\n  height: 1em;\n  width: var(--fa-width);\n}\n.svg-inline--fa.fa-stack-2x {\n  --fa-width: 2.5em;\n  height: 2em;\n  width: var(--fa-width);\n}\n\n.fa-stack-1x,\n.fa-stack-2x {\n  inset: 0;\n  margin: auto;\n  position: absolute;\n  z-index: var(--fa-stack-z-index, auto);\n}";
  function css() {
    var dcp = DEFAULT_CSS_PREFIX;
    var drc = DEFAULT_REPLACEMENT_CLASS;
    var fp = config$2.cssPrefix;
    var rc2 = config$2.replacementClass;
    var s2 = baseStyles;
    if (fp !== dcp || rc2 !== drc) {
      var dPatt = new RegExp("\\.".concat(dcp, "\\-"), "g");
      var customPropPatt = new RegExp("\\--".concat(dcp, "\\-"), "g");
      var rPatt = new RegExp("\\.".concat(drc), "g");
      s2 = s2.replace(dPatt, ".".concat(fp, "-")).replace(customPropPatt, "--".concat(fp, "-")).replace(rPatt, ".".concat(rc2));
    }
    return s2;
  }
  var _cssInserted = false;
  function ensureCss() {
    if (config$2.autoAddCss && !_cssInserted) {
      insertCss(css());
      _cssInserted = true;
    }
  }
  var InjectCSS = {
    mixout: function mixout() {
      return {
        dom: {
          css,
          insertCss: ensureCss
        }
      };
    },
    hooks: function hooks() {
      return {
        beforeDOMElementCreation: function beforeDOMElementCreation() {
          ensureCss();
        },
        beforeI2svg: function beforeI2svg() {
          ensureCss();
        }
      };
    }
  };
  var w$2 = WINDOW || {};
  if (!w$2[NAMESPACE_IDENTIFIER]) w$2[NAMESPACE_IDENTIFIER] = {};
  if (!w$2[NAMESPACE_IDENTIFIER].styles) w$2[NAMESPACE_IDENTIFIER].styles = {};
  if (!w$2[NAMESPACE_IDENTIFIER].hooks) w$2[NAMESPACE_IDENTIFIER].hooks = {};
  if (!w$2[NAMESPACE_IDENTIFIER].shims) w$2[NAMESPACE_IDENTIFIER].shims = [];
  var namespace = w$2[NAMESPACE_IDENTIFIER];
  var functions = [];
  var _listener = function listener() {
    DOCUMENT.removeEventListener("DOMContentLoaded", _listener);
    loaded = 1;
    functions.map(function(fn) {
      return fn();
    });
  };
  var loaded = false;
  if (IS_DOM) {
    loaded = (DOCUMENT.documentElement.doScroll ? /^loaded|^c/ : /^loaded|^i|^c/).test(DOCUMENT.readyState);
    if (!loaded) DOCUMENT.addEventListener("DOMContentLoaded", _listener);
  }
  function domready(fn) {
    if (!IS_DOM) return;
    loaded ? setTimeout(fn, 0) : functions.push(fn);
  }
  function toHtml(abstractNodes) {
    var tag = abstractNodes.tag, _abstractNodes$attrib = abstractNodes.attributes, attributes = _abstractNodes$attrib === void 0 ? {} : _abstractNodes$attrib, _abstractNodes$childr = abstractNodes.children, children = _abstractNodes$childr === void 0 ? [] : _abstractNodes$childr;
    if (typeof abstractNodes === "string") {
      return htmlEscape(abstractNodes);
    } else {
      return "<".concat(tag, " ").concat(joinAttributes(attributes), ">").concat(children.map(toHtml).join(""), "</").concat(tag, ">");
    }
  }
  function iconFromMapping(mapping, prefix, iconName) {
    if (mapping && mapping[prefix] && mapping[prefix][iconName]) {
      return {
        prefix,
        iconName,
        icon: mapping[prefix][iconName]
      };
    }
  }
  var reduce = function fastReduceObject(subject, fn, initialValue, thisContext) {
    var keys = Object.keys(subject), length = keys.length, iterator = fn, i2, key, result;
    if (initialValue === void 0) {
      i2 = 1;
      result = subject[keys[0]];
    } else {
      i2 = 0;
      result = initialValue;
    }
    for (; i2 < length; i2++) {
      key = keys[i2];
      result = iterator(result, subject[key], key, subject);
    }
    return result;
  };
  function toHex(unicode) {
    if (_toConsumableArray(unicode).length !== 1) return null;
    return unicode.codePointAt(0).toString(16);
  }
  function normalizeIcons(icons) {
    return Object.keys(icons).reduce(function(acc, iconName) {
      var icon3 = icons[iconName];
      var expanded = !!icon3.icon;
      if (expanded) {
        acc[icon3.iconName] = icon3.icon;
      } else {
        acc[iconName] = icon3;
      }
      return acc;
    }, {});
  }
  function defineIcons(prefix, icons) {
    var params = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    var _params$skipHooks = params.skipHooks, skipHooks = _params$skipHooks === void 0 ? false : _params$skipHooks;
    var normalized = normalizeIcons(icons);
    if (typeof namespace.hooks.addPack === "function" && !skipHooks) {
      namespace.hooks.addPack(prefix, normalizeIcons(icons));
    } else {
      namespace.styles[prefix] = _objectSpread2$2(_objectSpread2$2({}, namespace.styles[prefix] || {}), normalized);
    }
    if (prefix === "fas") {
      defineIcons("fa", icons);
    }
  }
  var styles = namespace.styles, shims = namespace.shims;
  var FAMILY_NAMES = Object.keys(PREFIX_TO_LONG_STYLE);
  var PREFIXES_FOR_FAMILY = FAMILY_NAMES.reduce(function(acc, familyId) {
    acc[familyId] = Object.keys(PREFIX_TO_LONG_STYLE[familyId]);
    return acc;
  }, {});
  var _defaultUsablePrefix = null;
  var _byUnicode = {};
  var _byLigature = {};
  var _byOldName = {};
  var _byOldUnicode = {};
  var _byAlias = {};
  function isReserved(name) {
    return ~RESERVED_CLASSES.indexOf(name);
  }
  function getIconName(cssPrefix, cls) {
    var parts = cls.split("-");
    var prefix = parts[0];
    var iconName = parts.slice(1).join("-");
    if (prefix === cssPrefix && iconName !== "" && !isReserved(iconName)) {
      return iconName;
    } else {
      return null;
    }
  }
  var build = function build2() {
    var lookup = function lookup2(reducer) {
      return reduce(styles, function(o$$1, style, prefix) {
        o$$1[prefix] = reduce(style, reducer, {});
        return o$$1;
      }, {});
    };
    _byUnicode = lookup(function(acc, icon3, iconName) {
      if (icon3[3]) {
        acc[icon3[3]] = iconName;
      }
      if (icon3[2]) {
        var aliases = icon3[2].filter(function(a$$1) {
          return typeof a$$1 === "number";
        });
        aliases.forEach(function(alias) {
          acc[alias.toString(16)] = iconName;
        });
      }
      return acc;
    });
    _byLigature = lookup(function(acc, icon3, iconName) {
      acc[iconName] = iconName;
      if (icon3[2]) {
        var aliases = icon3[2].filter(function(a$$1) {
          return typeof a$$1 === "string";
        });
        aliases.forEach(function(alias) {
          acc[alias] = iconName;
        });
      }
      return acc;
    });
    _byAlias = lookup(function(acc, icon3, iconName) {
      var aliases = icon3[2];
      acc[iconName] = iconName;
      aliases.forEach(function(alias) {
        acc[alias] = iconName;
      });
      return acc;
    });
    var hasRegular = "far" in styles || config$2.autoFetchSvg;
    var shimLookups = reduce(shims, function(acc, shim) {
      var maybeNameMaybeUnicode = shim[0];
      var prefix = shim[1];
      var iconName = shim[2];
      if (prefix === "far" && !hasRegular) {
        prefix = "fas";
      }
      if (typeof maybeNameMaybeUnicode === "string") {
        acc.names[maybeNameMaybeUnicode] = {
          prefix,
          iconName
        };
      }
      if (typeof maybeNameMaybeUnicode === "number") {
        acc.unicodes[maybeNameMaybeUnicode.toString(16)] = {
          prefix,
          iconName
        };
      }
      return acc;
    }, {
      names: {},
      unicodes: {}
    });
    _byOldName = shimLookups.names;
    _byOldUnicode = shimLookups.unicodes;
    _defaultUsablePrefix = getCanonicalPrefix(config$2.styleDefault, {
      family: config$2.familyDefault
    });
  };
  onChange(function(c$$1) {
    _defaultUsablePrefix = getCanonicalPrefix(c$$1.styleDefault, {
      family: config$2.familyDefault
    });
  });
  build();
  function byUnicode(prefix, unicode) {
    return (_byUnicode[prefix] || {})[unicode];
  }
  function byLigature(prefix, ligature) {
    return (_byLigature[prefix] || {})[ligature];
  }
  function byAlias(prefix, alias) {
    return (_byAlias[prefix] || {})[alias];
  }
  function byOldName(name) {
    return _byOldName[name] || {
      prefix: null,
      iconName: null
    };
  }
  function byOldUnicode(unicode) {
    var oldUnicode = _byOldUnicode[unicode];
    var newUnicode = byUnicode("fas", unicode);
    return oldUnicode || (newUnicode ? {
      prefix: "fas",
      iconName: newUnicode
    } : null) || {
      prefix: null,
      iconName: null
    };
  }
  function getDefaultUsablePrefix() {
    return _defaultUsablePrefix;
  }
  var emptyCanonicalIcon = function emptyCanonicalIcon2() {
    return {
      prefix: null,
      iconName: null,
      rest: []
    };
  };
  function getFamilyId(values) {
    var family = i;
    var famProps = FAMILY_NAMES.reduce(function(acc, familyId) {
      acc[familyId] = "".concat(config$2.cssPrefix, "-").concat(familyId);
      return acc;
    }, {});
    dt.forEach(function(familyId) {
      if (values.includes(famProps[familyId]) || values.some(function(v$$1) {
        return PREFIXES_FOR_FAMILY[familyId].includes(v$$1);
      })) {
        family = familyId;
      }
    });
    return family;
  }
  function getCanonicalPrefix(styleOrPrefix) {
    var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var _params$family = params.family, family = _params$family === void 0 ? i : _params$family;
    var style = PREFIX_TO_STYLE[family][styleOrPrefix];
    if (family === t && !styleOrPrefix) {
      return "fad";
    }
    var prefix = STYLE_TO_PREFIX[family][styleOrPrefix] || STYLE_TO_PREFIX[family][style];
    var defined = styleOrPrefix in namespace.styles ? styleOrPrefix : null;
    var result = prefix || defined || null;
    return result;
  }
  function moveNonFaClassesToRest(classNames) {
    var rest = [];
    var iconName = null;
    classNames.forEach(function(cls) {
      var result = getIconName(config$2.cssPrefix, cls);
      if (result) {
        iconName = result;
      } else if (cls) {
        rest.push(cls);
      }
    });
    return {
      iconName,
      rest
    };
  }
  function sortedUniqueValues(arr) {
    return arr.sort().filter(function(value, index2, arr2) {
      return arr2.indexOf(value) === index2;
    });
  }
  var _faCombinedClasses = lo.concat(Ht);
  function getCanonicalIcon(values) {
    var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var _params$skipLookups = params.skipLookups, skipLookups = _params$skipLookups === void 0 ? false : _params$skipLookups;
    var givenPrefix = null;
    var faStyleOrFamilyClasses = sortedUniqueValues(values.filter(function(cls) {
      return _faCombinedClasses.includes(cls);
    }));
    var nonStyleOrFamilyClasses = sortedUniqueValues(values.filter(function(cls) {
      return !_faCombinedClasses.includes(cls);
    }));
    var faStyles = faStyleOrFamilyClasses.filter(function(cls) {
      givenPrefix = cls;
      return !Z$1.includes(cls);
    });
    var _faStyles = _slicedToArray$1(faStyles, 1), _faStyles$ = _faStyles[0], styleFromValues = _faStyles$ === void 0 ? null : _faStyles$;
    var family = getFamilyId(faStyleOrFamilyClasses);
    var canonical = _objectSpread2$2(_objectSpread2$2({}, moveNonFaClassesToRest(nonStyleOrFamilyClasses)), {}, {
      prefix: getCanonicalPrefix(styleFromValues, {
        family
      })
    });
    return _objectSpread2$2(_objectSpread2$2(_objectSpread2$2({}, canonical), getDefaultCanonicalPrefix({
      values,
      family,
      styles,
      config: config$2,
      canonical,
      givenPrefix
    })), applyShimAndAlias(skipLookups, givenPrefix, canonical));
  }
  function applyShimAndAlias(skipLookups, givenPrefix, canonical) {
    var prefix = canonical.prefix, iconName = canonical.iconName;
    if (skipLookups || !prefix || !iconName) {
      return {
        prefix,
        iconName
      };
    }
    var shim = givenPrefix === "fa" ? byOldName(iconName) : {};
    var aliasIconName = byAlias(prefix, iconName);
    iconName = shim.iconName || aliasIconName || iconName;
    prefix = shim.prefix || prefix;
    if (prefix === "far" && !styles["far"] && styles["fas"] && !config$2.autoFetchSvg) {
      prefix = "fas";
    }
    return {
      prefix,
      iconName
    };
  }
  var newCanonicalFamilies = dt.filter(function(familyId) {
    return familyId !== i || familyId !== t;
  });
  var newCanonicalStyles = Object.keys(Xl).filter(function(key) {
    return key !== i;
  }).map(function(key) {
    return Object.keys(Xl[key]);
  }).flat();
  function getDefaultCanonicalPrefix(prefixOptions) {
    var values = prefixOptions.values, family = prefixOptions.family, canonical = prefixOptions.canonical, _prefixOptions$givenP = prefixOptions.givenPrefix, givenPrefix = _prefixOptions$givenP === void 0 ? "" : _prefixOptions$givenP, _prefixOptions$styles = prefixOptions.styles, styles2 = _prefixOptions$styles === void 0 ? {} : _prefixOptions$styles, _prefixOptions$config = prefixOptions.config, config$$1 = _prefixOptions$config === void 0 ? {} : _prefixOptions$config;
    var isDuotoneFamily = family === t;
    var valuesHasDuotone = values.includes("fa-duotone") || values.includes("fad");
    var defaultFamilyIsDuotone = config$$1.familyDefault === "duotone";
    var canonicalPrefixIsDuotone = canonical.prefix === "fad" || canonical.prefix === "fa-duotone";
    if (!isDuotoneFamily && (valuesHasDuotone || defaultFamilyIsDuotone || canonicalPrefixIsDuotone)) {
      canonical.prefix = "fad";
    }
    if (values.includes("fa-brands") || values.includes("fab")) {
      canonical.prefix = "fab";
    }
    if (!canonical.prefix && newCanonicalFamilies.includes(family)) {
      var validPrefix = Object.keys(styles2).find(function(key) {
        return newCanonicalStyles.includes(key);
      });
      if (validPrefix || config$$1.autoFetchSvg) {
        var defaultPrefix = Et.get(family).defaultShortPrefixId;
        canonical.prefix = defaultPrefix;
        canonical.iconName = byAlias(canonical.prefix, canonical.iconName) || canonical.iconName;
      }
    }
    if (canonical.prefix === "fa" || givenPrefix === "fa") {
      canonical.prefix = getDefaultUsablePrefix() || "fas";
    }
    return canonical;
  }
  var Library = /* @__PURE__ */ function() {
    function Library2() {
      _classCallCheck(this, Library2);
      this.definitions = {};
    }
    return _createClass(Library2, [{
      key: "add",
      value: function add() {
        var _this = this;
        for (var _len = arguments.length, definitions2 = new Array(_len), _key = 0; _key < _len; _key++) {
          definitions2[_key] = arguments[_key];
        }
        var additions = definitions2.reduce(this._pullDefinitions, {});
        Object.keys(additions).forEach(function(key) {
          _this.definitions[key] = _objectSpread2$2(_objectSpread2$2({}, _this.definitions[key] || {}), additions[key]);
          defineIcons(key, additions[key]);
          var longPrefix = PREFIX_TO_LONG_STYLE[i][key];
          if (longPrefix) defineIcons(longPrefix, additions[key]);
          build();
        });
      }
    }, {
      key: "reset",
      value: function reset() {
        this.definitions = {};
      }
    }, {
      key: "_pullDefinitions",
      value: function _pullDefinitions(additions, definition) {
        var normalized = definition.prefix && definition.iconName && definition.icon ? {
          0: definition
        } : definition;
        Object.keys(normalized).map(function(key) {
          var _normalized$key = normalized[key], prefix = _normalized$key.prefix, iconName = _normalized$key.iconName, icon3 = _normalized$key.icon;
          var aliases = icon3[2];
          if (!additions[prefix]) additions[prefix] = {};
          if (aliases.length > 0) {
            aliases.forEach(function(alias) {
              if (typeof alias === "string") {
                additions[prefix][alias] = icon3;
              }
            });
          }
          additions[prefix][iconName] = icon3;
        });
        return additions;
      }
    }]);
  }();
  var _plugins = [];
  var _hooks = {};
  var providers = {};
  var defaultProviderKeys = Object.keys(providers);
  function registerPlugins(nextPlugins, _ref2) {
    var obj = _ref2.mixoutsTo;
    _plugins = nextPlugins;
    _hooks = {};
    Object.keys(providers).forEach(function(k2) {
      if (defaultProviderKeys.indexOf(k2) === -1) {
        delete providers[k2];
      }
    });
    _plugins.forEach(function(plugin) {
      var mixout8 = plugin.mixout ? plugin.mixout() : {};
      Object.keys(mixout8).forEach(function(tk2) {
        if (typeof mixout8[tk2] === "function") {
          obj[tk2] = mixout8[tk2];
        }
        if (_typeof(mixout8[tk2]) === "object") {
          Object.keys(mixout8[tk2]).forEach(function(sk2) {
            if (!obj[tk2]) {
              obj[tk2] = {};
            }
            obj[tk2][sk2] = mixout8[tk2][sk2];
          });
        }
      });
      if (plugin.hooks) {
        var hooks8 = plugin.hooks();
        Object.keys(hooks8).forEach(function(hook) {
          if (!_hooks[hook]) {
            _hooks[hook] = [];
          }
          _hooks[hook].push(hooks8[hook]);
        });
      }
      if (plugin.provides) {
        plugin.provides(providers);
      }
    });
    return obj;
  }
  function chainHooks(hook, accumulator) {
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }
    var hookFns = _hooks[hook] || [];
    hookFns.forEach(function(hookFn) {
      accumulator = hookFn.apply(null, [accumulator].concat(args));
    });
    return accumulator;
  }
  function callHooks(hook) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }
    var hookFns = _hooks[hook] || [];
    hookFns.forEach(function(hookFn) {
      hookFn.apply(null, args);
    });
    return void 0;
  }
  function callProvided() {
    var hook = arguments[0];
    var args = Array.prototype.slice.call(arguments, 1);
    return providers[hook] ? providers[hook].apply(null, args) : void 0;
  }
  function findIconDefinition(iconLookup) {
    if (iconLookup.prefix === "fa") {
      iconLookup.prefix = "fas";
    }
    var iconName = iconLookup.iconName;
    var prefix = iconLookup.prefix || getDefaultUsablePrefix();
    if (!iconName) return;
    iconName = byAlias(prefix, iconName) || iconName;
    return iconFromMapping(library.definitions, prefix, iconName) || iconFromMapping(namespace.styles, prefix, iconName);
  }
  var library = new Library();
  var noAuto = function noAuto2() {
    config$2.autoReplaceSvg = false;
    config$2.observeMutations = false;
    callHooks("noAuto");
  };
  var dom = {
    i2svg: function i2svg() {
      var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      if (IS_DOM) {
        callHooks("beforeI2svg", params);
        callProvided("pseudoElements2svg", params);
        return callProvided("i2svg", params);
      } else {
        return Promise.reject(new Error("Operation requires a DOM of some kind."));
      }
    },
    watch: function watch() {
      var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      var autoReplaceSvgRoot = params.autoReplaceSvgRoot;
      if (config$2.autoReplaceSvg === false) {
        config$2.autoReplaceSvg = true;
      }
      config$2.observeMutations = true;
      domready(function() {
        autoReplace({
          autoReplaceSvgRoot
        });
        callHooks("watch", params);
      });
    }
  };
  var parse = {
    icon: function icon(_icon) {
      if (_icon === null) {
        return null;
      }
      if (_typeof(_icon) === "object" && _icon.prefix && _icon.iconName) {
        return {
          prefix: _icon.prefix,
          iconName: byAlias(_icon.prefix, _icon.iconName) || _icon.iconName
        };
      }
      if (Array.isArray(_icon) && _icon.length === 2) {
        var iconName = _icon[1].indexOf("fa-") === 0 ? _icon[1].slice(3) : _icon[1];
        var prefix = getCanonicalPrefix(_icon[0]);
        return {
          prefix,
          iconName: byAlias(prefix, iconName) || iconName
        };
      }
      if (typeof _icon === "string" && (_icon.indexOf("".concat(config$2.cssPrefix, "-")) > -1 || _icon.match(ICON_SELECTION_SYNTAX_PATTERN))) {
        var canonicalIcon = getCanonicalIcon(_icon.split(" "), {
          skipLookups: true
        });
        return {
          prefix: canonicalIcon.prefix || getDefaultUsablePrefix(),
          iconName: byAlias(canonicalIcon.prefix, canonicalIcon.iconName) || canonicalIcon.iconName
        };
      }
      if (typeof _icon === "string") {
        var _prefix = getDefaultUsablePrefix();
        return {
          prefix: _prefix,
          iconName: byAlias(_prefix, _icon) || _icon
        };
      }
    }
  };
  var api = {
    noAuto,
    config: config$2,
    dom,
    parse,
    library,
    findIconDefinition,
    toHtml
  };
  var autoReplace = function autoReplace2() {
    var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    var _params$autoReplaceSv = params.autoReplaceSvgRoot, autoReplaceSvgRoot = _params$autoReplaceSv === void 0 ? DOCUMENT : _params$autoReplaceSv;
    if ((Object.keys(namespace.styles).length > 0 || config$2.autoFetchSvg) && IS_DOM && config$2.autoReplaceSvg) api.dom.i2svg({
      node: autoReplaceSvgRoot
    });
  };
  function domVariants(val, abstractCreator) {
    Object.defineProperty(val, "abstract", {
      get: abstractCreator
    });
    Object.defineProperty(val, "html", {
      get: function get2() {
        return val.abstract.map(function(a2) {
          return toHtml(a2);
        });
      }
    });
    Object.defineProperty(val, "node", {
      get: function get2() {
        if (!IS_DOM) return void 0;
        var container = DOCUMENT.createElement("div");
        container.innerHTML = val.html;
        return container.children;
      }
    });
    return val;
  }
  function asIcon(_ref2) {
    var children = _ref2.children, main = _ref2.main, mask = _ref2.mask, attributes = _ref2.attributes, styles2 = _ref2.styles, transform = _ref2.transform;
    if (transformIsMeaningful(transform) && main.found && !mask.found) {
      var width = main.width, height = main.height;
      var offset = {
        x: width / height / 2,
        y: 0.5
      };
      attributes["style"] = joinStyles(_objectSpread2$2(_objectSpread2$2({}, styles2), {}, {
        "transform-origin": "".concat(offset.x + transform.x / 16, "em ").concat(offset.y + transform.y / 16, "em")
      }));
    }
    return [{
      tag: "svg",
      attributes,
      children
    }];
  }
  function asSymbol(_ref2) {
    var prefix = _ref2.prefix, iconName = _ref2.iconName, children = _ref2.children, attributes = _ref2.attributes, symbol = _ref2.symbol;
    var id2 = symbol === true ? "".concat(prefix, "-").concat(config$2.cssPrefix, "-").concat(iconName) : symbol;
    return [{
      tag: "svg",
      attributes: {
        style: "display: none;"
      },
      children: [{
        tag: "symbol",
        attributes: _objectSpread2$2(_objectSpread2$2({}, attributes), {}, {
          id: id2
        }),
        children
      }]
    }];
  }
  function isLabeled(attributes) {
    var labels = ["aria-label", "aria-labelledby", "title", "role"];
    return labels.some(function(label) {
      return label in attributes;
    });
  }
  function makeInlineSvgAbstract(params) {
    var _params$icons = params.icons, main = _params$icons.main, mask = _params$icons.mask, prefix = params.prefix, iconName = params.iconName, transform = params.transform, symbol = params.symbol, maskId = params.maskId, extra = params.extra, _params$watchable = params.watchable, watchable = _params$watchable === void 0 ? false : _params$watchable;
    var _ref2 = mask.found ? mask : main, width = _ref2.width, height = _ref2.height;
    var attrClass = [config$2.replacementClass, iconName ? "".concat(config$2.cssPrefix, "-").concat(iconName) : ""].filter(function(c2) {
      return extra.classes.indexOf(c2) === -1;
    }).filter(function(c2) {
      return c2 !== "" || !!c2;
    }).concat(extra.classes).join(" ");
    var content = {
      children: [],
      attributes: _objectSpread2$2(_objectSpread2$2({}, extra.attributes), {}, {
        "data-prefix": prefix,
        "data-icon": iconName,
        "class": attrClass,
        "role": extra.attributes.role || "img",
        "viewBox": "0 0 ".concat(width, " ").concat(height)
      })
    };
    if (!isLabeled(extra.attributes) && !extra.attributes["aria-hidden"]) {
      content.attributes["aria-hidden"] = "true";
    }
    if (watchable) {
      content.attributes[DATA_FA_I2SVG] = "";
    }
    var args = _objectSpread2$2(_objectSpread2$2({}, content), {}, {
      prefix,
      iconName,
      main,
      mask,
      maskId,
      transform,
      symbol,
      styles: _objectSpread2$2({}, extra.styles)
    });
    var _ref22 = mask.found && main.found ? callProvided("generateAbstractMask", args) || {
      children: [],
      attributes: {}
    } : callProvided("generateAbstractIcon", args) || {
      children: [],
      attributes: {}
    }, children = _ref22.children, attributes = _ref22.attributes;
    args.children = children;
    args.attributes = attributes;
    if (symbol) {
      return asSymbol(args);
    } else {
      return asIcon(args);
    }
  }
  function makeLayersTextAbstract(params) {
    var content = params.content, width = params.width, height = params.height, transform = params.transform, extra = params.extra, _params$watchable2 = params.watchable, watchable = _params$watchable2 === void 0 ? false : _params$watchable2;
    var attributes = _objectSpread2$2(_objectSpread2$2({}, extra.attributes), {}, {
      class: extra.classes.join(" ")
    });
    if (watchable) {
      attributes[DATA_FA_I2SVG] = "";
    }
    var styles2 = _objectSpread2$2({}, extra.styles);
    if (transformIsMeaningful(transform)) {
      styles2["transform"] = transformForCss({
        transform,
        width,
        height
      });
      styles2["-webkit-transform"] = styles2["transform"];
    }
    var styleString = joinStyles(styles2);
    if (styleString.length > 0) {
      attributes["style"] = styleString;
    }
    var val = [];
    val.push({
      tag: "span",
      attributes,
      children: [content]
    });
    return val;
  }
  function makeLayersCounterAbstract(params) {
    var content = params.content, extra = params.extra;
    var attributes = _objectSpread2$2(_objectSpread2$2({}, extra.attributes), {}, {
      class: extra.classes.join(" ")
    });
    var styleString = joinStyles(extra.styles);
    if (styleString.length > 0) {
      attributes["style"] = styleString;
    }
    var val = [];
    val.push({
      tag: "span",
      attributes,
      children: [content]
    });
    return val;
  }
  var styles$1 = namespace.styles;
  function asFoundIcon(icon3) {
    var width = icon3[0];
    var height = icon3[1];
    var _icon$slice = icon3.slice(4), _icon$slice2 = _slicedToArray$1(_icon$slice, 1), vectorData = _icon$slice2[0];
    var element = null;
    if (Array.isArray(vectorData)) {
      element = {
        tag: "g",
        attributes: {
          class: "".concat(config$2.cssPrefix, "-").concat(DUOTONE_CLASSES.GROUP)
        },
        children: [{
          tag: "path",
          attributes: {
            class: "".concat(config$2.cssPrefix, "-").concat(DUOTONE_CLASSES.SECONDARY),
            fill: "currentColor",
            d: vectorData[0]
          }
        }, {
          tag: "path",
          attributes: {
            class: "".concat(config$2.cssPrefix, "-").concat(DUOTONE_CLASSES.PRIMARY),
            fill: "currentColor",
            d: vectorData[1]
          }
        }]
      };
    } else {
      element = {
        tag: "path",
        attributes: {
          fill: "currentColor",
          d: vectorData
        }
      };
    }
    return {
      found: true,
      width,
      height,
      icon: element
    };
  }
  var missingIconResolutionMixin = {
    found: false,
    width: 512,
    height: 512
  };
  function maybeNotifyMissing(iconName, prefix) {
    if (!PRODUCTION && !config$2.showMissingIcons && iconName) {
      console.error('Icon with name "'.concat(iconName, '" and prefix "').concat(prefix, '" is missing.'));
    }
  }
  function findIcon(iconName, prefix) {
    var givenPrefix = prefix;
    if (prefix === "fa" && config$2.styleDefault !== null) {
      prefix = getDefaultUsablePrefix();
    }
    return new Promise(function(resolve, reject) {
      if (givenPrefix === "fa") {
        var shim = byOldName(iconName) || {};
        iconName = shim.iconName || iconName;
        prefix = shim.prefix || prefix;
      }
      if (iconName && prefix && styles$1[prefix] && styles$1[prefix][iconName]) {
        var icon3 = styles$1[prefix][iconName];
        return resolve(asFoundIcon(icon3));
      }
      maybeNotifyMissing(iconName, prefix);
      resolve(_objectSpread2$2(_objectSpread2$2({}, missingIconResolutionMixin), {}, {
        icon: config$2.showMissingIcons && iconName ? callProvided("missingIconAbstract") || {} : {}
      }));
    });
  }
  var noop$1 = function noop3() {
  };
  var p$2 = config$2.measurePerformance && PERFORMANCE && PERFORMANCE.mark && PERFORMANCE.measure ? PERFORMANCE : {
    mark: noop$1,
    measure: noop$1
  };
  var preamble = 'FA "7.2.0"';
  var begin = function begin2(name) {
    p$2.mark("".concat(preamble, " ").concat(name, " begins"));
    return function() {
      return end(name);
    };
  };
  var end = function end2(name) {
    p$2.mark("".concat(preamble, " ").concat(name, " ends"));
    p$2.measure("".concat(preamble, " ").concat(name), "".concat(preamble, " ").concat(name, " begins"), "".concat(preamble, " ").concat(name, " ends"));
  };
  var perf = {
    begin,
    end
  };
  var noop$2 = function noop4() {
  };
  function isWatched(node) {
    var i2svg2 = node.getAttribute ? node.getAttribute(DATA_FA_I2SVG) : null;
    return typeof i2svg2 === "string";
  }
  function hasPrefixAndIcon(node) {
    var prefix = node.getAttribute ? node.getAttribute(DATA_PREFIX) : null;
    var icon3 = node.getAttribute ? node.getAttribute(DATA_ICON) : null;
    return prefix && icon3;
  }
  function hasBeenReplaced(node) {
    return node && node.classList && node.classList.contains && node.classList.contains(config$2.replacementClass);
  }
  function getMutator() {
    if (config$2.autoReplaceSvg === true) {
      return mutators.replace;
    }
    var mutator = mutators[config$2.autoReplaceSvg];
    return mutator || mutators.replace;
  }
  function createElementNS(tag) {
    return DOCUMENT.createElementNS("http://www.w3.org/2000/svg", tag);
  }
  function createElement(tag) {
    return DOCUMENT.createElement(tag);
  }
  function convertSVG(abstractObj) {
    var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var _params$ceFn = params.ceFn, ceFn = _params$ceFn === void 0 ? abstractObj.tag === "svg" ? createElementNS : createElement : _params$ceFn;
    if (typeof abstractObj === "string") {
      return DOCUMENT.createTextNode(abstractObj);
    }
    var tag = ceFn(abstractObj.tag);
    Object.keys(abstractObj.attributes || []).forEach(function(key) {
      tag.setAttribute(key, abstractObj.attributes[key]);
    });
    var children = abstractObj.children || [];
    children.forEach(function(child) {
      tag.appendChild(convertSVG(child, {
        ceFn
      }));
    });
    return tag;
  }
  function nodeAsComment(node) {
    var comment = " ".concat(node.outerHTML, " ");
    comment = "".concat(comment, "Font Awesome fontawesome.com ");
    return comment;
  }
  var mutators = {
    replace: function replace(mutation) {
      var node = mutation[0];
      if (node.parentNode) {
        mutation[1].forEach(function(abstract) {
          node.parentNode.insertBefore(convertSVG(abstract), node);
        });
        if (node.getAttribute(DATA_FA_I2SVG) === null && config$2.keepOriginalSource) {
          var comment = DOCUMENT.createComment(nodeAsComment(node));
          node.parentNode.replaceChild(comment, node);
        } else {
          node.remove();
        }
      }
    },
    nest: function nest(mutation) {
      var node = mutation[0];
      var abstract = mutation[1];
      if (~classArray(node).indexOf(config$2.replacementClass)) {
        return mutators.replace(mutation);
      }
      var forSvg = new RegExp("".concat(config$2.cssPrefix, "-.*"));
      delete abstract[0].attributes.id;
      if (abstract[0].attributes.class) {
        var splitClasses = abstract[0].attributes.class.split(" ").reduce(function(acc, cls) {
          if (cls === config$2.replacementClass || cls.match(forSvg)) {
            acc.toSvg.push(cls);
          } else {
            acc.toNode.push(cls);
          }
          return acc;
        }, {
          toNode: [],
          toSvg: []
        });
        abstract[0].attributes.class = splitClasses.toSvg.join(" ");
        if (splitClasses.toNode.length === 0) {
          node.removeAttribute("class");
        } else {
          node.setAttribute("class", splitClasses.toNode.join(" "));
        }
      }
      var newInnerHTML = abstract.map(function(a2) {
        return toHtml(a2);
      }).join("\n");
      node.setAttribute(DATA_FA_I2SVG, "");
      node.innerHTML = newInnerHTML;
    }
  };
  function performOperationSync(op) {
    op();
  }
  function perform(mutations, callback) {
    var callbackFunction = typeof callback === "function" ? callback : noop$2;
    if (mutations.length === 0) {
      callbackFunction();
    } else {
      var frame = performOperationSync;
      if (config$2.mutateApproach === MUTATION_APPROACH_ASYNC) {
        frame = WINDOW.requestAnimationFrame || performOperationSync;
      }
      frame(function() {
        var mutator = getMutator();
        var mark = perf.begin("mutate");
        mutations.map(mutator);
        mark();
        callbackFunction();
      });
    }
  }
  var disabled = false;
  function disableObservation() {
    disabled = true;
  }
  function enableObservation() {
    disabled = false;
  }
  var mo = null;
  function observe(options) {
    if (!MUTATION_OBSERVER) {
      return;
    }
    if (!config$2.observeMutations) {
      return;
    }
    var _options$treeCallback = options.treeCallback, treeCallback = _options$treeCallback === void 0 ? noop$2 : _options$treeCallback, _options$nodeCallback = options.nodeCallback, nodeCallback = _options$nodeCallback === void 0 ? noop$2 : _options$nodeCallback, _options$pseudoElemen = options.pseudoElementsCallback, pseudoElementsCallback = _options$pseudoElemen === void 0 ? noop$2 : _options$pseudoElemen, _options$observeMutat = options.observeMutationsRoot, observeMutationsRoot = _options$observeMutat === void 0 ? DOCUMENT : _options$observeMutat;
    mo = new MUTATION_OBSERVER(function(objects) {
      if (disabled) return;
      var defaultPrefix = getDefaultUsablePrefix();
      toArray(objects).forEach(function(mutationRecord) {
        if (mutationRecord.type === "childList" && mutationRecord.addedNodes.length > 0 && !isWatched(mutationRecord.addedNodes[0])) {
          if (config$2.searchPseudoElements) {
            pseudoElementsCallback(mutationRecord.target);
          }
          treeCallback(mutationRecord.target);
        }
        if (mutationRecord.type === "attributes" && mutationRecord.target.parentNode && config$2.searchPseudoElements) {
          pseudoElementsCallback([mutationRecord.target], true);
        }
        if (mutationRecord.type === "attributes" && isWatched(mutationRecord.target) && ~ATTRIBUTES_WATCHED_FOR_MUTATION.indexOf(mutationRecord.attributeName)) {
          if (mutationRecord.attributeName === "class" && hasPrefixAndIcon(mutationRecord.target)) {
            var _getCanonicalIcon = getCanonicalIcon(classArray(mutationRecord.target)), prefix = _getCanonicalIcon.prefix, iconName = _getCanonicalIcon.iconName;
            mutationRecord.target.setAttribute(DATA_PREFIX, prefix || defaultPrefix);
            if (iconName) mutationRecord.target.setAttribute(DATA_ICON, iconName);
          } else if (hasBeenReplaced(mutationRecord.target)) {
            nodeCallback(mutationRecord.target);
          }
        }
      });
    });
    if (!IS_DOM) return;
    mo.observe(observeMutationsRoot, {
      childList: true,
      attributes: true,
      characterData: true,
      subtree: true
    });
  }
  function disconnect() {
    if (!mo) return;
    mo.disconnect();
  }
  function styleParser(node) {
    var style = node.getAttribute("style");
    var val = [];
    if (style) {
      val = style.split(";").reduce(function(acc, style2) {
        var styles2 = style2.split(":");
        var prop = styles2[0];
        var value = styles2.slice(1);
        if (prop && value.length > 0) {
          acc[prop] = value.join(":").trim();
        }
        return acc;
      }, {});
    }
    return val;
  }
  function classParser(node) {
    var existingPrefix = node.getAttribute("data-prefix");
    var existingIconName = node.getAttribute("data-icon");
    var innerText = node.innerText !== void 0 ? node.innerText.trim() : "";
    var val = getCanonicalIcon(classArray(node));
    if (!val.prefix) {
      val.prefix = getDefaultUsablePrefix();
    }
    if (existingPrefix && existingIconName) {
      val.prefix = existingPrefix;
      val.iconName = existingIconName;
    }
    if (val.iconName && val.prefix) {
      return val;
    }
    if (val.prefix && innerText.length > 0) {
      val.iconName = byLigature(val.prefix, node.innerText) || byUnicode(val.prefix, toHex(node.innerText));
    }
    if (!val.iconName && config$2.autoFetchSvg && node.firstChild && node.firstChild.nodeType === Node.TEXT_NODE) {
      val.iconName = node.firstChild.data;
    }
    return val;
  }
  function attributesParser(node) {
    var extraAttributes = toArray(node.attributes).reduce(function(acc, attr) {
      if (acc.name !== "class" && acc.name !== "style") {
        acc[attr.name] = attr.value;
      }
      return acc;
    }, {});
    return extraAttributes;
  }
  function blankMeta() {
    return {
      iconName: null,
      prefix: null,
      transform: meaninglessTransform,
      symbol: false,
      mask: {
        iconName: null,
        prefix: null,
        rest: []
      },
      maskId: null,
      extra: {
        classes: [],
        styles: {},
        attributes: {}
      }
    };
  }
  function parseMeta(node) {
    var parser = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
      styleParser: true
    };
    var _classParser = classParser(node), iconName = _classParser.iconName, prefix = _classParser.prefix, extraClasses = _classParser.rest;
    var extraAttributes = attributesParser(node);
    var pluginMeta = chainHooks("parseNodeAttributes", {}, node);
    var extraStyles = parser.styleParser ? styleParser(node) : [];
    return _objectSpread2$2({
      iconName,
      prefix,
      transform: meaninglessTransform,
      mask: {
        iconName: null,
        prefix: null,
        rest: []
      },
      maskId: null,
      symbol: false,
      extra: {
        classes: extraClasses,
        styles: extraStyles,
        attributes: extraAttributes
      }
    }, pluginMeta);
  }
  var styles$2 = namespace.styles;
  function generateMutation(node) {
    var nodeMeta = config$2.autoReplaceSvg === "nest" ? parseMeta(node, {
      styleParser: false
    }) : parseMeta(node);
    if (~nodeMeta.extra.classes.indexOf(LAYERS_TEXT_CLASSNAME)) {
      return callProvided("generateLayersText", node, nodeMeta);
    } else {
      return callProvided("generateSvgReplacementMutation", node, nodeMeta);
    }
  }
  function getKnownPrefixes() {
    return [].concat(_toConsumableArray(Ht), _toConsumableArray(lo));
  }
  function onTree(root) {
    var callback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
    if (!IS_DOM) return Promise.resolve();
    var htmlClassList = DOCUMENT.documentElement.classList;
    var hclAdd = function hclAdd2(suffix) {
      return htmlClassList.add("".concat(HTML_CLASS_I2SVG_BASE_CLASS, "-").concat(suffix));
    };
    var hclRemove = function hclRemove2(suffix) {
      return htmlClassList.remove("".concat(HTML_CLASS_I2SVG_BASE_CLASS, "-").concat(suffix));
    };
    var prefixes = config$2.autoFetchSvg ? getKnownPrefixes() : Z$1.concat(Object.keys(styles$2));
    if (!prefixes.includes("fa")) {
      prefixes.push("fa");
    }
    var prefixesDomQuery = [".".concat(LAYERS_TEXT_CLASSNAME, ":not([").concat(DATA_FA_I2SVG, "])")].concat(prefixes.map(function(p$$1) {
      return ".".concat(p$$1, ":not([").concat(DATA_FA_I2SVG, "])");
    })).join(", ");
    if (prefixesDomQuery.length === 0) {
      return Promise.resolve();
    }
    var candidates = [];
    try {
      candidates = toArray(root.querySelectorAll(prefixesDomQuery));
    } catch (e$$1) {
    }
    if (candidates.length > 0) {
      hclAdd("pending");
      hclRemove("complete");
    } else {
      return Promise.resolve();
    }
    var mark = perf.begin("onTree");
    var mutations = candidates.reduce(function(acc, node) {
      try {
        var mutation = generateMutation(node);
        if (mutation) {
          acc.push(mutation);
        }
      } catch (e$$1) {
        if (!PRODUCTION) {
          if (e$$1.name === "MissingIcon") {
            console.error(e$$1);
          }
        }
      }
      return acc;
    }, []);
    return new Promise(function(resolve, reject) {
      Promise.all(mutations).then(function(resolvedMutations) {
        perform(resolvedMutations, function() {
          hclAdd("active");
          hclAdd("complete");
          hclRemove("pending");
          if (typeof callback === "function") callback();
          mark();
          resolve();
        });
      }).catch(function(e$$1) {
        mark();
        reject(e$$1);
      });
    });
  }
  function onNode(node) {
    var callback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
    generateMutation(node).then(function(mutation) {
      if (mutation) {
        perform([mutation], callback);
      }
    });
  }
  function resolveIcons(next) {
    return function(maybeIconDefinition) {
      var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      var iconDefinition = (maybeIconDefinition || {}).icon ? maybeIconDefinition : findIconDefinition(maybeIconDefinition || {});
      var mask = params.mask;
      if (mask) {
        mask = (mask || {}).icon ? mask : findIconDefinition(mask || {});
      }
      return next(iconDefinition, _objectSpread2$2(_objectSpread2$2({}, params), {}, {
        mask
      }));
    };
  }
  var render = function render2(iconDefinition) {
    var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var _params$transform = params.transform, transform = _params$transform === void 0 ? meaninglessTransform : _params$transform, _params$symbol = params.symbol, symbol = _params$symbol === void 0 ? false : _params$symbol, _params$mask = params.mask, mask = _params$mask === void 0 ? null : _params$mask, _params$maskId = params.maskId, maskId = _params$maskId === void 0 ? null : _params$maskId, _params$classes = params.classes, classes = _params$classes === void 0 ? [] : _params$classes, _params$attributes = params.attributes, attributes = _params$attributes === void 0 ? {} : _params$attributes, _params$styles = params.styles, styles2 = _params$styles === void 0 ? {} : _params$styles;
    if (!iconDefinition) return;
    var prefix = iconDefinition.prefix, iconName = iconDefinition.iconName, icon3 = iconDefinition.icon;
    return domVariants(_objectSpread2$2({
      type: "icon"
    }, iconDefinition), function() {
      callHooks("beforeDOMElementCreation", {
        iconDefinition,
        params
      });
      return makeInlineSvgAbstract({
        icons: {
          main: asFoundIcon(icon3),
          mask: mask ? asFoundIcon(mask.icon) : {
            found: false,
            width: null,
            height: null,
            icon: {}
          }
        },
        prefix,
        iconName,
        transform: _objectSpread2$2(_objectSpread2$2({}, meaninglessTransform), transform),
        symbol,
        maskId,
        extra: {
          attributes,
          styles: styles2,
          classes
        }
      });
    });
  };
  var ReplaceElements = {
    mixout: function mixout2() {
      return {
        icon: resolveIcons(render)
      };
    },
    hooks: function hooks2() {
      return {
        mutationObserverCallbacks: function mutationObserverCallbacks(accumulator) {
          accumulator.treeCallback = onTree;
          accumulator.nodeCallback = onNode;
          return accumulator;
        }
      };
    },
    provides: function provides(providers$$1) {
      providers$$1.i2svg = function(params) {
        var _params$node = params.node, node = _params$node === void 0 ? DOCUMENT : _params$node, _params$callback = params.callback, callback = _params$callback === void 0 ? function() {
        } : _params$callback;
        return onTree(node, callback);
      };
      providers$$1.generateSvgReplacementMutation = function(node, nodeMeta) {
        var iconName = nodeMeta.iconName, prefix = nodeMeta.prefix, transform = nodeMeta.transform, symbol = nodeMeta.symbol, mask = nodeMeta.mask, maskId = nodeMeta.maskId, extra = nodeMeta.extra;
        return new Promise(function(resolve, reject) {
          Promise.all([findIcon(iconName, prefix), mask.iconName ? findIcon(mask.iconName, mask.prefix) : Promise.resolve({
            found: false,
            width: 512,
            height: 512,
            icon: {}
          })]).then(function(_ref2) {
            var _ref22 = _slicedToArray$1(_ref2, 2), main = _ref22[0], mask2 = _ref22[1];
            resolve([node, makeInlineSvgAbstract({
              icons: {
                main,
                mask: mask2
              },
              prefix,
              iconName,
              transform,
              symbol,
              maskId,
              extra,
              watchable: true
            })]);
          }).catch(reject);
        });
      };
      providers$$1.generateAbstractIcon = function(_ref3) {
        var children = _ref3.children, attributes = _ref3.attributes, main = _ref3.main, transform = _ref3.transform, styles2 = _ref3.styles;
        var styleString = joinStyles(styles2);
        if (styleString.length > 0) {
          attributes["style"] = styleString;
        }
        var nextChild;
        if (transformIsMeaningful(transform)) {
          nextChild = callProvided("generateAbstractTransformGrouping", {
            main,
            transform,
            containerWidth: main.width,
            iconWidth: main.width
          });
        }
        children.push(nextChild || main.icon);
        return {
          children,
          attributes
        };
      };
    }
  };
  var Layers = {
    mixout: function mixout3() {
      return {
        layer: function layer2(assembler) {
          var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          var _params$classes = params.classes, classes = _params$classes === void 0 ? [] : _params$classes;
          return domVariants({
            type: "layer"
          }, function() {
            callHooks("beforeDOMElementCreation", {
              assembler,
              params
            });
            var children = [];
            assembler(function(args) {
              Array.isArray(args) ? args.map(function(a2) {
                children = children.concat(a2.abstract);
              }) : children = children.concat(args.abstract);
            });
            return [{
              tag: "span",
              attributes: {
                class: ["".concat(config$2.cssPrefix, "-layers")].concat(_toConsumableArray(classes)).join(" ")
              },
              children
            }];
          });
        }
      };
    }
  };
  var LayersCounter = {
    mixout: function mixout4() {
      return {
        counter: function counter2(content) {
          var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          params.title;
          var _params$classes = params.classes, classes = _params$classes === void 0 ? [] : _params$classes, _params$attributes = params.attributes, attributes = _params$attributes === void 0 ? {} : _params$attributes, _params$styles = params.styles, styles2 = _params$styles === void 0 ? {} : _params$styles;
          return domVariants({
            type: "counter",
            content
          }, function() {
            callHooks("beforeDOMElementCreation", {
              content,
              params
            });
            return makeLayersCounterAbstract({
              content: content.toString(),
              extra: {
                attributes,
                styles: styles2,
                classes: ["".concat(config$2.cssPrefix, "-layers-counter")].concat(_toConsumableArray(classes))
              }
            });
          });
        }
      };
    }
  };
  var LayersText = {
    mixout: function mixout5() {
      return {
        text: function text2(content) {
          var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          var _params$transform = params.transform, transform = _params$transform === void 0 ? meaninglessTransform : _params$transform, _params$classes = params.classes, classes = _params$classes === void 0 ? [] : _params$classes, _params$attributes = params.attributes, attributes = _params$attributes === void 0 ? {} : _params$attributes, _params$styles = params.styles, styles2 = _params$styles === void 0 ? {} : _params$styles;
          return domVariants({
            type: "text",
            content
          }, function() {
            callHooks("beforeDOMElementCreation", {
              content,
              params
            });
            return makeLayersTextAbstract({
              content,
              transform: _objectSpread2$2(_objectSpread2$2({}, meaninglessTransform), transform),
              extra: {
                attributes,
                styles: styles2,
                classes: ["".concat(config$2.cssPrefix, "-layers-text")].concat(_toConsumableArray(classes))
              }
            });
          });
        }
      };
    },
    provides: function provides2(providers$$1) {
      providers$$1.generateLayersText = function(node, nodeMeta) {
        var transform = nodeMeta.transform, extra = nodeMeta.extra;
        var width = null;
        var height = null;
        if (IS_IE) {
          var computedFontSize = parseInt(getComputedStyle(node).fontSize, 10);
          var boundingClientRect = node.getBoundingClientRect();
          width = boundingClientRect.width / computedFontSize;
          height = boundingClientRect.height / computedFontSize;
        }
        return Promise.resolve([node, makeLayersTextAbstract({
          content: node.innerHTML,
          width,
          height,
          transform,
          extra,
          watchable: true
        })]);
      };
    }
  };
  var CLEAN_CONTENT_PATTERN = new RegExp('"', "ug");
  var SECONDARY_UNICODE_RANGE = [1105920, 1112319];
  var _FONT_FAMILY_WEIGHT_TO_PREFIX = _objectSpread2$2(_objectSpread2$2(_objectSpread2$2(_objectSpread2$2({}, {
    FontAwesome: {
      normal: "fas",
      400: "fas"
    }
  }), Kt), fo), hl);
  var FONT_FAMILY_WEIGHT_TO_PREFIX = Object.keys(_FONT_FAMILY_WEIGHT_TO_PREFIX).reduce(function(acc, key) {
    acc[key.toLowerCase()] = _FONT_FAMILY_WEIGHT_TO_PREFIX[key];
    return acc;
  }, {});
  var FONT_FAMILY_WEIGHT_FALLBACK = Object.keys(FONT_FAMILY_WEIGHT_TO_PREFIX).reduce(function(acc, fontFamily) {
    var weights = FONT_FAMILY_WEIGHT_TO_PREFIX[fontFamily];
    acc[fontFamily] = weights[900] || _toConsumableArray(Object.entries(weights))[0][1];
    return acc;
  }, {});
  function hexValueFromContent(content) {
    var cleaned = content.replace(CLEAN_CONTENT_PATTERN, "");
    return toHex(_toConsumableArray(cleaned)[0] || "");
  }
  function isSecondaryLayer(styles2) {
    var hasStylisticSet = styles2.getPropertyValue("font-feature-settings").includes("ss01");
    var content = styles2.getPropertyValue("content");
    var cleaned = content.replace(CLEAN_CONTENT_PATTERN, "");
    var codePoint = cleaned.codePointAt(0);
    var isPrependTen = codePoint >= SECONDARY_UNICODE_RANGE[0] && codePoint <= SECONDARY_UNICODE_RANGE[1];
    var isDoubled = cleaned.length === 2 ? cleaned[0] === cleaned[1] : false;
    return isPrependTen || isDoubled || hasStylisticSet;
  }
  function getPrefix(fontFamily, fontWeight) {
    var fontFamilySanitized = fontFamily.replace(/^['"]|['"]$/g, "").toLowerCase();
    var fontWeightInteger = parseInt(fontWeight);
    var fontWeightSanitized = isNaN(fontWeightInteger) ? "normal" : fontWeightInteger;
    return (FONT_FAMILY_WEIGHT_TO_PREFIX[fontFamilySanitized] || {})[fontWeightSanitized] || FONT_FAMILY_WEIGHT_FALLBACK[fontFamilySanitized];
  }
  function replaceForPosition(node, position) {
    var pendingAttribute = "".concat(DATA_FA_PSEUDO_ELEMENT_PENDING).concat(position.replace(":", "-"));
    return new Promise(function(resolve, reject) {
      if (node.getAttribute(pendingAttribute) !== null) {
        return resolve();
      }
      var children = toArray(node.children);
      var alreadyProcessedPseudoElement = children.filter(function(c$$1) {
        return c$$1.getAttribute(DATA_FA_PSEUDO_ELEMENT) === position;
      })[0];
      var styles2 = WINDOW.getComputedStyle(node, position);
      var fontFamily = styles2.getPropertyValue("font-family");
      var fontFamilyMatch = fontFamily.match(FONT_FAMILY_PATTERN);
      var fontWeight = styles2.getPropertyValue("font-weight");
      var content = styles2.getPropertyValue("content");
      if (alreadyProcessedPseudoElement && !fontFamilyMatch) {
        node.removeChild(alreadyProcessedPseudoElement);
        return resolve();
      } else if (fontFamilyMatch && content !== "none" && content !== "") {
        var _content = styles2.getPropertyValue("content");
        var prefix = getPrefix(fontFamily, fontWeight);
        var hexValue = hexValueFromContent(_content);
        var isV4 = fontFamilyMatch[0].startsWith("FontAwesome");
        var isSecondary = isSecondaryLayer(styles2);
        var iconName = byUnicode(prefix, hexValue);
        var iconIdentifier = iconName;
        if (isV4) {
          var iconName4 = byOldUnicode(hexValue);
          if (iconName4.iconName && iconName4.prefix) {
            iconName = iconName4.iconName;
            prefix = iconName4.prefix;
          }
        }
        if (iconName && !isSecondary && (!alreadyProcessedPseudoElement || alreadyProcessedPseudoElement.getAttribute(DATA_PREFIX) !== prefix || alreadyProcessedPseudoElement.getAttribute(DATA_ICON) !== iconIdentifier)) {
          node.setAttribute(pendingAttribute, iconIdentifier);
          if (alreadyProcessedPseudoElement) {
            node.removeChild(alreadyProcessedPseudoElement);
          }
          var meta = blankMeta();
          var extra = meta.extra;
          extra.attributes[DATA_FA_PSEUDO_ELEMENT] = position;
          findIcon(iconName, prefix).then(function(main) {
            var abstract = makeInlineSvgAbstract(_objectSpread2$2(_objectSpread2$2({}, meta), {}, {
              icons: {
                main,
                mask: emptyCanonicalIcon()
              },
              prefix,
              iconName: iconIdentifier,
              extra,
              watchable: true
            }));
            var element = DOCUMENT.createElementNS("http://www.w3.org/2000/svg", "svg");
            if (position === "::before") {
              node.insertBefore(element, node.firstChild);
            } else {
              node.appendChild(element);
            }
            element.outerHTML = abstract.map(function(a$$1) {
              return toHtml(a$$1);
            }).join("\n");
            node.removeAttribute(pendingAttribute);
            resolve();
          }).catch(reject);
        } else {
          resolve();
        }
      } else {
        resolve();
      }
    });
  }
  function replace2(node) {
    return Promise.all([replaceForPosition(node, "::before"), replaceForPosition(node, "::after")]);
  }
  function processable(node) {
    return node.parentNode !== document.head && !~TAGNAMES_TO_SKIP_FOR_PSEUDOELEMENTS.indexOf(node.tagName.toUpperCase()) && !node.getAttribute(DATA_FA_PSEUDO_ELEMENT) && (!node.parentNode || node.parentNode.tagName !== "svg");
  }
  var hasPseudoElement = function hasPseudoElement2(selector) {
    return !!selector && PSEUDO_ELEMENTS.some(function(pseudoSelector) {
      return selector.includes(pseudoSelector);
    });
  };
  var parseCSSRuleForPseudos = function parseCSSRuleForPseudos2(selectorText) {
    if (!selectorText) return [];
    var selectorSet = /* @__PURE__ */ new Set();
    var selectors = selectorText.split(/,(?![^()]*\))/).map(function(s$$1) {
      return s$$1.trim();
    });
    selectors = selectors.flatMap(function(selector2) {
      return selector2.includes("(") ? selector2 : selector2.split(",").map(function(s$$1) {
        return s$$1.trim();
      });
    });
    var _iterator = _createForOfIteratorHelper(selectors), _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done; ) {
        var selector = _step.value;
        if (hasPseudoElement(selector)) {
          var selectorWithoutPseudo = PSEUDO_ELEMENTS.reduce(function(acc, pseudoSelector) {
            return acc.replace(pseudoSelector, "");
          }, selector);
          if (selectorWithoutPseudo !== "" && selectorWithoutPseudo !== "*") {
            selectorSet.add(selectorWithoutPseudo);
          }
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return selectorSet;
  };
  function searchPseudoElements(root) {
    var useAsNodeList = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    if (!IS_DOM) return;
    var nodeList;
    if (useAsNodeList) {
      nodeList = root;
    } else if (config$2.searchPseudoElementsFullScan) {
      nodeList = root.querySelectorAll("*");
    } else {
      var selectorSet = /* @__PURE__ */ new Set();
      var _iterator2 = _createForOfIteratorHelper(document.styleSheets), _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
          var stylesheet = _step2.value;
          try {
            var _iterator3 = _createForOfIteratorHelper(stylesheet.cssRules), _step3;
            try {
              for (_iterator3.s(); !(_step3 = _iterator3.n()).done; ) {
                var rule = _step3.value;
                var parsedSelectors = parseCSSRuleForPseudos(rule.selectorText);
                var _iterator4 = _createForOfIteratorHelper(parsedSelectors), _step4;
                try {
                  for (_iterator4.s(); !(_step4 = _iterator4.n()).done; ) {
                    var selector = _step4.value;
                    selectorSet.add(selector);
                  }
                } catch (err) {
                  _iterator4.e(err);
                } finally {
                  _iterator4.f();
                }
              }
            } catch (err) {
              _iterator3.e(err);
            } finally {
              _iterator3.f();
            }
          } catch (e$$1) {
            if (config$2.searchPseudoElementsWarnings) {
              console.warn("Font Awesome: cannot parse stylesheet: ".concat(stylesheet.href, " (").concat(e$$1.message, ')\nIf it declares any Font Awesome CSS pseudo-elements, they will not be rendered as SVG icons. Add crossorigin="anonymous" to the <link>, enable searchPseudoElementsFullScan for slower but more thorough DOM parsing, or suppress this warning by setting searchPseudoElementsWarnings to false.'));
            }
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      if (!selectorSet.size) return;
      var cleanSelectors = Array.from(selectorSet).join(", ");
      try {
        nodeList = root.querySelectorAll(cleanSelectors);
      } catch (_unused) {
      }
    }
    return new Promise(function(resolve, reject) {
      var operations = toArray(nodeList).filter(processable).map(replace2);
      var end3 = perf.begin("searchPseudoElements");
      disableObservation();
      Promise.all(operations).then(function() {
        end3();
        enableObservation();
        resolve();
      }).catch(function() {
        end3();
        enableObservation();
        reject();
      });
    });
  }
  var PseudoElements = {
    hooks: function hooks3() {
      return {
        mutationObserverCallbacks: function mutationObserverCallbacks(accumulator) {
          accumulator.pseudoElementsCallback = searchPseudoElements;
          return accumulator;
        }
      };
    },
    provides: function provides3(providers2) {
      providers2.pseudoElements2svg = function(params) {
        var _params$node = params.node, node = _params$node === void 0 ? DOCUMENT : _params$node;
        if (config$2.searchPseudoElements) {
          searchPseudoElements(node);
        }
      };
    }
  };
  var _unwatched = false;
  var MutationObserver$1 = {
    mixout: function mixout6() {
      return {
        dom: {
          unwatch: function unwatch() {
            disableObservation();
            _unwatched = true;
          }
        }
      };
    },
    hooks: function hooks4() {
      return {
        bootstrap: function bootstrap() {
          observe(chainHooks("mutationObserverCallbacks", {}));
        },
        noAuto: function noAuto3() {
          disconnect();
        },
        watch: function watch2(params) {
          var observeMutationsRoot = params.observeMutationsRoot;
          if (_unwatched) {
            enableObservation();
          } else {
            observe(chainHooks("mutationObserverCallbacks", {
              observeMutationsRoot
            }));
          }
        }
      };
    }
  };
  var parseTransformString = function parseTransformString2(transformString) {
    var transform = {
      size: 16,
      x: 0,
      y: 0,
      flipX: false,
      flipY: false,
      rotate: 0
    };
    return transformString.toLowerCase().split(" ").reduce(function(acc, n2) {
      var parts = n2.toLowerCase().split("-");
      var first = parts[0];
      var rest = parts.slice(1).join("-");
      if (first && rest === "h") {
        acc.flipX = true;
        return acc;
      }
      if (first && rest === "v") {
        acc.flipY = true;
        return acc;
      }
      rest = parseFloat(rest);
      if (isNaN(rest)) {
        return acc;
      }
      switch (first) {
        case "grow":
          acc.size = acc.size + rest;
          break;
        case "shrink":
          acc.size = acc.size - rest;
          break;
        case "left":
          acc.x = acc.x - rest;
          break;
        case "right":
          acc.x = acc.x + rest;
          break;
        case "up":
          acc.y = acc.y - rest;
          break;
        case "down":
          acc.y = acc.y + rest;
          break;
        case "rotate":
          acc.rotate = acc.rotate + rest;
          break;
      }
      return acc;
    }, transform);
  };
  var PowerTransforms = {
    mixout: function mixout7() {
      return {
        parse: {
          transform: function transform(transformString) {
            return parseTransformString(transformString);
          }
        }
      };
    },
    hooks: function hooks5() {
      return {
        parseNodeAttributes: function parseNodeAttributes(accumulator, node) {
          var transformString = node.getAttribute("data-fa-transform");
          if (transformString) {
            accumulator.transform = parseTransformString(transformString);
          }
          return accumulator;
        }
      };
    },
    provides: function provides4(providers2) {
      providers2.generateAbstractTransformGrouping = function(_ref2) {
        var main = _ref2.main, transform = _ref2.transform, containerWidth = _ref2.containerWidth, iconWidth = _ref2.iconWidth;
        var outer = {
          transform: "translate(".concat(containerWidth / 2, " 256)")
        };
        var innerTranslate = "translate(".concat(transform.x * 32, ", ").concat(transform.y * 32, ") ");
        var innerScale = "scale(".concat(transform.size / 16 * (transform.flipX ? -1 : 1), ", ").concat(transform.size / 16 * (transform.flipY ? -1 : 1), ") ");
        var innerRotate = "rotate(".concat(transform.rotate, " 0 0)");
        var inner = {
          transform: "".concat(innerTranslate, " ").concat(innerScale, " ").concat(innerRotate)
        };
        var path = {
          transform: "translate(".concat(iconWidth / 2 * -1, " -256)")
        };
        var operations = {
          outer,
          inner,
          path
        };
        return {
          tag: "g",
          attributes: _objectSpread2$2({}, operations.outer),
          children: [{
            tag: "g",
            attributes: _objectSpread2$2({}, operations.inner),
            children: [{
              tag: main.icon.tag,
              children: main.icon.children,
              attributes: _objectSpread2$2(_objectSpread2$2({}, main.icon.attributes), operations.path)
            }]
          }]
        };
      };
    }
  };
  var ALL_SPACE = {
    x: 0,
    y: 0,
    width: "100%",
    height: "100%"
  };
  function fillBlack(abstract) {
    var force = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
    if (abstract.attributes && (abstract.attributes.fill || force)) {
      abstract.attributes.fill = "black";
    }
    return abstract;
  }
  function deGroup(abstract) {
    if (abstract.tag === "g") {
      return abstract.children;
    } else {
      return [abstract];
    }
  }
  var Masks = {
    hooks: function hooks6() {
      return {
        parseNodeAttributes: function parseNodeAttributes(accumulator, node) {
          var maskData = node.getAttribute("data-fa-mask");
          var mask = !maskData ? emptyCanonicalIcon() : getCanonicalIcon(maskData.split(" ").map(function(i2) {
            return i2.trim();
          }));
          if (!mask.prefix) {
            mask.prefix = getDefaultUsablePrefix();
          }
          accumulator.mask = mask;
          accumulator.maskId = node.getAttribute("data-fa-mask-id");
          return accumulator;
        }
      };
    },
    provides: function provides5(providers2) {
      providers2.generateAbstractMask = function(_ref2) {
        var children = _ref2.children, attributes = _ref2.attributes, main = _ref2.main, mask = _ref2.mask, explicitMaskId = _ref2.maskId, transform = _ref2.transform;
        var mainWidth = main.width, mainPath = main.icon;
        var maskWidth = mask.width, maskPath = mask.icon;
        var trans = transformForSvg({
          transform,
          containerWidth: maskWidth,
          iconWidth: mainWidth
        });
        var maskRect = {
          tag: "rect",
          attributes: _objectSpread2$2(_objectSpread2$2({}, ALL_SPACE), {}, {
            fill: "white"
          })
        };
        var maskInnerGroupChildrenMixin = mainPath.children ? {
          children: mainPath.children.map(fillBlack)
        } : {};
        var maskInnerGroup = {
          tag: "g",
          attributes: _objectSpread2$2({}, trans.inner),
          children: [fillBlack(_objectSpread2$2({
            tag: mainPath.tag,
            attributes: _objectSpread2$2(_objectSpread2$2({}, mainPath.attributes), trans.path)
          }, maskInnerGroupChildrenMixin))]
        };
        var maskOuterGroup = {
          tag: "g",
          attributes: _objectSpread2$2({}, trans.outer),
          children: [maskInnerGroup]
        };
        var maskId = "mask-".concat(explicitMaskId || nextUniqueId());
        var clipId = "clip-".concat(explicitMaskId || nextUniqueId());
        var maskTag = {
          tag: "mask",
          attributes: _objectSpread2$2(_objectSpread2$2({}, ALL_SPACE), {}, {
            id: maskId,
            maskUnits: "userSpaceOnUse",
            maskContentUnits: "userSpaceOnUse"
          }),
          children: [maskRect, maskOuterGroup]
        };
        var defs = {
          tag: "defs",
          children: [{
            tag: "clipPath",
            attributes: {
              id: clipId
            },
            children: deGroup(maskPath)
          }, maskTag]
        };
        children.push(defs, {
          tag: "rect",
          attributes: _objectSpread2$2({
            "fill": "currentColor",
            "clip-path": "url(#".concat(clipId, ")"),
            "mask": "url(#".concat(maskId, ")")
          }, ALL_SPACE)
        });
        return {
          children,
          attributes
        };
      };
    }
  };
  var MissingIconIndicator = {
    provides: function provides6(providers2) {
      var reduceMotion = false;
      if (WINDOW.matchMedia) {
        reduceMotion = WINDOW.matchMedia("(prefers-reduced-motion: reduce)").matches;
      }
      providers2.missingIconAbstract = function() {
        var gChildren = [];
        var FILL = {
          fill: "currentColor"
        };
        var ANIMATION_BASE = {
          attributeType: "XML",
          repeatCount: "indefinite",
          dur: "2s"
        };
        gChildren.push({
          tag: "path",
          attributes: _objectSpread2$2(_objectSpread2$2({}, FILL), {}, {
            d: "M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"
          })
        });
        var OPACITY_ANIMATE = _objectSpread2$2(_objectSpread2$2({}, ANIMATION_BASE), {}, {
          attributeName: "opacity"
        });
        var dot = {
          tag: "circle",
          attributes: _objectSpread2$2(_objectSpread2$2({}, FILL), {}, {
            cx: "256",
            cy: "364",
            r: "28"
          }),
          children: []
        };
        if (!reduceMotion) {
          dot.children.push({
            tag: "animate",
            attributes: _objectSpread2$2(_objectSpread2$2({}, ANIMATION_BASE), {}, {
              attributeName: "r",
              values: "28;14;28;28;14;28;"
            })
          }, {
            tag: "animate",
            attributes: _objectSpread2$2(_objectSpread2$2({}, OPACITY_ANIMATE), {}, {
              values: "1;0;1;1;0;1;"
            })
          });
        }
        gChildren.push(dot);
        gChildren.push({
          tag: "path",
          attributes: _objectSpread2$2(_objectSpread2$2({}, FILL), {}, {
            opacity: "1",
            d: "M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"
          }),
          children: reduceMotion ? [] : [{
            tag: "animate",
            attributes: _objectSpread2$2(_objectSpread2$2({}, OPACITY_ANIMATE), {}, {
              values: "1;0;0;0;0;1;"
            })
          }]
        });
        if (!reduceMotion) {
          gChildren.push({
            tag: "path",
            attributes: _objectSpread2$2(_objectSpread2$2({}, FILL), {}, {
              opacity: "0",
              d: "M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"
            }),
            children: [{
              tag: "animate",
              attributes: _objectSpread2$2(_objectSpread2$2({}, OPACITY_ANIMATE), {}, {
                values: "0;0;1;1;0;0;"
              })
            }]
          });
        }
        return {
          tag: "g",
          attributes: {
            class: "missing"
          },
          children: gChildren
        };
      };
    }
  };
  var SvgSymbols = {
    hooks: function hooks7() {
      return {
        parseNodeAttributes: function parseNodeAttributes(accumulator, node) {
          var symbolData = node.getAttribute("data-fa-symbol");
          var symbol = symbolData === null ? false : symbolData === "" ? true : symbolData;
          accumulator["symbol"] = symbol;
          return accumulator;
        }
      };
    }
  };
  var plugins = [InjectCSS, ReplaceElements, Layers, LayersCounter, LayersText, PseudoElements, MutationObserver$1, PowerTransforms, Masks, MissingIconIndicator, SvgSymbols];
  registerPlugins(plugins, {
    mixoutsTo: api
  });
  api.noAuto;
  var config$1$1 = api.config;
  api.library;
  api.dom;
  var parse$1 = api.parse;
  api.findIconDefinition;
  api.toHtml;
  var icon2 = api.icon;
  api.layer;
  api.text;
  api.counter;
  function _isNumerical(object) {
    object = object - 0;
    return object === object;
  }
  function camelize(string) {
    if (_isNumerical(string)) {
      return string;
    }
    string = string.replace(/[_-]+(.)?/g, (_2, chr) => {
      return chr ? chr.toUpperCase() : "";
    });
    return string.charAt(0).toLowerCase() + string.slice(1);
  }
  var createGradientStops = (stop, index2) => React.createElement("stop", {
    key: `${index2}-${stop.offset}`,
    offset: stop.offset,
    stopColor: stop.color,
    ...stop.opacity !== void 0 && { stopOpacity: stop.opacity }
  });
  function capitalize(val) {
    return val.charAt(0).toUpperCase() + val.slice(1);
  }
  var styleCache = /* @__PURE__ */ new Map();
  var STYLE_CACHE_LIMIT = 1e3;
  function styleToObject(style) {
    if (styleCache.has(style)) {
      return styleCache.get(style);
    }
    const result = {};
    let start = 0;
    const len = style.length;
    while (start < len) {
      const semicolonIndex = style.indexOf(";", start);
      const end2 = semicolonIndex === -1 ? len : semicolonIndex;
      const pair = style.slice(start, end2).trim();
      if (pair) {
        const colonIndex = pair.indexOf(":");
        if (colonIndex > 0) {
          const rawProp = pair.slice(0, colonIndex).trim();
          const value = pair.slice(colonIndex + 1).trim();
          if (rawProp && value) {
            const prop = camelize(rawProp);
            result[prop.startsWith("webkit") ? capitalize(prop) : prop] = value;
          }
        }
      }
      start = end2 + 1;
    }
    if (styleCache.size === STYLE_CACHE_LIMIT) {
      const oldestKey = styleCache.keys().next().value;
      if (oldestKey) {
        styleCache.delete(oldestKey);
      }
    }
    styleCache.set(style, result);
    return result;
  }
  function convert(createElement2, element, extraProps = {}) {
    if (typeof element === "string") {
      return element;
    }
    const children = (element.children || []).map((child) => {
      let element2 = child;
      if (("fill" in extraProps || extraProps.gradientFill) && child.tag === "path" && "fill" in child.attributes) {
        element2 = {
          ...child,
          attributes: {
            ...child.attributes,
            fill: void 0
          }
        };
      }
      return convert(createElement2, element2);
    });
    const elementAttributes = element.attributes || {};
    const attrs2 = {};
    for (const [key, val] of Object.entries(elementAttributes)) {
      switch (true) {
        case key === "class": {
          attrs2.className = val;
          break;
        }
        case key === "style": {
          attrs2.style = styleToObject(String(val));
          break;
        }
        case key.startsWith("aria-"):
        case key.startsWith("data-"): {
          attrs2[key.toLowerCase()] = val;
          break;
        }
        default: {
          attrs2[camelize(key)] = val;
        }
      }
    }
    const {
      style: existingStyle,
      role: existingRole,
      "aria-label": ariaLabel,
      gradientFill,
      ...remaining
    } = extraProps;
    if (existingStyle) {
      attrs2.style = attrs2.style ? { ...attrs2.style, ...existingStyle } : existingStyle;
    }
    if (existingRole) {
      attrs2.role = existingRole;
    }
    if (ariaLabel) {
      attrs2["aria-label"] = ariaLabel;
      attrs2["aria-hidden"] = "false";
    }
    if (gradientFill) {
      attrs2.fill = `url(#${gradientFill.id})`;
      const {
        type: gradientType,
        stops: gradientStops = [],
        ...gradientProps
      } = gradientFill;
      children.unshift(
        createElement2(
          gradientType === "linear" ? "linearGradient" : "radialGradient",
          {
            ...gradientProps,
            id: gradientFill.id
          },
          gradientStops.map(createGradientStops)
        )
      );
    }
    return createElement2(element.tag, { ...attrs2, ...remaining }, ...children);
  }
  var makeReactConverter = convert.bind(null, React.createElement);
  var useAccessibilityId = (id2, hasAccessibleProps) => {
    const generatedId = reactExports.useId();
    return id2 || (hasAccessibleProps ? generatedId : void 0);
  };
  var Logger = class {
    constructor(scope = "react-fontawesome") {
      this.enabled = false;
      let IS_DEV = false;
      try {
        IS_DEV = typeof process !== "undefined" && false;
      } catch {
      }
      this.scope = scope;
      this.enabled = IS_DEV;
    }
    /**
     * Logs messages to the console if not in production.
     * @param args - The message and/or data to log.
     */
    log(...args) {
      if (!this.enabled) return;
      console.log(`[${this.scope}]`, ...args);
    }
    /**
     * Logs warnings to the console if not in production.
     * @param args - The warning message and/or data to log.
     */
    warn(...args) {
      if (!this.enabled) return;
      console.warn(`[${this.scope}]`, ...args);
    }
    /**
     * Logs errors to the console if not in production.
     * @param args - The error message and/or data to log.
     */
    error(...args) {
      if (!this.enabled) return;
      console.error(`[${this.scope}]`, ...args);
    }
  };
  var SVG_CORE_VERSION = (
    // @ts-expect-error TS2872 - Expression is always truthy - This is true when v7 of SVGCore is used, but not when v6 is used.
    // This is the point of this check - if the property exists on config, we have v7, otherwise we have v6.
    // TS is checking this against the dev dependencies which uses v7, so it reports a false error here.
    "searchPseudoElementsFullScan" in config$1$1 && typeof config$1$1.searchPseudoElementsFullScan === "boolean" ? "7.0.0" : "6.0.0"
  );
  var IS_VERSION_7_OR_LATER = Number.parseInt(SVG_CORE_VERSION) >= 7;
  var getIsVersion7OrLater = () => IS_VERSION_7_OR_LATER;
  var DEFAULT_CLASSNAME_PREFIX = "fa";
  var ANIMATION_CLASSES = {
    beat: "fa-beat",
    fade: "fa-fade",
    beatFade: "fa-beat-fade",
    bounce: "fa-bounce",
    shake: "fa-shake",
    spin: "fa-spin",
    spinPulse: "fa-spin-pulse",
    spinReverse: "fa-spin-reverse",
    pulse: "fa-pulse"
  };
  var PULL_CLASSES = {
    left: "fa-pull-left",
    right: "fa-pull-right"
  };
  var ROTATE_CLASSES = {
    "90": "fa-rotate-90",
    "180": "fa-rotate-180",
    "270": "fa-rotate-270"
  };
  var SIZE_CLASSES = {
    "2xs": "fa-2xs",
    xs: "fa-xs",
    sm: "fa-sm",
    lg: "fa-lg",
    xl: "fa-xl",
    "2xl": "fa-2xl",
    "1x": "fa-1x",
    "2x": "fa-2x",
    "3x": "fa-3x",
    "4x": "fa-4x",
    "5x": "fa-5x",
    "6x": "fa-6x",
    "7x": "fa-7x",
    "8x": "fa-8x",
    "9x": "fa-9x",
    "10x": "fa-10x"
  };
  var STYLE_CLASSES = {
    border: "fa-border",
    /** @deprecated */
    fixedWidth: "fa-fw",
    flip: "fa-flip",
    flipHorizontal: "fa-flip-horizontal",
    flipVertical: "fa-flip-vertical",
    inverse: "fa-inverse",
    rotateBy: "fa-rotate-by",
    swapOpacity: "fa-swap-opacity",
    widthAuto: "fa-width-auto"
  };
  function withPrefix(cls) {
    const prefix = config$1$1.cssPrefix || config$1$1.familyPrefix || DEFAULT_CLASSNAME_PREFIX;
    return prefix === DEFAULT_CLASSNAME_PREFIX ? cls : cls.replace(
      new RegExp(String.raw`(?<=^|\s)${DEFAULT_CLASSNAME_PREFIX}-`, "g"),
      `${prefix}-`
    );
  }
  function getClassListFromProps(props) {
    const {
      beat,
      fade,
      beatFade,
      bounce,
      shake,
      spin,
      spinPulse,
      spinReverse,
      pulse,
      fixedWidth,
      inverse,
      border,
      flip,
      size,
      rotation,
      pull,
      swapOpacity,
      rotateBy,
      widthAuto,
      className
    } = props;
    const result = [];
    if (className) result.push(...className.split(" "));
    if (beat) result.push(ANIMATION_CLASSES.beat);
    if (fade) result.push(ANIMATION_CLASSES.fade);
    if (beatFade) result.push(ANIMATION_CLASSES.beatFade);
    if (bounce) result.push(ANIMATION_CLASSES.bounce);
    if (shake) result.push(ANIMATION_CLASSES.shake);
    if (spin) result.push(ANIMATION_CLASSES.spin);
    if (spinReverse) result.push(ANIMATION_CLASSES.spinReverse);
    if (spinPulse) result.push(ANIMATION_CLASSES.spinPulse);
    if (pulse) result.push(ANIMATION_CLASSES.pulse);
    if (fixedWidth) result.push(STYLE_CLASSES.fixedWidth);
    if (inverse) result.push(STYLE_CLASSES.inverse);
    if (border) result.push(STYLE_CLASSES.border);
    if (flip === true) result.push(STYLE_CLASSES.flip);
    if (flip === "horizontal" || flip === "both") {
      result.push(STYLE_CLASSES.flipHorizontal);
    }
    if (flip === "vertical" || flip === "both") {
      result.push(STYLE_CLASSES.flipVertical);
    }
    if (size !== void 0 && size !== null) result.push(SIZE_CLASSES[size]);
    if (rotation !== void 0 && rotation !== null && rotation !== 0) {
      result.push(ROTATE_CLASSES[rotation]);
    }
    if (pull !== void 0 && pull !== null) result.push(PULL_CLASSES[pull]);
    if (swapOpacity) result.push(STYLE_CLASSES.swapOpacity);
    if (!getIsVersion7OrLater()) return result;
    if (rotateBy) result.push(STYLE_CLASSES.rotateBy);
    if (widthAuto) result.push(STYLE_CLASSES.widthAuto);
    const prefix = config$1$1.cssPrefix || config$1$1.familyPrefix || DEFAULT_CLASSNAME_PREFIX;
    return prefix === DEFAULT_CLASSNAME_PREFIX ? result : (
      // TODO: see if we can achieve custom prefix support without iterating
      // eslint-disable-next-line unicorn/no-array-callback-reference
      result.map(withPrefix)
    );
  }
  var isIconDefinition = (icon22) => typeof icon22 === "object" && "icon" in icon22 && !!icon22.icon;
  function normalizeIconArgs(icon22) {
    if (!icon22) {
      return void 0;
    }
    if (isIconDefinition(icon22)) {
      return icon22;
    }
    return parse$1.icon(icon22);
  }
  function typedObjectKeys(obj) {
    return Object.keys(obj);
  }
  var logger = new Logger("FontAwesomeIcon");
  var DEFAULT_PROPS = {
    border: false,
    className: "",
    mask: void 0,
    maskId: void 0,
    fixedWidth: false,
    inverse: false,
    flip: false,
    icon: void 0,
    listItem: false,
    pull: void 0,
    pulse: false,
    rotation: void 0,
    rotateBy: false,
    size: void 0,
    spin: false,
    spinPulse: false,
    spinReverse: false,
    beat: false,
    fade: false,
    beatFade: false,
    bounce: false,
    shake: false,
    symbol: false,
    title: "",
    titleId: void 0,
    transform: void 0,
    swapOpacity: false,
    widthAuto: false
  };
  var DEFAULT_PROP_KEYS = new Set(Object.keys(DEFAULT_PROPS));
  var FontAwesomeIcon = React.forwardRef((props, ref) => {
    const allProps = { ...DEFAULT_PROPS, ...props };
    const {
      icon: iconArgs,
      mask: maskArgs,
      symbol,
      title,
      titleId: titleIdFromProps,
      maskId: maskIdFromProps,
      transform
    } = allProps;
    const maskId = useAccessibilityId(maskIdFromProps, Boolean(maskArgs));
    const titleId = useAccessibilityId(titleIdFromProps, Boolean(title));
    const iconLookup = normalizeIconArgs(iconArgs);
    if (!iconLookup) {
      logger.error("Icon lookup is undefined", iconArgs);
      return null;
    }
    const classList = getClassListFromProps(allProps);
    const transformProps = typeof transform === "string" ? parse$1.transform(transform) : transform;
    const normalizedMaskArgs = normalizeIconArgs(maskArgs);
    const renderedIcon = icon2(iconLookup, {
      ...classList.length > 0 && { classes: classList },
      ...transformProps && { transform: transformProps },
      ...normalizedMaskArgs && { mask: normalizedMaskArgs },
      symbol,
      title,
      titleId,
      maskId
    });
    if (!renderedIcon) {
      logger.error("Could not find icon", iconLookup);
      return null;
    }
    const { abstract } = renderedIcon;
    const extraProps = { ref };
    for (const key of typedObjectKeys(allProps)) {
      if (DEFAULT_PROP_KEYS.has(key)) {
        continue;
      }
      extraProps[key] = allProps[key];
    }
    return makeReactConverter(abstract[0], extraProps);
  });
  FontAwesomeIcon.displayName = "FontAwesomeIcon";
  /*!
   * Font Awesome Free 7.2.0 by @fontawesome - https://fontawesome.com
   * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
   * Copyright 2026 Fonticons, Inc.
   */
  var faFilter = {
    prefix: "fas",
    iconName: "filter",
    icon: [512, 512, [], "f0b0", "M32 64C19.1 64 7.4 71.8 2.4 83.8S.2 109.5 9.4 118.6L192 301.3 192 416c0 8.5 3.4 16.6 9.4 22.6l64 64c9.2 9.2 22.9 11.9 34.9 6.9S320 492.9 320 480l0-178.7 182.6-182.6c9.2-9.2 11.9-22.9 6.9-34.9S492.9 64 480 64L32 64z"]
  };
  var faAngleLeft = {
    prefix: "fas",
    iconName: "angle-left",
    icon: [256, 512, [8249], "f104", "M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"]
  };
  var faChevronRight = {
    prefix: "fas",
    iconName: "chevron-right",
    icon: [320, 512, [9002], "f054", "M311.1 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L243.2 256 73.9 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"]
  };
  var faMars = {
    prefix: "fas",
    iconName: "mars",
    icon: [512, 512, [9794], "f222", "M320 32c0-17.7 14.3-32 32-32L480 0c17.7 0 32 14.3 32 32l0 128c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-50.7-95 95c19.5 28.4 31 62.7 31 99.8 0 97.2-78.8 176-176 176S32 401.2 32 304 110.8 128 208 128c37 0 71.4 11.4 99.8 31l95-95-50.7 0c-17.7 0-32-14.3-32-32zM208 416a112 112 0 1 0 0-224 112 112 0 1 0 0 224z"]
  };
  var faMarsAndVenus = {
    prefix: "fas",
    iconName: "mars-and-venus",
    icon: [512, 512, [9893], "f224", "M368 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l112 0c17.7 0 32 14.3 32 32l0 112c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-34.7-63 63c19.5 28.4 31 62.7 31 99.8 0 86.3-62.1 158.1-144 173.1l0 34.9 32 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-32 0 0 32c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-32-32 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l32 0 0-34.9c-81.9-15-144-86.8-144-173.1 0-97.2 78.8-176 176-176 37 0 71.4 11.4 99.8 31l63-63-34.7 0zM352 208a112 112 0 1 0 -224 0 112 112 0 1 0 224 0z"]
  };
  var faAngleRight = {
    prefix: "fas",
    iconName: "angle-right",
    icon: [256, 512, [8250], "f105", "M247.1 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L179.2 256 41.9 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"]
  };
  var faVenus = {
    prefix: "fas",
    iconName: "venus",
    icon: [384, 512, [9792], "f221", "M80 176a112 112 0 1 1 224 0 112 112 0 1 1 -224 0zM223.9 349.1C305.9 334.1 368 262.3 368 176 368 78.8 289.2 0 192 0S16 78.8 16 176c0 86.3 62.1 158.1 144.1 173.1-.1 1-.1 1.9-.1 2.9l0 64-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l32 0 0 32c0 17.7 14.3 32 32 32s32-14.3 32-32l0-32 32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0 0-64c0-1 0-1.9-.1-2.9z"]
  };
  var faPlay = {
    prefix: "fas",
    iconName: "play",
    icon: [448, 512, [9654], "f04b", "M91.2 36.9c-12.4-6.8-27.4-6.5-39.6 .7S32 57.9 32 72l0 368c0 14.1 7.5 27.2 19.6 34.4s27.2 7.5 39.6 .7l336-184c12.8-7 20.8-20.5 20.8-35.1s-8-28.1-20.8-35.1l-336-184z"]
  };
  var faXmark = {
    prefix: "fas",
    iconName: "xmark",
    icon: [384, 512, [128473, 10005, 10006, 10060, 215, "close", "multiply", "remove", "times"], "f00d", "M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"]
  };
  var faChevronDown = {
    prefix: "fas",
    iconName: "chevron-down",
    icon: [448, 512, [], "f078", "M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"]
  };
  var faChevronLeft = {
    prefix: "fas",
    iconName: "chevron-left",
    icon: [320, 512, [9001], "f053", "M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"]
  };
  var faAnglesRight = {
    prefix: "fas",
    iconName: "angles-right",
    icon: [448, 512, [187, "angle-double-right"], "f101", "M439.1 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L371.2 256 233.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160zm-352 160l160-160c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L179.2 256 41.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0z"]
  };
  var faAnglesLeft = {
    prefix: "fas",
    iconName: "angles-left",
    icon: [448, 512, [171, "angle-double-left"], "f100", "M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160zm352-160l-160 160c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L269.3 256 406.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0z"]
  };
  function _arrayLikeToArray(r2, a2) {
    (null == a2 || a2 > r2.length) && (a2 = r2.length);
    for (var e2 = 0, n2 = Array(a2); e2 < a2; e2++) n2[e2] = r2[e2];
    return n2;
  }
  function _arrayWithHoles(r2) {
    if (Array.isArray(r2)) return r2;
  }
  function _defineProperty$1(e2, r2, t2) {
    return (r2 = _toPropertyKey(r2)) in e2 ? Object.defineProperty(e2, r2, {
      value: t2,
      enumerable: true,
      configurable: true,
      writable: true
    }) : e2[r2] = t2, e2;
  }
  function _iterableToArrayLimit(r2, l2) {
    var t2 = null == r2 ? null : "undefined" != typeof Symbol && r2[Symbol.iterator] || r2["@@iterator"];
    if (null != t2) {
      var e2, n2, i2, u2, a2 = [], f2 = true, o2 = false;
      try {
        if (i2 = (t2 = t2.call(r2)).next, 0 === l2) ;
        else for (; !(f2 = (e2 = i2.call(t2)).done) && (a2.push(e2.value), a2.length !== l2); f2 = true) ;
      } catch (r3) {
        o2 = true, n2 = r3;
      } finally {
        try {
          if (!f2 && null != t2.return && (u2 = t2.return(), Object(u2) !== u2)) return;
        } finally {
          if (o2) throw n2;
        }
      }
      return a2;
    }
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function ownKeys$1(e2, r2) {
    var t2 = Object.keys(e2);
    if (Object.getOwnPropertySymbols) {
      var o2 = Object.getOwnPropertySymbols(e2);
      r2 && (o2 = o2.filter(function(r3) {
        return Object.getOwnPropertyDescriptor(e2, r3).enumerable;
      })), t2.push.apply(t2, o2);
    }
    return t2;
  }
  function _objectSpread2$1(e2) {
    for (var r2 = 1; r2 < arguments.length; r2++) {
      var t2 = null != arguments[r2] ? arguments[r2] : {};
      r2 % 2 ? ownKeys$1(Object(t2), true).forEach(function(r3) {
        _defineProperty$1(e2, r3, t2[r3]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e2, Object.getOwnPropertyDescriptors(t2)) : ownKeys$1(Object(t2)).forEach(function(r3) {
        Object.defineProperty(e2, r3, Object.getOwnPropertyDescriptor(t2, r3));
      });
    }
    return e2;
  }
  function _objectWithoutProperties(e2, t2) {
    if (null == e2) return {};
    var o2, r2, i2 = _objectWithoutPropertiesLoose(e2, t2);
    if (Object.getOwnPropertySymbols) {
      var n2 = Object.getOwnPropertySymbols(e2);
      for (r2 = 0; r2 < n2.length; r2++) o2 = n2[r2], -1 === t2.indexOf(o2) && {}.propertyIsEnumerable.call(e2, o2) && (i2[o2] = e2[o2]);
    }
    return i2;
  }
  function _objectWithoutPropertiesLoose(r2, e2) {
    if (null == r2) return {};
    var t2 = {};
    for (var n2 in r2) if ({}.hasOwnProperty.call(r2, n2)) {
      if (-1 !== e2.indexOf(n2)) continue;
      t2[n2] = r2[n2];
    }
    return t2;
  }
  function _slicedToArray(r2, e2) {
    return _arrayWithHoles(r2) || _iterableToArrayLimit(r2, e2) || _unsupportedIterableToArray(r2, e2) || _nonIterableRest();
  }
  function _toPrimitive(t2, r2) {
    if ("object" != typeof t2 || !t2) return t2;
    var e2 = t2[Symbol.toPrimitive];
    if (void 0 !== e2) {
      var i2 = e2.call(t2, r2);
      if ("object" != typeof i2) return i2;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r2 ? String : Number)(t2);
  }
  function _toPropertyKey(t2) {
    var i2 = _toPrimitive(t2, "string");
    return "symbol" == typeof i2 ? i2 : i2 + "";
  }
  function _unsupportedIterableToArray(r2, a2) {
    if (r2) {
      if ("string" == typeof r2) return _arrayLikeToArray(r2, a2);
      var t2 = {}.toString.call(r2).slice(8, -1);
      return "Object" === t2 && r2.constructor && (t2 = r2.constructor.name), "Map" === t2 || "Set" === t2 ? Array.from(r2) : "Arguments" === t2 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t2) ? _arrayLikeToArray(r2, a2) : void 0;
    }
  }
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread2(target) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var source = arguments[i2] != null ? arguments[i2] : {};
      if (i2 % 2) {
        ownKeys(Object(source), true).forEach(function(key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function(key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }
    return target;
  }
  function compose$1() {
    for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
      fns[_key] = arguments[_key];
    }
    return function(x2) {
      return fns.reduceRight(function(y2, f2) {
        return f2(y2);
      }, x2);
    };
  }
  function curry$1(fn) {
    return function curried() {
      var _this = this;
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      return args.length >= fn.length ? fn.apply(this, args) : function() {
        for (var _len3 = arguments.length, nextArgs = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          nextArgs[_key3] = arguments[_key3];
        }
        return curried.apply(_this, [].concat(args, nextArgs));
      };
    };
  }
  function isObject$1(value) {
    return {}.toString.call(value).includes("Object");
  }
  function isEmpty(obj) {
    return !Object.keys(obj).length;
  }
  function isFunction(value) {
    return typeof value === "function";
  }
  function hasOwnProperty(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  }
  function validateChanges(initial2, changes) {
    if (!isObject$1(changes)) errorHandler$1("changeType");
    if (Object.keys(changes).some(function(field) {
      return !hasOwnProperty(initial2, field);
    })) errorHandler$1("changeField");
    return changes;
  }
  function validateSelector(selector) {
    if (!isFunction(selector)) errorHandler$1("selectorType");
  }
  function validateHandler(handler) {
    if (!(isFunction(handler) || isObject$1(handler))) errorHandler$1("handlerType");
    if (isObject$1(handler) && Object.values(handler).some(function(_handler) {
      return !isFunction(_handler);
    })) errorHandler$1("handlersType");
  }
  function validateInitial(initial2) {
    if (!initial2) errorHandler$1("initialIsRequired");
    if (!isObject$1(initial2)) errorHandler$1("initialType");
    if (isEmpty(initial2)) errorHandler$1("initialContent");
  }
  function throwError$1(errorMessages2, type) {
    throw new Error(errorMessages2[type] || errorMessages2["default"]);
  }
  var errorMessages$1 = {
    initialIsRequired: "initial state is required",
    initialType: "initial state should be an object",
    initialContent: "initial state shouldn't be an empty object",
    handlerType: "handler should be an object or a function",
    handlersType: "all handlers should be a functions",
    selectorType: "selector should be a function",
    changeType: "provided value of changes should be an object",
    changeField: 'it seams you want to change a field in the state which is not specified in the "initial" state',
    "default": "an unknown error accured in `state-local` package"
  };
  var errorHandler$1 = curry$1(throwError$1)(errorMessages$1);
  var validators$1 = {
    changes: validateChanges,
    selector: validateSelector,
    handler: validateHandler,
    initial: validateInitial
  };
  function create(initial2) {
    var handler = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    validators$1.initial(initial2);
    validators$1.handler(handler);
    var state = {
      current: initial2
    };
    var didUpdate = curry$1(didStateUpdate)(state, handler);
    var update = curry$1(updateState)(state);
    var validate = curry$1(validators$1.changes)(initial2);
    var getChanges = curry$1(extractChanges)(state);
    function getState2() {
      var selector = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function(state2) {
        return state2;
      };
      validators$1.selector(selector);
      return selector(state.current);
    }
    function setState2(causedChanges) {
      compose$1(didUpdate, update, validate, getChanges)(causedChanges);
    }
    return [getState2, setState2];
  }
  function extractChanges(state, causedChanges) {
    return isFunction(causedChanges) ? causedChanges(state.current) : causedChanges;
  }
  function updateState(state, changes) {
    state.current = _objectSpread2(_objectSpread2({}, state.current), changes);
    return changes;
  }
  function didStateUpdate(state, handler, changes) {
    isFunction(handler) ? handler(state.current) : Object.keys(changes).forEach(function(field) {
      var _handler$field;
      return (_handler$field = handler[field]) === null || _handler$field === void 0 ? void 0 : _handler$field.call(handler, state.current[field]);
    });
    return changes;
  }
  var index = {
    create
  };
  var config$1 = {
    paths: {
      vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.55.1/min/vs"
    }
  };
  function curry(fn) {
    return function curried() {
      var _this = this;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return args.length >= fn.length ? fn.apply(this, args) : function() {
        for (var _len2 = arguments.length, nextArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          nextArgs[_key2] = arguments[_key2];
        }
        return curried.apply(_this, [].concat(args, nextArgs));
      };
    };
  }
  function isObject(value) {
    return {}.toString.call(value).includes("Object");
  }
  function validateConfig(config2) {
    if (!config2) errorHandler("configIsRequired");
    if (!isObject(config2)) errorHandler("configType");
    if (config2.urls) {
      informAboutDeprecation();
      return {
        paths: {
          vs: config2.urls.monacoBase
        }
      };
    }
    return config2;
  }
  function informAboutDeprecation() {
    console.warn(errorMessages.deprecation);
  }
  function throwError(errorMessages2, type) {
    throw new Error(errorMessages2[type] || errorMessages2["default"]);
  }
  var errorMessages = {
    configIsRequired: "the configuration object is required",
    configType: "the configuration object should be an object",
    "default": "an unknown error accured in `@monaco-editor/loader` package",
    deprecation: "Deprecation warning!\n    You are using deprecated way of configuration.\n\n    Instead of using\n      monaco.config({ urls: { monacoBase: '...' } })\n    use\n      monaco.config({ paths: { vs: '...' } })\n\n    For more please check the link https://github.com/suren-atoyan/monaco-loader#config\n  "
  };
  var errorHandler = curry(throwError)(errorMessages);
  var validators = {
    config: validateConfig
  };
  var compose = function compose2() {
    for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
      fns[_key] = arguments[_key];
    }
    return function(x2) {
      return fns.reduceRight(function(y2, f2) {
        return f2(y2);
      }, x2);
    };
  };
  function merge(target, source) {
    Object.keys(source).forEach(function(key) {
      if (source[key] instanceof Object) {
        if (target[key]) {
          Object.assign(source[key], merge(target[key], source[key]));
        }
      }
    });
    return _objectSpread2$1(_objectSpread2$1({}, target), source);
  }
  var CANCELATION_MESSAGE = {
    type: "cancelation",
    msg: "operation is manually canceled"
  };
  function makeCancelable(promise) {
    var hasCanceled_ = false;
    var wrappedPromise = new Promise(function(resolve, reject) {
      promise.then(function(val) {
        return hasCanceled_ ? reject(CANCELATION_MESSAGE) : resolve(val);
      });
      promise["catch"](reject);
    });
    return wrappedPromise.cancel = function() {
      return hasCanceled_ = true;
    }, wrappedPromise;
  }
  var _excluded = ["monaco"];
  var _state$create = index.create({
    config: config$1,
    isInitialized: false,
    resolve: null,
    reject: null,
    monaco: null
  }), _state$create2 = _slicedToArray(_state$create, 2), getState = _state$create2[0], setState = _state$create2[1];
  function config(globalConfig) {
    var _validators$config = validators.config(globalConfig), monaco = _validators$config.monaco, config2 = _objectWithoutProperties(_validators$config, _excluded);
    setState(function(state) {
      return {
        config: merge(state.config, config2),
        monaco
      };
    });
  }
  function init() {
    var state = getState(function(_ref2) {
      var monaco = _ref2.monaco, isInitialized = _ref2.isInitialized, resolve = _ref2.resolve;
      return {
        monaco,
        isInitialized,
        resolve
      };
    });
    if (!state.isInitialized) {
      setState({
        isInitialized: true
      });
      if (state.monaco) {
        state.resolve(state.monaco);
        return makeCancelable(wrapperPromise);
      }
      if (window.monaco && window.monaco.editor) {
        storeMonacoInstance(window.monaco);
        state.resolve(window.monaco);
        return makeCancelable(wrapperPromise);
      }
      compose(injectScripts, getMonacoLoaderScript)(configureLoader);
    }
    return makeCancelable(wrapperPromise);
  }
  function injectScripts(script) {
    return document.body.appendChild(script);
  }
  function createScript(src) {
    var script = document.createElement("script");
    return src && (script.src = src), script;
  }
  function getMonacoLoaderScript(configureLoader2) {
    var state = getState(function(_ref2) {
      var config2 = _ref2.config, reject = _ref2.reject;
      return {
        config: config2,
        reject
      };
    });
    var loaderScript = createScript("".concat(state.config.paths.vs, "/loader.js"));
    loaderScript.onload = function() {
      return configureLoader2();
    };
    loaderScript.onerror = state.reject;
    return loaderScript;
  }
  function configureLoader() {
    var state = getState(function(_ref3) {
      var config2 = _ref3.config, resolve = _ref3.resolve, reject = _ref3.reject;
      return {
        config: config2,
        resolve,
        reject
      };
    });
    var require = window.require;
    require.config(state.config);
    require(["vs/editor/editor.main"], function(loaded2) {
      var monaco = loaded2.m || loaded2;
      storeMonacoInstance(monaco);
      state.resolve(monaco);
    }, function(error) {
      state.reject(error);
    });
  }
  function storeMonacoInstance(monaco) {
    if (!getState().monaco) {
      setState({
        monaco
      });
    }
  }
  function __getMonacoInstance() {
    return getState(function(_ref4) {
      var monaco = _ref4.monaco;
      return monaco;
    });
  }
  var wrapperPromise = new Promise(function(resolve, reject) {
    return setState({
      resolve,
      reject
    });
  });
  var loader = {
    config,
    init,
    __getMonacoInstance
  };
  var le = { wrapper: { display: "flex", position: "relative", textAlign: "initial" }, fullWidth: { width: "100%" }, hide: { display: "none" } }, v = le;
  var ae = { container: { display: "flex", height: "100%", width: "100%", justifyContent: "center", alignItems: "center" } }, Y = ae;
  function Me({ children: e2 }) {
    return React.createElement("div", { style: Y.container }, e2);
  }
  var Z = Me;
  var $ = Z;
  function Ee({ width: e2, height: r2, isEditorReady: n2, loading: t2, _ref: a2, className: m2, wrapperProps: E2 }) {
    return React.createElement("section", { style: { ...v.wrapper, width: e2, height: r2 }, ...E2 }, !n2 && React.createElement($, null, t2), React.createElement("div", { ref: a2, style: { ...v.fullWidth, ...!n2 && v.hide }, className: m2 }));
  }
  var ee = Ee;
  var H = reactExports.memo(ee);
  function Ce(e2) {
    reactExports.useEffect(e2, []);
  }
  var k = Ce;
  function he(e2, r2, n2 = true) {
    let t2 = reactExports.useRef(true);
    reactExports.useEffect(t2.current || !n2 ? () => {
      t2.current = false;
    } : e2, r2);
  }
  var l = he;
  function D() {
  }
  function h(e2, r2, n2, t2) {
    return De(e2, t2) || be(e2, r2, n2, t2);
  }
  function De(e2, r2) {
    return e2.editor.getModel(te(e2, r2));
  }
  function be(e2, r2, n2, t2) {
    return e2.editor.createModel(r2, n2, t2 ? te(e2, t2) : void 0);
  }
  function te(e2, r2) {
    return e2.Uri.parse(r2);
  }
  function Oe({ original: e2, modified: r2, language: n2, originalLanguage: t2, modifiedLanguage: a2, originalModelPath: m2, modifiedModelPath: E2, keepCurrentOriginalModel: g2 = false, keepCurrentModifiedModel: N2 = false, theme: x2 = "light", loading: P2 = "Loading...", options: y2 = {}, height: V2 = "100%", width: z2 = "100%", className: F2, wrapperProps: j2 = {}, beforeMount: A2 = D, onMount: q2 = D }) {
    let [M2, O2] = reactExports.useState(false), [T2, s2] = reactExports.useState(true), u2 = reactExports.useRef(null), c2 = reactExports.useRef(null), w2 = reactExports.useRef(null), d2 = reactExports.useRef(q2), o2 = reactExports.useRef(A2), b2 = reactExports.useRef(false);
    k(() => {
      let i2 = loader.init();
      return i2.then((f2) => (c2.current = f2) && s2(false)).catch((f2) => (f2 == null ? void 0 : f2.type) !== "cancelation" && console.error("Monaco initialization: error:", f2)), () => u2.current ? I2() : i2.cancel();
    }), l(() => {
      if (u2.current && c2.current) {
        let i2 = u2.current.getOriginalEditor(), f2 = h(c2.current, e2 || "", t2 || n2 || "text", m2 || "");
        f2 !== i2.getModel() && i2.setModel(f2);
      }
    }, [m2], M2), l(() => {
      if (u2.current && c2.current) {
        let i2 = u2.current.getModifiedEditor(), f2 = h(c2.current, r2 || "", a2 || n2 || "text", E2 || "");
        f2 !== i2.getModel() && i2.setModel(f2);
      }
    }, [E2], M2), l(() => {
      let i2 = u2.current.getModifiedEditor();
      i2.getOption(c2.current.editor.EditorOption.readOnly) ? i2.setValue(r2 || "") : r2 !== i2.getValue() && (i2.executeEdits("", [{ range: i2.getModel().getFullModelRange(), text: r2 || "", forceMoveMarkers: true }]), i2.pushUndoStop());
    }, [r2], M2), l(() => {
      var _a, _b;
      (_b = (_a = u2.current) == null ? void 0 : _a.getModel()) == null ? void 0 : _b.original.setValue(e2 || "");
    }, [e2], M2), l(() => {
      let { original: i2, modified: f2 } = u2.current.getModel();
      c2.current.editor.setModelLanguage(i2, t2 || n2 || "text"), c2.current.editor.setModelLanguage(f2, a2 || n2 || "text");
    }, [n2, t2, a2], M2), l(() => {
      var _a;
      (_a = c2.current) == null ? void 0 : _a.editor.setTheme(x2);
    }, [x2], M2), l(() => {
      var _a;
      (_a = u2.current) == null ? void 0 : _a.updateOptions(y2);
    }, [y2], M2);
    let L2 = reactExports.useCallback(() => {
      var _a;
      if (!c2.current) return;
      o2.current(c2.current);
      let i2 = h(c2.current, e2 || "", t2 || n2 || "text", m2 || ""), f2 = h(c2.current, r2 || "", a2 || n2 || "text", E2 || "");
      (_a = u2.current) == null ? void 0 : _a.setModel({ original: i2, modified: f2 });
    }, [n2, r2, a2, e2, t2, m2, E2]), U2 = reactExports.useCallback(() => {
      var _a;
      !b2.current && w2.current && (u2.current = c2.current.editor.createDiffEditor(w2.current, { automaticLayout: true, ...y2 }), L2(), (_a = c2.current) == null ? void 0 : _a.editor.setTheme(x2), O2(true), b2.current = true);
    }, [y2, x2, L2]);
    reactExports.useEffect(() => {
      M2 && d2.current(u2.current, c2.current);
    }, [M2]), reactExports.useEffect(() => {
      !T2 && !M2 && U2();
    }, [T2, M2, U2]);
    function I2() {
      var _a, _b, _c, _d;
      let i2 = (_a = u2.current) == null ? void 0 : _a.getModel();
      g2 || ((_b = i2 == null ? void 0 : i2.original) == null ? void 0 : _b.dispose()), N2 || ((_c = i2 == null ? void 0 : i2.modified) == null ? void 0 : _c.dispose()), (_d = u2.current) == null ? void 0 : _d.dispose();
    }
    return React.createElement(H, { width: z2, height: V2, isEditorReady: M2, loading: P2, _ref: w2, className: F2, wrapperProps: j2 });
  }
  var ie = Oe;
  reactExports.memo(ie);
  function He(e2) {
    let r2 = reactExports.useRef();
    return reactExports.useEffect(() => {
      r2.current = e2;
    }, [e2]), r2.current;
  }
  var se = He;
  var _ = /* @__PURE__ */ new Map();
  function Ve({ defaultValue: e2, defaultLanguage: r2, defaultPath: n2, value: t2, language: a2, path: m2, theme: E2 = "light", line: g2, loading: N2 = "Loading...", options: x2 = {}, overrideServices: P2 = {}, saveViewState: y2 = true, keepCurrentModel: V2 = false, width: z2 = "100%", height: F2 = "100%", className: j2, wrapperProps: A2 = {}, beforeMount: q2 = D, onMount: M2 = D, onChange: O2, onValidate: T2 = D }) {
    let [s2, u2] = reactExports.useState(false), [c2, w2] = reactExports.useState(true), d2 = reactExports.useRef(null), o2 = reactExports.useRef(null), b2 = reactExports.useRef(null), L2 = reactExports.useRef(M2), U2 = reactExports.useRef(q2), I2 = reactExports.useRef(), i2 = reactExports.useRef(t2), f2 = se(m2), Q2 = reactExports.useRef(false), B2 = reactExports.useRef(false);
    k(() => {
      let p2 = loader.init();
      return p2.then((R2) => (d2.current = R2) && w2(false)).catch((R2) => (R2 == null ? void 0 : R2.type) !== "cancelation" && console.error("Monaco initialization: error:", R2)), () => o2.current ? pe2() : p2.cancel();
    }), l(() => {
      var _a, _b, _c, _d;
      let p2 = h(d2.current, e2 || t2 || "", r2 || a2 || "", m2 || n2 || "");
      p2 !== ((_a = o2.current) == null ? void 0 : _a.getModel()) && (y2 && _.set(f2, (_b = o2.current) == null ? void 0 : _b.saveViewState()), (_c = o2.current) == null ? void 0 : _c.setModel(p2), y2 && ((_d = o2.current) == null ? void 0 : _d.restoreViewState(_.get(m2))));
    }, [m2], s2), l(() => {
      var _a;
      (_a = o2.current) == null ? void 0 : _a.updateOptions(x2);
    }, [x2], s2), l(() => {
      !o2.current || t2 === void 0 || (o2.current.getOption(d2.current.editor.EditorOption.readOnly) ? o2.current.setValue(t2) : t2 !== o2.current.getValue() && (B2.current = true, o2.current.executeEdits("", [{ range: o2.current.getModel().getFullModelRange(), text: t2, forceMoveMarkers: true }]), o2.current.pushUndoStop(), B2.current = false));
    }, [t2], s2), l(() => {
      var _a, _b;
      let p2 = (_a = o2.current) == null ? void 0 : _a.getModel();
      p2 && a2 && ((_b = d2.current) == null ? void 0 : _b.editor.setModelLanguage(p2, a2));
    }, [a2], s2), l(() => {
      var _a;
      g2 !== void 0 && ((_a = o2.current) == null ? void 0 : _a.revealLine(g2));
    }, [g2], s2), l(() => {
      var _a;
      (_a = d2.current) == null ? void 0 : _a.editor.setTheme(E2);
    }, [E2], s2);
    let X2 = reactExports.useCallback(() => {
      var _a;
      if (!(!b2.current || !d2.current) && !Q2.current) {
        U2.current(d2.current);
        let p2 = m2 || n2, R2 = h(d2.current, t2 || e2 || "", r2 || a2 || "", p2 || "");
        o2.current = (_a = d2.current) == null ? void 0 : _a.editor.create(b2.current, { model: R2, automaticLayout: true, ...x2 }, P2), y2 && o2.current.restoreViewState(_.get(p2)), d2.current.editor.setTheme(E2), g2 !== void 0 && o2.current.revealLine(g2), u2(true), Q2.current = true;
      }
    }, [e2, r2, n2, t2, a2, m2, x2, P2, y2, E2, g2]);
    reactExports.useEffect(() => {
      s2 && L2.current(o2.current, d2.current);
    }, [s2]), reactExports.useEffect(() => {
      !c2 && !s2 && X2();
    }, [c2, s2, X2]), i2.current = t2, reactExports.useEffect(() => {
      var _a, _b;
      s2 && O2 && ((_a = I2.current) == null ? void 0 : _a.dispose(), I2.current = (_b = o2.current) == null ? void 0 : _b.onDidChangeModelContent((p2) => {
        B2.current || O2(o2.current.getValue(), p2);
      }));
    }, [s2, O2]), reactExports.useEffect(() => {
      if (s2) {
        let p2 = d2.current.editor.onDidChangeMarkers((R2) => {
          var _a;
          let G2 = (_a = o2.current.getModel()) == null ? void 0 : _a.uri;
          if (G2 && R2.find((J2) => J2.path === G2.path)) {
            let J2 = d2.current.editor.getModelMarkers({ resource: G2 });
            T2 == null ? void 0 : T2(J2);
          }
        });
        return () => {
          p2 == null ? void 0 : p2.dispose();
        };
      }
      return () => {
      };
    }, [s2, T2]);
    function pe2() {
      var _a, _b;
      (_a = I2.current) == null ? void 0 : _a.dispose(), V2 ? y2 && _.set(m2, o2.current.saveViewState()) : (_b = o2.current.getModel()) == null ? void 0 : _b.dispose(), o2.current.dispose();
    }
    return React.createElement(H, { width: z2, height: F2, isEditorReady: s2, loading: N2, _ref: b2, className: j2, wrapperProps: A2 });
  }
  var fe = Ve;
  var de = reactExports.memo(fe);
  var Ft = de;
  function notifyTextFocus(focused) {
    var _a;
    (_a = window.setTextInputFocus) == null ? void 0 : _a.call(window, focused ? "true" : "false");
  }
  let _pendingSceneJsonResolve = null;
  function requestSceneJsonAsync(sceneId) {
    return new Promise((resolve) => {
      var _a;
      _pendingSceneJsonResolve = resolve;
      (_a = window.requestSceneJson) == null ? void 0 : _a.call(window, sceneId);
    });
  }
  let _pendingAutoDescriptionResolve = null;
  function requestAutoDescriptionAsync(sceneId) {
    return new Promise((resolve) => {
      var _a;
      _pendingAutoDescriptionResolve = resolve;
      (_a = window.requestAutoDescription) == null ? void 0 : _a.call(window, sceneId);
    });
  }
  let _pendingCustomDescriptionResolve = null;
  function requestCustomDescriptionAsync(sceneId) {
    return new Promise((resolve) => {
      var _a;
      _pendingCustomDescriptionResolve = resolve;
      (_a = window.requestCustomDescription) == null ? void 0 : _a.call(window, sceneId);
    });
  }
  let _pendingSceneMetaResolve = null;
  function requestSceneMetaAsync(sceneId) {
    return new Promise((resolve) => {
      var _a;
      _pendingSceneMetaResolve = resolve;
      (_a = window.requestSceneMeta) == null ? void 0 : _a.call(window, sceneId);
    });
  }
  let _pendingSaveSceneMetaResolve = null;
  function saveSceneMetaAsync(sceneId, meta) {
    return new Promise((resolve) => {
      var _a;
      _pendingSaveSceneMetaResolve = resolve;
      (_a = window.saveSceneMeta) == null ? void 0 : _a.call(window, JSON.stringify({ sceneId, ...meta }));
    });
  }
  let _pendingSaveSceneJsonResolve = null;
  function saveSceneJsonAsync(id2, content) {
    return new Promise((resolve) => {
      var _a;
      _pendingSaveSceneJsonResolve = resolve;
      (_a = window.saveSceneJson) == null ? void 0 : _a.call(window, JSON.stringify({ id: id2, content }));
    });
  }
  let _pendingSaveCustomDescriptionResolve = null;
  function saveCustomDescriptionAsync(sceneId, description2) {
    return new Promise((resolve) => {
      var _a;
      _pendingSaveCustomDescriptionResolve = resolve;
      (_a = window.saveCustomDescription) == null ? void 0 : _a.call(window, JSON.stringify({ sceneId, description: description2 }));
    });
  }
  let _pendingGeneratedDescriptionResolve = null;
  function generateDescriptionAsync(sceneId, additionalInstructions) {
    return new Promise((resolve) => {
      var _a;
      _pendingGeneratedDescriptionResolve = resolve;
      (_a = window.generateDescription) == null ? void 0 : _a.call(window, JSON.stringify({ sceneId, additionalInstructions }));
    });
  }
  function setupGameIntegration(store2) {
    window.showNavigator = () => {
      store2.setVisible(true);
    };
    window.hideNavigator = () => {
      store2.setVisible(false);
    };
    window.updateScenes = (data) => {
      const scenes = typeof data === "string" ? JSON.parse(data) : data;
      store2.setScenes(scenes);
    };
    window.updateSceneSuggestions = (data) => {
      const suggestions = typeof data === "string" ? JSON.parse(data) : data;
      store2.setSceneSuggestions(suggestions);
    };
    window.updateOStimNetSuggestions = (data) => {
      const suggestions = typeof data === "string" ? JSON.parse(data) : data;
      store2.setOStimNetSuggestions(suggestions);
    };
    window.receiveSceneJson = (json) => {
      _pendingSceneJsonResolve == null ? void 0 : _pendingSceneJsonResolve(json);
      _pendingSceneJsonResolve = null;
    };
    window.receiveAutoDescription = (description2) => {
      _pendingAutoDescriptionResolve == null ? void 0 : _pendingAutoDescriptionResolve(description2);
      _pendingAutoDescriptionResolve = null;
    };
    window.receiveCustomDescription = (description2) => {
      _pendingCustomDescriptionResolve == null ? void 0 : _pendingCustomDescriptionResolve(description2);
      _pendingCustomDescriptionResolve = null;
    };
    window.receiveCustomDescriptionSaved = (success) => {
      _pendingSaveCustomDescriptionResolve == null ? void 0 : _pendingSaveCustomDescriptionResolve(success);
      _pendingSaveCustomDescriptionResolve = null;
    };
    window.receiveGeneratedDescriptionResult = (result) => {
      if (_pendingGeneratedDescriptionResolve) {
        _pendingGeneratedDescriptionResolve(
          result.ok ? { ok: true, text: result.text ?? "" } : { ok: false, error: result.error ?? "Unknown error." }
        );
        _pendingGeneratedDescriptionResolve = null;
      }
    };
    window.receiveSceneMeta = (data) => {
      const meta = typeof data === "string" ? JSON.parse(data) : data;
      _pendingSceneMetaResolve == null ? void 0 : _pendingSceneMetaResolve(meta);
      _pendingSceneMetaResolve = null;
    };
    window.receiveSceneMetaSaved = (success) => {
      _pendingSaveSceneMetaResolve == null ? void 0 : _pendingSaveSceneMetaResolve(success);
      _pendingSaveSceneMetaResolve = null;
    };
    window.receiveSaveSceneJson = (success) => {
      _pendingSaveSceneJsonResolve == null ? void 0 : _pendingSaveSceneJsonResolve(success);
      _pendingSaveSceneJsonResolve = null;
    };
    window.updatePlayerThreadRunning = (running) => {
      store2.setPlayerThreadRunning(running);
    };
    window.updateCurrentScene = (sceneId) => {
      store2.setCurrentSceneId(sceneId);
    };
    window.updateCurrentThread = (data) => {
      try {
        const threadData = typeof data === "string" ? JSON.parse(data) : data;
        store2.setCurrentThread(threadData);
      } catch (e2) {
        store2.setCurrentThread(null);
      }
    };
    document.addEventListener("mousedown", () => {
      var _a;
      if (!document.hasFocus()) {
        (_a = window.refocusView) == null ? void 0 : _a.call(window);
      }
    });
  }
  function closeNavigatorView() {
    var _a;
    (_a = window.closeNavigator) == null ? void 0 : _a.call(window);
  }
  const $schema = "http://json-schema.org/draft-07/schema#";
  const anyOf = [
    {
      $ref: "#/definitions/OstimSceneTransition"
    },
    {
      $ref: "#/definitions/OstimSceneWithNavigation"
    }
  ];
  const definitions = {
    OstimScene3DOffset: {
      additionalProperties: false,
      properties: {
        r: {
          description: "the rotational offset",
          type: "number"
        },
        x: {
          description: "the x offset",
          type: "number"
        },
        y: {
          description: "the y offset",
          type: "number"
        },
        z: {
          description: "the z offset",
          type: "number"
        }
      },
      type: "object"
    },
    OstimSceneNavigation: {
      anyOf: [
        {
          $ref: "#/definitions/OstimSceneNavigationDestination"
        },
        {
          $ref: "#/definitions/OstimSceneNavigationOrigin"
        }
      ]
    },
    OstimSceneNavigationDestination: {
      additionalProperties: false,
      properties: {
        border: {
          "default": "ffffff",
          description: "the hexadecimal RBG code of the icon border",
          type: "string"
        },
        description: {
          description: "the display text of the navigation in game",
          type: "string"
        },
        destination: {
          description: 'the destination of the navigation\nif you use this a navigation option is added to this scene that leads to the destination scene\nthis is the preferred way, you should always use this over "origin" when navigating within an animation pack',
          type: "string"
        },
        icon: {
          description: 'the path to the .dds file to be used as the icon\nthis path will be appended to "../Data/Interface/OStim/icons", the file ending ".dds" will be added automatically',
          type: "string"
        },
        noWarnings: {
          "default": false,
          description: "disables warnings about origin or destination not existing\nthis can be used to prevent spamming the log when connecting to other animation packs that a user might not have installed\ndoesn't prevent warnings about mismatching furniture types or actor counts",
          type: "boolean"
        },
        priority: {
          "default": 0,
          description: "a priority for the order of the navigation options in the menu\nthe navigations are sorted ascending, so lower priorities will show first\nconventional priorities in idles are:\n    0 other idles\n    1000 romantic scenes\n    2000 undressing scenes\n    3000 sexual scenes\nconventional priorities in other scenes are:\n    -1000 return to idle\n        0 detail changes (e.g. put hands on hips)\n    1000 positional changes (e.g. kneel down during HJ)\n    2000 action changes (e.g. go from HJ to BJ)\n    3000 climax\nit is recommended to stick to the convention so that navigation options always have a logical order\nnumbers can be slightly adjusted for fine tuning (e.g. 1999 instead of 2000 if you want it to be the first in its class)",
          type: "number"
        }
      },
      required: [
        "destination"
      ],
      type: "object"
    },
    OstimSceneNavigationOrigin: {
      additionalProperties: false,
      properties: {
        border: {
          "default": "ffffff",
          description: "the hexadecimal RBG code of the icon border",
          type: "string"
        },
        description: {
          description: "the display text of the navigation in game",
          type: "string"
        },
        icon: {
          description: 'the path to the .dds file to be used as the icon\nthis path will be appended to "../Data/Interface/OStim/icons", the file ending ".dds" will be added automatically',
          type: "string"
        },
        noWarnings: {
          "default": false,
          description: "disables warnings about origin or destination not existing\nthis can be used to prevent spamming the log when connecting to other animation packs that a user might not have installed\ndoesn't prevent warnings about mismatching furniture types or actor counts",
          type: "boolean"
        },
        origin: {
          description: 'the origin of the navigation option\nif you use this a navigation option is added to the origin scene that leads to this scene\nthis can be used to create navigations from scenes of other animation packs to your scene without overwriting them\nyou should never use "origin" and "destination" at the same time',
          type: "string"
        },
        priority: {
          "default": 0,
          description: "a priority for the order of the navigation options in the menu\nthe navigations are sorted ascending, so lower priorities will show first\nconventional priorities in idles are:\n    0 other idles\n    1000 romantic scenes\n    2000 undressing scenes\n    3000 sexual scenes\nconventional priorities in other scenes are:\n    -1000 return to idle\n        0 detail changes (e.g. put hands on hips)\n    1000 positional changes (e.g. kneel down during HJ)\n    2000 action changes (e.g. go from HJ to BJ)\n    3000 climax\nit is recommended to stick to the convention so that navigation options always have a logical order\nnumbers can be slightly adjusted for fine tuning (e.g. 1999 instead of 2000 if you want it to be the first in its class)",
          type: "number"
        }
      },
      required: [
        "origin"
      ],
      type: "object"
    },
    OstimSceneTransition: {
      additionalProperties: false,
      properties: {
        actions: {
          description: "a list of actions",
          items: {
            additionalProperties: false,
            properties: {
              actor: {
                description: "the index of the action actor",
                type: "number"
              },
              doPeaks: {
                "default": true,
                description: "when true this action will handle peak events\npeak events are used for impact sounds for example",
                type: "boolean"
              },
              muted: {
                "default": false,
                description: "when true this action doesn't play sounds",
                type: "boolean"
              },
              peaksAnnotated: {
                "default": false,
                description: "when true peaks will be triggered by annotations on the .hkx file\nwhen true the actions peak definition will be completely ignored\ndoes nothing if doPeaks is set to false",
                type: "boolean"
              },
              performer: {
                description: "the index of the action performer\ndefaults to action's actor",
                type: "number"
              },
              target: {
                description: "the index of the action target\ndefaults to action's actor",
                type: "number"
              },
              type: {
                description: "the type of the action (see actions README https://github.com/VersuchDrei/OStimNG/blob/main/data/SKSE/Plugins/OStim/actions%20README.txt)",
                type: "string"
              }
            },
            required: [
              "actor",
              "type"
            ],
            type: "object"
          },
          type: "array"
        },
        actors: {
          description: "a list of actors",
          items: {
            additionalProperties: false,
            properties: {
              animationIndex: {
                description: "the index of the animation to play (see speed fields: animation)\nthis can be used to invert the roles of a scene without having to register the animations twice\ndefaults to the actors index",
                type: "number"
              },
              autoTransitions: {
                $ref: "#/definitions/Record<string,string>",
                description: "a map of auto transition ids and destination sceneIDs for this actor"
              },
              expressionAction: {
                description: "the index of the action that takes priority for the actors facial expression (see actions README https://github.com/VersuchDrei/OStimNG/blob/main/data/SKSE/Plugins/OStim/actions%20README.txt)",
                type: "number"
              },
              expressionOverride: {
                description: "an expression set to override the actors expression in this scene (see facial expressions README https://github.com/VersuchDrei/OStimNG/blob/main/data/SKSE/Plugins/OStim/facial%20expressions%20README.txt)",
                type: "string"
              },
              feetOnGround: {
                description: 'if true heel scaling is in effect, if false the heel offset will be removed\nthis value defaults to true if the actor has the "standing" or "squatting" tag and false otherwise',
                type: "boolean"
              },
              intendedSex: {
                "default": "any",
                description: 'the intended sex of this actor\npossible values are "male" and "female"\nthis can be used to limit navigation to this scene by sex without any action in it requiring it\nfor example because one of the actors makes a feminine pose that would look weird on a male',
                "enum": [
                  "any",
                  "female",
                  "male"
                ],
                type: "string"
              },
              lookDown: {
                "default": 0,
                description: "alternative to lookUp with inverted values\nif lookUp is defined this field is ignored",
                type: "number"
              },
              lookLeft: {
                "default": 0,
                description: "the mfg value for the eyes to look left\npossible values range from -100 to 100, with negative ones causing a look right",
                type: "number"
              },
              lookRight: {
                "default": 0,
                description: "alternative to lookLeft with inverted values\nif lookLeft is defined this field is ignored",
                type: "number"
              },
              lookUp: {
                "default": 0,
                description: "the mfg value for the eyes to look up\npossible values range from -100 to 100, with negative ones causing a look down",
                type: "number"
              },
              noStrip: {
                "default": false,
                description: "if true the actor does not get undressed, no matter the actions involved",
                type: "boolean"
              },
              offset: {
                $ref: "#/definitions/OstimScene3DOffset",
                description: "an offset for the actor\nuse with caution, unlike animations this does not have a smooth transition\nthis means a change in offset will cause the actor to teleport away and then quickly slide pack into position\ntherefore a heavy use of offsets is not recommended"
              },
              requirements: {
                description: "a list of requirements for this actor, if they are not met this scene will not show up in navigation (see actor properties README https://github.com/VersuchDrei/OStimNG/blob/main/data/SKSE/Plugins/OStim/actor%20properties%20README.txt)",
                items: {
                  type: "string"
                },
                type: "array"
              },
              scale: {
                "default": 1,
                description: "the scale of the actor",
                type: "number"
              },
              scaleHeight: {
                "default": 120.748,
                description: "the height against which the heel offset should be scaled\nthis can be used to keep the most important part (for example the schlong in a penetrative scene) always at the same height, no matter the heel offset\nthe default value is the total height of the vanilla skeleton",
                type: "number"
              },
              sosBend: {
                "default": 0,
                description: "the SoSBend value for the actor\nsos angles range from -9 to 9, additionally -10 will cause a flaccid schlong\nthese cause the SoSBendX animation event to be send to the actor, with X being the sosBend value",
                "enum": [
                  -1,
                  -10,
                  -2,
                  -3,
                  -4,
                  -5,
                  -6,
                  -7,
                  -8,
                  -9,
                  0,
                  1,
                  2,
                  3,
                  4,
                  5,
                  6,
                  7,
                  8,
                  9
                ],
                type: "number"
              },
              tags: {
                description: "a list of tags for this actor (see list of commonly used actor tags https://github.com/VersuchDrei/OStimNG/blob/main/data/SKSE/Plugins/OStim/list%20of%20commonly%20used%20actor%20tags.txt)",
                items: {
                  type: "string"
                },
                type: "array"
              },
              type: {
                "default": "npc",
                description: "the type of the actor (see actor types README https://github.com/VersuchDrei/OStimNG/blob/main/data/SKSE/Plugins/OStim/actor%20types%20README.txt )",
                type: "string"
              },
              underlyingExpression: {
                description: "an expression set to be used as the underlying expression, if left out the underlying expression will be determined based on the actions instead (see facial expressions README https://github.com/VersuchDrei/OStimNG/blob/main/data/SKSE/Plugins/OStim/facial%20expressions%20README.txt)",
                type: "string"
              }
            },
            type: "object"
          },
          type: "array"
        },
        autoTransitions: {
          $ref: "#/definitions/Record<string,string>",
          description: "a map of auto transition ids and destination sceneIDs for this scene"
        },
        border: {
          "default": "ffffff",
          description: "the hexadecimal RBG code of the icon border",
          type: "string"
        },
        defaultSpeed: {
          "default": 0,
          description: "the index of the default speed of the scene",
          type: "number"
        },
        description: {
          description: "the display text of the navigation in game",
          type: "string"
        },
        destination: {
          description: '(only for transition) the sceneID of the transition destination\nadding this property turns this node into a transition, that means it will be played once and then automatically moves to the destination scene\nif this property is filled the "navigations" property will be ignored',
          type: "string"
        },
        furniture: {
          description: "the furniture type of this scene",
          type: "string"
        },
        icon: {
          description: 'the path to the .dds file to be used as the icon\nthis path will be appended to "../Data/Interface/OStim/icons", the file ending ".dds" will be added automatically',
          type: "string"
        },
        length: {
          description: "the duration of the animation in seconds",
          type: "number"
        },
        modpack: {
          description: "the display name of the modpack in game",
          type: "string"
        },
        modPack: {
          description: "alias for modpack (camelCase variant)",
          type: "string"
        },
        name: {
          description: "the display name of the scene in game",
          type: "string"
        },
        noRandomSelection: {
          "default": false,
          description: "if true this scene will never be chosen by random selections",
          type: "boolean"
        },
        noWarnings: {
          "default": false,
          description: "disables warnings about origin or destination not existing\nthis can be used to prevent spamming the log when connecting to other animation packs that a user might not have installed\ndoesn't prevent warnings about mismatching furniture types or actor counts",
          type: "boolean"
        },
        scaleOffsetWithFurniture: {
          "default": false,
          description: "if true the scene offset will be scaled with the furniture scale",
          type: "boolean"
        },
        offset: {
          $ref: "#/definitions/OstimScene3DOffset",
          description: "an offset for the animation\nuse with caution, unlike animations this does not have a smooth transition\nthis means a change in offset will cause the actors to teleport away and then quickly slide pack into position\ntherefore a heavy use of offsets is not recommended"
        },
        origin: {
          description: `(only for transition) the sceneID of the transition origin
if the transition is already in the navigations of the origin scene this field doesn't have to (and shouldn't) be filled
if this field is filled you can also add the "priority", "description", "icon", "border" and "noWarnings" fields directly to the scene and use them like you would for a regular navigation`,
          type: "string"
        },
        priority: {
          "default": 0,
          description: "a priority for the order of the navigation options in the menu\nthe navigations are sorted ascending, so lower priorities will show first\nconventional priorities in idles are:\n    0 other idles\n    1000 romantic scenes\n    2000 undressing scenes\n    3000 sexual scenes\nconventional priorities in other scenes are:\n    -1000 return to idle\n        0 detail changes (e.g. put hands on hips)\n    1000 positional changes (e.g. kneel down during HJ)\n    2000 action changes (e.g. go from HJ to BJ)\n    3000 climax\nit is recommended to stick to the convention so that navigation options always have a logical order\nnumbers can be slightly adjusted for fine tuning (e.g. 1999 instead of 2000 if you want it to be the first in its class)",
          type: "number"
        },
        speeds: {
          description: "a list of available speeds for the scene",
          items: {
            additionalProperties: false,
            properties: {
              animation: {
                description: "the animation event name of the animation to play for this speed\nthis animation will be send as animation event to the actors with _X appended, X being the actors index",
                type: "string"
              },
              displaySpeed: {
                description: "the speed value to display in game",
                type: "number"
              },
              playbackSpeed: {
                "default": 1,
                description: "the speed at which to play the animation\nin order for this to work the animation has to be registered with a Nemesis patch that links it to the OStimSpeed graph variable",
                type: "number"
              }
            },
            required: [
              "animation"
            ],
            type: "object"
          },
          type: "array"
        },
        tags: {
          description: "a list of tags for this scene",
          items: {
            type: "string"
          },
          type: "array"
        }
      },
      anyOf: [
        {
          required: [
            "destination",
            "length",
            "modpack",
            "name",
            "speeds"
          ]
        },
        {
          required: [
            "destination",
            "length",
            "modPack",
            "name",
            "speeds"
          ]
        }
      ],
      type: "object"
    },
    OstimSceneWithNavigation: {
      additionalProperties: false,
      properties: {
        actions: {
          description: "a list of actions",
          items: {
            additionalProperties: false,
            properties: {
              actor: {
                description: "the index of the action actor",
                type: "number"
              },
              doPeaks: {
                "default": true,
                description: "when true this action will handle peak events\npeak events are used for impact sounds for example",
                type: "boolean"
              },
              muted: {
                "default": false,
                description: "when true this action doesn't play sounds",
                type: "boolean"
              },
              peaksAnnotated: {
                "default": false,
                description: "when true peaks will be triggered by annotations on the .hkx file\nwhen true the actions peak definition will be completely ignored\ndoes nothing if doPeaks is set to false",
                type: "boolean"
              },
              performer: {
                description: "the index of the action performer\ndefaults to action's actor",
                type: "number"
              },
              target: {
                description: "the index of the action target\ndefaults to action's actor",
                type: "number"
              },
              type: {
                description: "the type of the action (see actions README https://github.com/VersuchDrei/OStimNG/blob/main/data/SKSE/Plugins/OStim/actions%20README.txt)",
                type: "string"
              }
            },
            required: [
              "actor",
              "type"
            ],
            type: "object"
          },
          type: "array"
        },
        actors: {
          description: "a list of actors",
          items: {
            additionalProperties: false,
            properties: {
              animationIndex: {
                description: "the index of the animation to play (see speed fields: animation)\nthis can be used to invert the roles of a scene without having to register the animations twice\ndefaults to the actors index",
                type: "number"
              },
              autoTransitions: {
                $ref: "#/definitions/Record<string,string>",
                description: "a map of auto transition ids and destination sceneIDs for this actor"
              },
              expressionAction: {
                description: "the index of the action that takes priority for the actors facial expression (see actions README https://github.com/VersuchDrei/OStimNG/blob/main/data/SKSE/Plugins/OStim/actions%20README.txt)",
                type: "number"
              },
              expressionOverride: {
                description: "an expression set to override the actors expression in this scene (see facial expressions README https://github.com/VersuchDrei/OStimNG/blob/main/data/SKSE/Plugins/OStim/facial%20expressions%20README.txt)",
                type: "string"
              },
              feetOnGround: {
                description: 'if true heel scaling is in effect, if false the heel offset will be removed\nthis value defaults to true if the actor has the "standing" or "squatting" tag and false otherwise',
                type: "boolean"
              },
              intendedSex: {
                "default": "any",
                description: 'the intended sex of this actor\npossible values are "male" and "female"\nthis can be used to limit navigation to this scene by sex without any action in it requiring it\nfor example because one of the actors makes a feminine pose that would look weird on a male',
                "enum": [
                  "any",
                  "female",
                  "male"
                ],
                type: "string"
              },
              lookDown: {
                "default": 0,
                description: "alternative to lookUp with inverted values\nif lookUp is defined this field is ignored",
                type: "number"
              },
              lookLeft: {
                "default": 0,
                description: "the mfg value for the eyes to look left\npossible values range from -100 to 100, with negative ones causing a look right",
                type: "number"
              },
              lookRight: {
                "default": 0,
                description: "alternative to lookLeft with inverted values\nif lookLeft is defined this field is ignored",
                type: "number"
              },
              lookUp: {
                "default": 0,
                description: "the mfg value for the eyes to look up\npossible values range from -100 to 100, with negative ones causing a look down",
                type: "number"
              },
              noStrip: {
                "default": false,
                description: "if true the actor does not get undressed, no matter the actions involved",
                type: "boolean"
              },
              offset: {
                $ref: "#/definitions/OstimScene3DOffset",
                description: "an offset for the actor\nuse with caution, unlike animations this does not have a smooth transition\nthis means a change in offset will cause the actor to teleport away and then quickly slide pack into position\ntherefore a heavy use of offsets is not recommended"
              },
              requirements: {
                description: "a list of requirements for this actor, if they are not met this scene will not show up in navigation (see actor properties README https://github.com/VersuchDrei/OStimNG/blob/main/data/SKSE/Plugins/OStim/actor%20properties%20README.txt)",
                items: {
                  type: "string"
                },
                type: "array"
              },
              scale: {
                "default": 1,
                description: "the scale of the actor",
                type: "number"
              },
              scaleHeight: {
                "default": 120.748,
                description: "the height against which the heel offset should be scaled\nthis can be used to keep the most important part (for example the schlong in a penetrative scene) always at the same height, no matter the heel offset\nthe default value is the total height of the vanilla skeleton",
                type: "number"
              },
              sosBend: {
                "default": 0,
                description: "the SoSBend value for the actor\nsos angles range from -9 to 9, additionally -10 will cause a flaccid schlong\nthese cause the SoSBendX animation event to be send to the actor, with X being the sosBend value",
                "enum": [
                  -1,
                  -10,
                  -2,
                  -3,
                  -4,
                  -5,
                  -6,
                  -7,
                  -8,
                  -9,
                  0,
                  1,
                  2,
                  3,
                  4,
                  5,
                  6,
                  7,
                  8,
                  9
                ],
                type: "number"
              },
              tags: {
                description: "a list of tags for this actor (see list of commonly used actor tags https://github.com/VersuchDrei/OStimNG/blob/main/data/SKSE/Plugins/OStim/list%20of%20commonly%20used%20actor%20tags.txt)",
                items: {
                  type: "string"
                },
                type: "array"
              },
              type: {
                "default": "npc",
                description: "the type of the actor (see actor types README https://github.com/VersuchDrei/OStimNG/blob/main/data/SKSE/Plugins/OStim/actor%20types%20README.txt )",
                type: "string"
              },
              underlyingExpression: {
                description: "an expression set to be used as the underlying expression, if left out the underlying expression will be determined based on the actions instead (see facial expressions README https://github.com/VersuchDrei/OStimNG/blob/main/data/SKSE/Plugins/OStim/facial%20expressions%20README.txt)",
                type: "string"
              }
            },
            type: "object"
          },
          type: "array"
        },
        autoTransitions: {
          $ref: "#/definitions/Record<string,string>",
          description: "a map of auto transition ids and destination sceneIDs for this scene"
        },
        defaultSpeed: {
          "default": 0,
          description: "the index of the default speed of the scene",
          type: "number"
        },
        furniture: {
          description: "the furniture type of this scene",
          type: "string"
        },
        length: {
          description: "the duration of the animation in seconds",
          type: "number"
        },
        modpack: {
          description: "the display name of the modpack in game",
          type: "string"
        },
        modPack: {
          description: "alias for modpack (camelCase variant)",
          type: "string"
        },
        name: {
          description: "the display name of the scene in game",
          type: "string"
        },
        navigations: {
          description: "a list of navigation options from or to this scene",
          items: {
            $ref: "#/definitions/OstimSceneNavigation"
          },
          type: "array"
        },
        noRandomSelection: {
          "default": false,
          description: "if true this scene will never be chosen by random selections",
          type: "boolean"
        },
        scaleOffsetWithFurniture: {
          "default": false,
          description: "if true the scene offset will be scaled with the furniture scale",
          type: "boolean"
        },
        offset: {
          $ref: "#/definitions/OstimScene3DOffset",
          description: "an offset for the animation\nuse with caution, unlike animations this does not have a smooth transition\nthis means a change in offset will cause the actors to teleport away and then quickly slide pack into position\ntherefore a heavy use of offsets is not recommended"
        },
        speeds: {
          description: "a list of available speeds for the scene",
          items: {
            additionalProperties: false,
            properties: {
              animation: {
                description: "the animation event name of the animation to play for this speed\nthis animation will be send as animation event to the actors with _X appended, X being the actors index",
                type: "string"
              },
              displaySpeed: {
                description: "the speed value to display in game",
                type: "number"
              },
              playbackSpeed: {
                "default": 1,
                description: "the speed at which to play the animation\nin order for this to work the animation has to be registered with a Nemesis patch that links it to the OStimSpeed graph variable",
                type: "number"
              }
            },
            required: [
              "animation"
            ],
            type: "object"
          },
          type: "array"
        },
        tags: {
          description: "a list of tags for this scene",
          items: {
            type: "string"
          },
          type: "array"
        }
      },
      anyOf: [
        {
          required: [
            "length",
            "modpack",
            "name",
            "navigations",
            "speeds"
          ]
        },
        {
          required: [
            "length",
            "modPack",
            "name",
            "navigations",
            "speeds"
          ]
        }
      ],
      type: "object"
    },
    "Record<string,string>": {
      additionalProperties: true,
      type: "object"
    }
  };
  const description = "A scene defines what animations are played and what navigation options the player has from there.\nThey're also full of metadata and other information.\nThe sceneID which is referred to in other parts of the documentation is the scenes filename without the .json extension.\nThe scene parser also parses subfolders, but folder names are not part of the sceneID, only the filename.\nIf two files have the same filename one of them will overwrite the other, the order of which is overwriting which is not predictable.\nSo it is recommended to start all your scene names with your personal signature to avoid incompatibilities.";
  const ostimSceneSchema = {
    $schema,
    anyOf,
    definitions,
    description
  };
  const OSTIM_SCHEMA_URI = "https://ostim/scene-schema.json";
  const OSTIM_MODEL_PATH = "ostim-scene.json";
  function buildSchemaWithSuggestions(sugg) {
    const schema = JSON.parse(JSON.stringify(ostimSceneSchema));
    const suggestItems = (vals) => ({ anyOf: [{ enum: vals }, { type: "string" }] });
    for (const defName of ["OstimSceneTransition", "OstimSceneWithNavigation"]) {
      const def = schema.definitions[defName];
      const actionTypeProp = def.properties.actions.items.properties.type;
      def.properties.actions.items.properties.type = {
        description: actionTypeProp.description,
        ...suggestItems(sugg.actionTypes)
      };
      def.properties.actors.items.properties.tags.items = suggestItems(sugg.actorTags);
      def.properties.tags.items = suggestItems(sugg.sceneTags);
    }
    return schema;
  }
  function applyOStimSchema(monaco, sugg) {
    const schema = buildSchemaWithSuggestions(sugg);
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      enableSchemaRequest: false,
      schemaValidation: "error",
      schemas: [{
        uri: OSTIM_SCHEMA_URI,
        fileMatch: [OSTIM_MODEL_PATH],
        schema
      }]
    });
  }
  async function loadOStimSceneJson(sceneId) {
    return requestSceneJsonAsync(sceneId);
  }
  function OStimJson({ sceneId }) {
    const suggestions = useNavigatorStore((state) => state.sceneSuggestions);
    const [copied, setCopied] = reactExports.useState(false);
    const [saveStatus, setSaveStatus] = reactExports.useState(null);
    const editorRef = reactExports.useRef(null);
    const loadedValueRef = reactExports.useRef(null);
    const lineEndingRef = reactExports.useRef("\n");
    const lensDisposableRef = reactExports.useRef(null);
    const cmdDisposableRef = reactExports.useRef(null);
    const handleSaveRef = reactExports.useRef(() => {
    });
    reactExports.useEffect(() => () => {
      var _a, _b;
      (_a = lensDisposableRef.current) == null ? void 0 : _a.dispose();
      (_b = cmdDisposableRef.current) == null ? void 0 : _b.dispose();
    }, []);
    reactExports.useEffect(() => {
      loader.init().then((monaco) => applyOStimSchema(monaco, suggestions));
    }, [suggestions]);
    reactExports.useEffect(() => {
      async function loadPreset() {
        var _a;
        const value = await loadOStimSceneJson(sceneId);
        lineEndingRef.current = value.includes("\r\n") ? "\r\n" : "\n";
        loadedValueRef.current = value;
        (_a = editorRef.current) == null ? void 0 : _a.setValue(value);
      }
      loadPreset();
    }, [sceneId]);
    const handleBeforeMount = (monaco) => {
      applyOStimSchema(monaco, suggestions);
      cmdDisposableRef.current = monaco.editor.registerCommand(
        "ostim-navigator.addAction",
        () => {
          const ed2 = editorRef.current;
          if (!ed2) return;
          const value = ed2.getValue();
          try {
            const obj = JSON.parse(value);
            if (!Array.isArray(obj.actions)) obj.actions = [];
            obj.actions.push({ actor: 0, type: "" });
            const scrollTop = ed2.getScrollTop();
            ed2.setValue(JSON.stringify(obj, null, 2));
            ed2.setScrollTop(scrollTop);
          } catch {
          }
        }
      );
    };
    const handleEditorMount = (ed2, monaco) => {
      editorRef.current = ed2;
      ed2.onDidFocusEditorText(() => notifyTextFocus(true));
      ed2.onDidBlurEditorText(() => notifyTextFocus(false));
      ed2.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        handleSaveRef.current();
      });
      lensDisposableRef.current = monaco.languages.registerCodeLensProvider("json", {
        provideCodeLenses(model) {
          if (!model.uri.path.endsWith(OSTIM_MODEL_PATH)) {
            return { lenses: [], dispose: () => {
            } };
          }
          const lines = model.getLinesContent();
          for (let i2 = 0; i2 < lines.length; i2++) {
            if (/"actions"\s*:/.test(lines[i2])) {
              return {
                lenses: [{
                  range: new monaco.Range(i2 + 1, 1, i2 + 1, 1),
                  id: "add-action",
                  command: {
                    id: "ostim-navigator.addAction",
                    title: "+ Add action"
                  }
                }],
                dispose: () => {
                }
              };
            }
          }
          return { lenses: [], dispose: () => {
          } };
        },
        resolveCodeLens(_model, codeLens) {
          return codeLens;
        }
      });
      if (loadedValueRef.current !== null) {
        ed2.setValue(loadedValueRef.current);
      }
    };
    async function handleSave() {
      var _a, _b;
      const raw = ((_a = editorRef.current) == null ? void 0 : _a.getValue()) ?? loadedValueRef.current ?? "";
      let value = raw;
      try {
        const eol = lineEndingRef.current;
        value = JSON.stringify(JSON.parse(raw), null, 4).replace(/\r\n/g, "\n").replace(/\n/g, eol);
        (_b = editorRef.current) == null ? void 0 : _b.setValue(value);
      } catch {
      }
      const ok2 = await saveSceneJsonAsync(sceneId, value);
      setSaveStatus(ok2 ? "saved" : "failed");
      setTimeout(() => setSaveStatus(null), 1800);
    }
    handleSaveRef.current = handleSave;
    function handleCopy() {
      var _a;
      const value = ((_a = editorRef.current) == null ? void 0 : _a.getValue()) ?? loadedValueRef.current ?? "";
      navigator.clipboard.writeText(value).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ostim-json", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ostim-json-toolbar", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "preset-btn preset-btn--save", onClick: handleSave, children: saveStatus === "saved" ? "✓ Saved" : saveStatus === "failed" ? "✗ Failed" : "Save" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "preset-btn preset-btn--copy", onClick: handleCopy, children: copied ? "✓ Copied" : "Copy" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ostim-json-editor", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Ft,
        {
          defaultLanguage: "json",
          path: OSTIM_MODEL_PATH,
          theme: "vs-dark",
          beforeMount: handleBeforeMount,
          onMount: handleEditorMount,
          options: {
            minimap: { enabled: false },
            fontSize: 16,
            lineHeight: 22,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            wordWrap: "on",
            tabSize: 2,
            autoIndent: "none",
            automaticLayout: true,
            fixedOverflowWidgets: true,
            padding: { top: 12, bottom: 12 }
          }
        }
      ) })
    ] });
  }
  function DescriptionModal({ sceneId }) {
    const setSceneHasCustomDescription = useNavigatorStore((state) => state.setSceneHasCustomDescription);
    const autoEditorRef = reactExports.useRef(null);
    const customEditorRef = reactExports.useRef(null);
    const [autoDescription, setAutoDescription] = reactExports.useState("");
    const [customOverride, setCustomOverride] = reactExports.useState("");
    reactExports.useEffect(() => {
      setAutoDescription("");
      async function loadAutoDescription() {
        const description2 = await requestAutoDescriptionAsync(sceneId);
        setAutoDescription(description2);
      }
      loadAutoDescription();
    }, [sceneId]);
    reactExports.useEffect(() => {
      setCustomOverride("");
      async function loadCustomDescription() {
        const description2 = await requestCustomDescriptionAsync(sceneId);
        if (description2) {
          setCustomOverride(description2);
        }
      }
      loadCustomDescription();
    }, [sceneId]);
    const [generating, setGenerating] = reactExports.useState(false);
    const [generateError, setGenerateError] = reactExports.useState(null);
    const [showGenerateModal, setShowGenerateModal] = reactExports.useState(false);
    const [additionalInstructions, setAdditionalInstructions] = reactExports.useState("");
    const [saving, setSaving] = reactExports.useState(false);
    const [saveStatus, setSaveStatus] = reactExports.useState(null);
    const [copiedAuto, setCopiedAuto] = reactExports.useState(false);
    const [copiedCustom, setCopiedCustom] = reactExports.useState(false);
    function handleGenerate() {
      setGenerateError(null);
      setShowGenerateModal(true);
    }
    async function sendGenerate() {
      var _a;
      setShowGenerateModal(false);
      setGenerating(true);
      setGenerateError(null);
      const result = await generateDescriptionAsync(sceneId, additionalInstructions);
      setGenerating(false);
      if (result.ok) {
        setCustomOverride(result.text);
        (_a = customEditorRef.current) == null ? void 0 : _a.setValue(result.text);
      } else {
        setGenerateError(result.error);
      }
    }
    async function handleSave() {
      setSaving(true);
      setSaveStatus(null);
      const ok2 = await saveCustomDescriptionAsync(sceneId, customOverride);
      setSaving(false);
      setSaveStatus(ok2 ? "saved" : "failed");
      if (ok2) setSceneHasCustomDescription(sceneId, customOverride.trim() !== "");
      setTimeout(() => setSaveStatus(null), 3e3);
    }
    function handleCopyAuto() {
      var _a;
      const value = ((_a = autoEditorRef.current) == null ? void 0 : _a.getValue()) ?? autoDescription;
      navigator.clipboard.writeText(value).then(() => {
        setCopiedAuto(true);
        setTimeout(() => setCopiedAuto(false), 1800);
      });
    }
    reactExports.useEffect(() => {
      const ed2 = autoEditorRef.current;
      if (ed2 && ed2.getValue() !== autoDescription) ed2.setValue(autoDescription);
    }, [autoDescription]);
    reactExports.useEffect(() => {
      const ed2 = customEditorRef.current;
      if (ed2 && ed2.getValue() !== customOverride) ed2.setValue(customOverride);
    }, [customOverride]);
    function handleCopyCustom() {
      var _a;
      const value = ((_a = customEditorRef.current) == null ? void 0 : _a.getValue()) ?? customOverride;
      navigator.clipboard.writeText(value).then(() => {
        setCopiedCustom(true);
        setTimeout(() => setCopiedCustom(false), 1800);
      });
    }
    const handleAutoMount = (ed2) => {
      var _a;
      autoEditorRef.current = ed2;
      (_a = autoEditorRef.current) == null ? void 0 : _a.setValue(autoDescription);
      ed2.onDidFocusEditorText(() => notifyTextFocus(true));
      ed2.onDidBlurEditorText(() => notifyTextFocus(false));
    };
    const handleCustomMount = (ed2) => {
      var _a;
      customEditorRef.current = ed2;
      (_a = customEditorRef.current) == null ? void 0 : _a.setValue(customOverride);
      ed2.onDidFocusEditorText(() => notifyTextFocus(true));
      ed2.onDidBlurEditorText(() => notifyTextFocus(false));
      ed2.onDidChangeModelContent(() => {
        setCustomOverride(ed2.getValue());
      });
    };
    const editorOptions = {
      minimap: { enabled: false },
      fontSize: 16,
      lineHeight: 22,
      lineNumbers: "on",
      scrollBeyondLastLine: false,
      wordWrap: "on",
      automaticLayout: true,
      padding: { top: 8, bottom: 8 },
      renderLineHighlight: "none",
      glyphMargin: false
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "desc-editor", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "desc-editor-pane", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "desc-pane-label", children: [
          "Auto Description",
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "desc-generate-btn", onClick: handleCopyAuto, children: copiedAuto ? "✓ Copied" : "Copy" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "desc-pane-editor", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Ft,
          {
            value: autoDescription,
            theme: "vs-dark",
            onMount: handleAutoMount,
            options: { ...editorOptions, readOnly: true }
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "desc-editor-divider" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "desc-editor-pane", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "desc-pane-label", children: [
          "Custom Override",
          (() => {
            const scene = useNavigatorStore.getState().scenes.find((s2) => s2.id.toLowerCase() === sceneId.toLowerCase());
            if (scene == null ? void 0 : scene.descriptionInherited) {
              return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#4caf50", marginLeft: "8px", fontSize: "14px", fontWeight: "normal" }, children: "(Inherited from OStim)" });
            }
            return null;
          })(),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginLeft: "16px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: `desc-generate-btn${generating ? " desc-generate-btn--loading" : ""}`,
                onClick: handleGenerate,
                disabled: generating,
                children: generating ? "Generating…" : "✦ Generate"
              }
            ),
            generateError && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "desc-save-status desc-save-status--err", title: generateError, children: [
              "✗ ",
              generateError
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: `desc-generate-btn${saving ? " desc-generate-btn--loading" : ""}`,
                onClick: handleSave,
                disabled: saving,
                children: saving ? "Saving…" : "💾 Save"
              }
            ),
            saveStatus === "saved" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "desc-save-status desc-save-status--ok", children: "✓ Saved" }),
            saveStatus === "failed" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "desc-save-status desc-save-status--err", children: "✗ Failed" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "desc-generate-btn", onClick: handleCopyCustom, children: copiedCustom ? "✓ Copied" : "Copy" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "desc-pane-editor", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Ft,
          {
            defaultValue: customOverride,
            theme: "vs-dark",
            onMount: handleCustomMount,
            options: editorOptions
          }
        ) })
      ] }),
      showGenerateModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "gen-modal-backdrop", onClick: () => setShowGenerateModal(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "gen-modal", onClick: (e2) => e2.stopPropagation(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "gen-modal-title", children: "Generate Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "gen-modal-label", children: [
          "Additional instructions ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gen-modal-optional", children: "(optional)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            className: "gen-modal-textarea",
            placeholder: "e.g. focus on emotions, keep it short, mention the furniture…",
            value: additionalInstructions,
            onChange: (e2) => setAdditionalInstructions(e2.target.value),
            rows: 4,
            autoFocus: true,
            onFocus: () => notifyTextFocus(true),
            onBlur: () => notifyTextFocus(false),
            onKeyDown: (e2) => {
              if (e2.key === "Escape") setShowGenerateModal(false);
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "gen-modal-actions", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "desc-generate-btn", onClick: () => setShowGenerateModal(false), children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "desc-generate-btn desc-generate-btn--primary", onClick: sendGenerate, children: "✦ Send" })
        ] })
      ] }) })
    ] });
  }
  function SuggestionsDropdown({ items, onSelect, activeValue, placeholder }) {
    if (!placeholder && items.length === 0) return null;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "ostimnet-suggestions", children: [
      placeholder && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "li",
        {
          className: "ostimnet-suggestion-item ostimnet-suggestion-item--placeholder",
          onMouseDown: (e2) => {
            e2.preventDefault();
            placeholder.onSelect();
          },
          children: placeholder.label
        }
      ),
      items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "li",
        {
          className: `ostimnet-suggestion-item${item === activeValue ? " ostimnet-suggestion-item--active" : ""}`,
          onMouseDown: (e2) => {
            e2.preventDefault();
            onSelect(item);
          },
          children: item
        },
        item
      ))
    ] });
  }
  function CustomSelect({ value, options, placeholder = "— select —", onChange: onChange2 }) {
    const [open, setOpen] = reactExports.useState(false);
    const ref = reactExports.useRef(null);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "ostimnet-custom-select",
        ref,
        tabIndex: 0,
        onFocus: () => setOpen(true),
        onBlur: () => setOpen(false),
        onKeyDown: (e2) => {
          if (e2.key === "Escape") setOpen(false);
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `ostimnet-custom-select-value${!value ? " ostimnet-custom-select-placeholder" : ""}`, children: value || placeholder }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ostimnet-custom-select-arrow", children: "▾" }),
          open && /* @__PURE__ */ jsxRuntimeExports.jsx(
            SuggestionsDropdown,
            {
              items: options,
              onSelect: (v2) => {
                onChange2(v2);
                setOpen(false);
              },
              activeValue: value,
              placeholder: { label: placeholder, onSelect: () => {
                onChange2("");
                setOpen(false);
              } }
            }
          )
        ]
      }
    );
  }
  function OStimNetMetaTags({ sceneId }) {
    const { intents, positions } = useNavigatorStore((state) => state.ostimNetSuggestions);
    const [intent, setIntent] = reactExports.useState("");
    const [selectedPositions, setSelectedPositions] = reactExports.useState([]);
    const [positionInput, setPositionInput] = reactExports.useState("");
    const [showSuggestions, setShowSuggestions] = reactExports.useState(false);
    const [saveStatus, setSaveStatus] = reactExports.useState(null);
    const [saving, setSaving] = reactExports.useState(false);
    const positionInputRef = reactExports.useRef(null);
    const multiselectRef = reactExports.useRef(null);
    reactExports.useEffect(() => {
      async function loadMeta() {
        const meta = await requestSceneMetaAsync(sceneId);
        setIntent(meta.intent);
        setSelectedPositions(meta.positions);
      }
      setIntent("");
      setSelectedPositions([]);
      loadMeta();
    }, [sceneId]);
    function addPosition(value) {
      const trimmed = value.trim();
      if (trimmed && !selectedPositions.includes(trimmed)) {
        setSelectedPositions((prev) => [...prev, trimmed]);
      }
      setPositionInput("");
    }
    function removePosition(pos) {
      setSelectedPositions((prev) => prev.filter((p2) => p2 !== pos));
    }
    async function handleSave() {
      setSaving(true);
      setSaveStatus(null);
      const ok2 = await saveSceneMetaAsync(sceneId, { intent, positions: selectedPositions });
      setSaving(false);
      setSaveStatus(ok2 ? "saved" : "failed");
      setTimeout(() => setSaveStatus(null), 3e3);
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ostimnet-metatags", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ostimnet-field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "ostimnet-label", children: "Intent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flexGrow: 1, marginRight: "10px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            CustomSelect,
            {
              value: (intent == null ? void 0 : intent.startsWith("dom")) ? "dom" : intent,
              options: intents,
              placeholder: "— select —",
              onChange: (val) => {
                if (val === "dom") {
                  setIntent("dom");
                } else {
                  setIntent(val);
                }
              }
            }
          ) }),
          (intent == null ? void 0 : intent.startsWith("dom")) && /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "ostimnet-checkbox-container", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                checked: intent.includes("femdom"),
                onChange: (e2) => {
                  setIntent(e2.target.checked ? "dom,femdom" : "dom");
                },
                className: "ostimnet-checkbox"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ostimnet-checkbox-label", children: "Femdom" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ostimnet-field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "ostimnet-label", children: "Positions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "ostimnet-multiselect",
            ref: multiselectRef,
            onMouseDown: (e2) => {
              if (e2.target !== positionInputRef.current) e2.preventDefault();
            },
            onClick: () => {
              var _a;
              return (_a = positionInputRef.current) == null ? void 0 : _a.focus();
            },
            children: [
              selectedPositions.map((p2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ostimnet-chip", children: [
                p2,
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "ostimnet-chip-remove", onMouseDown: (e2) => {
                  e2.preventDefault();
                  removePosition(p2);
                }, children: "✕" })
              ] }, p2)),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  ref: positionInputRef,
                  className: "ostimnet-chip-input",
                  value: positionInput,
                  onChange: (e2) => setPositionInput(e2.target.value),
                  onFocus: () => {
                    setShowSuggestions(true);
                    notifyTextFocus(true);
                  },
                  onBlur: () => {
                    setShowSuggestions(false);
                    notifyTextFocus(false);
                    if (positionInput.trim()) addPosition(positionInput);
                  },
                  onKeyDown: (e2) => {
                    if (e2.key === "Enter" || e2.key === ",") {
                      e2.preventDefault();
                      addPosition(positionInput);
                    } else if (e2.key === "Backspace" && positionInput === "" && selectedPositions.length > 0) {
                      removePosition(selectedPositions[selectedPositions.length - 1]);
                    } else if (e2.key === "Escape") {
                      setShowSuggestions(false);
                    }
                  },
                  placeholder: selectedPositions.length === 0 ? "type or pick suggestion…" : "",
                  autoComplete: "off",
                  spellCheck: false
                }
              ),
              showSuggestions && /* @__PURE__ */ jsxRuntimeExports.jsx(
                SuggestionsDropdown,
                {
                  items: positions.filter(
                    (p2) => !selectedPositions.includes(p2) && p2.includes(positionInput.toLowerCase())
                  ),
                  onSelect: addPosition
                }
              )
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ostimnet-save-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: `desc-generate-btn${saving ? " desc-generate-btn--loading" : ""}`,
            onClick: handleSave,
            disabled: saving,
            children: saving ? "Saving…" : "💾 Save Meta"
          }
        ),
        saveStatus === "saved" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "desc-save-status desc-save-status--ok", children: "✓ Saved" }),
        saveStatus === "failed" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "desc-save-status desc-save-status--err", children: "✗ Failed" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ostimnet-field ostimnet-field--description", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "ostimnet-label", children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DescriptionModal,
          {
            sceneId
          }
        )
      ] })
    ] });
  }
  function OStimPresetModal({ scene, onClose }) {
    const [activeTab, setActiveTab] = reactExports.useState("ostim");
    const [dockedLeft, setDockedLeft] = reactExports.useState(false);
    const currentSceneId = useNavigatorStore((state) => state.currentSceneId);
    const isCurrentScene = reactExports.useRef(scene.id.toLowerCase() === currentSceneId.toLowerCase());
    const finalSceneId = isCurrentScene.current ? currentSceneId : scene.id;
    const titleColor = "var(--amber)";
    reactExports.useEffect(() => {
      function onKey(e2) {
        if (e2.key === "Escape") onClose();
      }
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);
    return reactDomExports.createPortal(
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `preset-modal-backdrop${dockedLeft ? " preset-modal-backdrop--left" : ""}`, onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preset-modal", onClick: (e2) => e2.stopPropagation(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preset-modal-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "preset-modal-title", style: { color: titleColor }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "preset-modal-scene-id", children: finalSceneId }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preset-modal-header-actions", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "preset-btn preset-btn--dock",
                onClick: () => setDockedLeft((v2) => !v2),
                title: dockedLeft ? "Move to right side" : "Move to left side",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(FontAwesomeIcon, { icon: dockedLeft ? faAngleRight : faAngleLeft })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "preset-btn preset-btn--close", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx(FontAwesomeIcon, { icon: faXmark }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preset-modal-tabs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: `preset-tab${activeTab === "ostim" ? " preset-tab--active" : ""}`,
              onClick: () => setActiveTab("ostim"),
              children: "OStim"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: `preset-tab${activeTab === "ostimnet" ? " preset-tab--active" : ""}`,
              onClick: () => setActiveTab("ostimnet"),
              children: "OStimNet"
            }
          )
        ] }),
        activeTab === "ostim" && /* @__PURE__ */ jsxRuntimeExports.jsx(OStimJson, { sceneId: finalSceneId }),
        activeTab === "ostimnet" && /* @__PURE__ */ jsxRuntimeExports.jsx(OStimNetMetaTags, { sceneId: finalSceneId })
      ] }) }),
      document.body
    );
  }
  function CurrentScenePanel({
    scene,
    activeActions,
    activeSceneTags,
    activeActorTags,
    onActionClick,
    onSceneTagClick,
    onActorTagClick
  }) {
    const [expanded, setExpanded] = reactExports.useState(true);
    const uniqueActions = reactExports.useMemo(
      () => Array.from(new Set(scene.actions.map((a2) => a2.type))).sort(),
      [scene.actions]
    );
    const actorTagSlots = reactExports.useMemo(
      () => scene.actors.map((a2) => Array.from(new Set(a2.tags)).sort()),
      [scene.actors]
    );
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "csp-wrapper", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: "csp-header",
          onClick: () => setExpanded((v2) => !v2),
          "aria-expanded": expanded,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "csp-header-title", children: "Current Scene" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "csp-header-id", children: scene.id }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              FontAwesomeIcon,
              {
                icon: expanded ? faChevronDown : faChevronRight,
                className: "csp-header-caret",
                "aria-hidden": "true"
              }
            )
          ]
        }
      ),
      expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "csp-body", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "csp-info-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "csp-label", children: "ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "csp-value csp-value--id", children: scene.id }),
          scene.name && scene.name !== scene.id && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "csp-sep", children: "·" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "csp-value", children: scene.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "csp-sep", children: "·" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "csp-value csp-value--modpack", children: scene.modpack }),
          scene.furnitureType && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "csp-sep", children: "·" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "csp-label", children: "Furniture" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "csp-value", children: scene.furnitureType })
          ] })
        ] }),
        uniqueActions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "csp-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "csp-label", children: "Actions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "csp-pills", children: uniqueActions.map((type) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: `csp-pill csp-pill--action${activeActions.has(type) ? " csp-pill--active" : ""}`,
              onClick: () => onActionClick(type),
              title: `Filter by action: ${type}`,
              children: type
            },
            type
          )) })
        ] }),
        scene.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "csp-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "csp-label", children: "Scene Tags" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "csp-pills", children: scene.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: `csp-pill csp-pill--tag${activeSceneTags.has(tag) ? " csp-pill--active" : ""}`,
              onClick: () => onSceneTagClick(tag),
              title: `Filter by scene tag: ${tag}`,
              children: tag
            },
            tag
          )) })
        ] }),
        actorTagSlots.some((tags) => tags.length > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "csp-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "csp-label", children: "Actor Tags" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "csp-actor-slots", children: actorTagSlots.map(
            (tags, i2) => tags.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "csp-actor-slot", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "csp-actor-slot-label", children: [
                "Actor ",
                i2 + 1
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "csp-pills", children: tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: `csp-pill csp-pill--actor${activeActorTags.has(tag) ? " csp-pill--active" : ""}`,
                  onClick: () => onActorTagClick(tag),
                  title: `Filter by actor tag: ${tag}`,
                  children: tag
                },
                tag
              )) })
            ] }, i2) : null
          ) })
        ] })
      ] })
    ] });
  }
  function Pill({ label, active, onClick }) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: `pill${active ? " pill--active" : ""}`,
        onClick,
        title: label,
        children: label
      }
    );
  }
  function GenderSetupLabel({ setup, showLabel = true }) {
    if (!setup) return null;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "gender-composition", children: [
      setup.split("").map((ch2, i2) => {
        if (ch2 === "m") return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gender-icon gender-male", title: "Male", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FontAwesomeIcon, { icon: faMars }) }, i2);
        if (ch2 === "f") return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gender-icon gender-female", title: "Female", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FontAwesomeIcon, { icon: faVenus }) }, i2);
        return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gender-icon gender-any", title: "Any", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FontAwesomeIcon, { icon: faMarsAndVenus }) }, i2);
      }),
      showLabel && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "gender-setup-text", children: [
        " ",
        setup
      ] })
    ] });
  }
  function getGenderSetup(actors) {
    const order = { f: 0, m: 1, "?": 2 };
    return actors.map((a2) => a2.intendedSex === "male" ? "m" : a2.intendedSex === "female" ? "f" : "?").sort((a2, b2) => (order[a2] ?? 99) - (order[b2] ?? 99)).join("");
  }
  function expandQuestionMarks(setup) {
    const results = [];
    function recurse(idx, current) {
      if (idx === setup.length) {
        results.push(current);
        return;
      }
      const ch2 = setup[idx];
      if (ch2 === "?") {
        recurse(idx + 1, current + "f");
        recurse(idx + 1, current + "m");
      } else {
        recurse(idx + 1, current + ch2);
      }
    }
    recurse(0, "");
    return results;
  }
  function sortGenderSetups(setups) {
    return [...setups].sort((a2, b2) => a2.length !== b2.length ? a2.length - b2.length : a2.localeCompare(b2));
  }
  function canonicalSetupsForCount(count) {
    if (count === 0) return [];
    const results = [];
    for (let f2 = count; f2 >= 0; f2--) {
      results.push("f".repeat(f2) + "m".repeat(count - f2));
    }
    return results;
  }
  function MultiSelectFilter({
    label,
    options,
    selected,
    andMode,
    showAndOr,
    onToggle,
    onAndOrToggle,
    searchable,
    renderOption
  }) {
    const [open, setOpen] = reactExports.useState(false);
    const [search, setSearch] = reactExports.useState("");
    const ref = reactExports.useRef(null);
    const filtered = reactExports.useMemo(() => {
      const base = searchable && search ? options.filter((o2) => o2.toLowerCase().includes(search.toLowerCase())) : options;
      return [...base].sort((a2, b2) => {
        const aSelected = selected.has(a2) ? 0 : 1;
        const bSelected = selected.has(b2) ? 0 : 1;
        return aSelected - bSelected;
      });
    }, [options, search, searchable, selected]);
    const hasActive = selected.size > 0;
    function handleBlur(e2) {
      var _a;
      if (!((_a = ref.current) == null ? void 0 : _a.contains(e2.relatedTarget))) {
        setOpen(false);
        setSearch("");
      }
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "msf-wrapper", ref, onBlur: handleBlur, tabIndex: -1, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "msf-header", children: [
        showAndOr && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: `msf-andor${andMode ? " msf-andor--and" : " msf-andor--or"}`,
            onClick: onAndOrToggle,
            title: andMode ? "AND: scene must have ALL selected" : "OR: scene must have ANY selected",
            type: "button",
            children: andMode ? "AND" : "OR"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: `msf-toggle ${showAndOr ? "msf-andor-toggle" : ""} prism-control-button${hasActive ? " msf-toggle--active" : ""}`,
            onClick: () => setOpen((v2) => !v2),
            type: "button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "msf-label", children: label }),
              hasActive && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "msf-count", children: selected.size }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FontAwesomeIcon, { icon: open ? faChevronDown : faChevronRight, className: "msf-caret", "aria-hidden": "true" })
            ]
          }
        )
      ] }),
      open && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "msf-dropdown", children: [
        searchable && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "msf-search prism-control-input",
            placeholder: "Search…",
            value: search,
            onChange: (e2) => setSearch(e2.target.value),
            onFocus: () => notifyTextFocus(true),
            onBlur: () => notifyTextFocus(false),
            autoFocus: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "msf-options", children: [
          filtered.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `msf-option${selected.has(opt) ? " msf-option--checked" : ""}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                checked: selected.has(opt),
                onChange: () => onToggle(opt),
                className: "msf-checkbox"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "msf-option-label", children: renderOption ? renderOption(opt) : opt })
          ] }, opt)),
          filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "msf-empty", children: "No matches" })
        ] })
      ] })
    ] });
  }
  const COLUMNS = ["ID", "Modpack", "Desc", "Config"];
  function SceneTable() {
    const scenes = useNavigatorStore((state) => state.scenes);
    const playerThreadRunning = useNavigatorStore((state) => state.playerThreadRunning);
    const currentSceneId = useNavigatorStore((state) => state.currentSceneId);
    const currentThread = useNavigatorStore((state) => state.currentThread);
    const sceneSuggestions = useNavigatorStore((state) => state.sceneSuggestions);
    const [search, setSearch] = reactExports.useState("");
    const [modpackFilter, setModpackFilter] = reactExports.useState(/* @__PURE__ */ new Set());
    const [descFilter, setDescFilter] = reactExports.useState("all");
    const [filtersExpanded, setFiltersExpanded] = reactExports.useState(false);
    const [page, setPage] = reactExports.useState(0);
    const PAGE_SIZE = 50;
    const [sceneTagFilter, setSceneTagFilter] = reactExports.useState(/* @__PURE__ */ new Set());
    const [sceneTagsAND, setSceneTagsAND] = reactExports.useState(false);
    const [actorTagFilter, setActorTagFilter] = reactExports.useState(/* @__PURE__ */ new Set());
    const [actorTagsAND, setActorTagsAND] = reactExports.useState(false);
    const [actionsFilter, setActionsFilter] = reactExports.useState(/* @__PURE__ */ new Set());
    const [actionTagsFilter, setActionTagsFilter] = reactExports.useState(/* @__PURE__ */ new Set());
    const [actionTagsAND, setActionTagsAND] = reactExports.useState(false);
    const [furnitureFilter, setFurnitureFilter] = reactExports.useState(/* @__PURE__ */ new Set());
    const [hideTransitions, setHideTransitions] = reactExports.useState(false);
    const [hideNonRandom, setHideNonRandom] = reactExports.useState(false);
    const [genderFilter, setGenderFilter] = reactExports.useState(/* @__PURE__ */ new Set());
    const [preselected, setPreselected] = reactExports.useState(false);
    reactExports.useEffect(() => {
      if (preselected || !currentThread || scenes.length === 0) return;
      const setup = currentThread.genderSetup;
      const furniture = currentThread.furniture;
      const newGenderFilter = /* @__PURE__ */ new Set();
      if (setup) {
        expandQuestionMarks(setup).forEach((s2) => newGenderFilter.add(s2));
      }
      const newFurnitureFilter = /* @__PURE__ */ new Set();
      newFurnitureFilter.add(furniture || "none");
      setGenderFilter(newGenderFilter);
      setFurnitureFilter(newFurnitureFilter);
      setPreselected(true);
    }, [scenes, currentThread, preselected]);
    const [modalScene, setModalScene] = reactExports.useState(null);
    function openModal(scene) {
      setModalScene(scene);
    }
    const allModpacks = reactExports.useMemo(
      () => Array.from(new Set(scenes.map((s2) => s2.modpack).filter(Boolean))).sort(),
      [scenes]
    );
    const allFurnitureTypes = reactExports.useMemo(() => {
      const types = Array.from(new Set(scenes.map((s2) => s2.furnitureType).filter(Boolean))).sort();
      return ["none", ...types];
    }, [scenes]);
    const allActionTagOptions = reactExports.useMemo(() => {
      const tags = Object.values(sceneSuggestions.actionTagSuggestions).flat();
      return Array.from(new Set(tags)).sort();
    }, [sceneSuggestions.actionTagSuggestions]);
    const allGenderSetups = reactExports.useMemo(() => {
      const counts = new Set(
        scenes.filter((s2) => !s2.id.toLowerCase().includes("swapped")).map((s2) => s2.actors.length).filter((n2) => n2 > 0)
      );
      const setups = /* @__PURE__ */ new Set();
      counts.forEach((n2) => canonicalSetupsForCount(n2).forEach((s2) => setups.add(s2)));
      return sortGenderSetups(Array.from(setups));
    }, [scenes]);
    const hasAnyRichFilter = modpackFilter.size > 0 || sceneTagFilter.size > 0 || actorTagFilter.size > 0 || actionsFilter.size > 0 || actionTagsFilter.size > 0 || furnitureFilter.size > 0 || genderFilter.size > 0 || hideTransitions || hideNonRandom;
    const hasAnyClearableFilter = !!search || descFilter !== "all" || hasAnyRichFilter;
    const filtered = reactExports.useMemo(() => {
      const q2 = search.toLowerCase();
      return scenes.filter((s2) => {
        if (s2.id.toLowerCase().includes("swapped")) return false;
        if (q2 && !s2.id.toLowerCase().includes(q2) && !s2.name.toLowerCase().includes(q2)) return false;
        if (modpackFilter.size && !modpackFilter.has(s2.modpack)) return false;
        if (descFilter === "with" && !s2.hasCustomDescription) return false;
        if (descFilter === "without" && s2.hasCustomDescription) return false;
        if (s2.id.toLowerCase() === currentSceneId.toLowerCase()) return false;
        if (hideTransitions && s2.isTransition) return false;
        if (hideNonRandom && s2.noRandomSelection) return false;
        if (furnitureFilter.size) {
          const effectiveFurniture = s2.furnitureType || "none";
          if (!furnitureFilter.has(effectiveFurniture)) return false;
        }
        if (genderFilter.size) {
          const sceneSetup = getGenderSetup(s2.actors);
          const expanded = expandQuestionMarks(sceneSetup);
          if (!expanded.some((e2) => genderFilter.has(e2))) return false;
        }
        if (sceneTagFilter.size) {
          const match = sceneTagsAND ? [...sceneTagFilter].every((t2) => s2.tags.includes(t2)) : [...sceneTagFilter].some((t2) => s2.tags.includes(t2));
          if (!match) return false;
        }
        if (actorTagFilter.size) {
          const match = s2.actors.some(
            (actor) => actorTagsAND ? [...actorTagFilter].every((t2) => actor.tags.includes(t2)) : [...actorTagFilter].some((t2) => actor.tags.includes(t2))
          );
          if (!match) return false;
        }
        if (actionsFilter.size) {
          const sceneActionTypes = s2.actions.map((a2) => a2.type);
          const match = [...actionsFilter].some((t2) => sceneActionTypes.includes(t2));
          if (!match) return false;
        }
        if (actionTagsFilter.size) {
          const actionTagMap = sceneSuggestions.actionTagSuggestions;
          const match = actionTagsAND ? [...actionTagsFilter].every(
            (tag) => s2.actions.some((a2) => (actionTagMap[a2.type] ?? []).includes(tag))
          ) : s2.actions.some(
            (a2) => (actionTagMap[a2.type] ?? []).some((tag) => actionTagsFilter.has(tag))
          );
          if (!match) return false;
        }
        return true;
      });
    }, [
      scenes,
      search,
      modpackFilter,
      descFilter,
      currentSceneId,
      sceneTagFilter,
      sceneTagsAND,
      actorTagFilter,
      actorTagsAND,
      actionsFilter,
      actionTagsFilter,
      actionTagsAND,
      furnitureFilter,
      genderFilter,
      hideTransitions,
      hideNonRandom,
      sceneSuggestions.actionTagSuggestions
    ]);
    const pinnedRow = reactExports.useMemo(() => {
      return currentSceneId ? scenes.find((s2) => s2.id.toLowerCase() === currentSceneId.toLowerCase()) ?? null : null;
    }, [scenes, currentSceneId]);
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages - 1);
    const pageRows = filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);
    function toggleSet(set, value) {
      const next = new Set(set);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    }
    function clearAllFilters() {
      setSearch("");
      setModpackFilter(/* @__PURE__ */ new Set());
      setDescFilter("all");
      setSceneTagFilter(/* @__PURE__ */ new Set());
      setActorTagFilter(/* @__PURE__ */ new Set());
      setActionsFilter(/* @__PURE__ */ new Set());
      setActionTagsFilter(/* @__PURE__ */ new Set());
      setFurnitureFilter(/* @__PURE__ */ new Set());
      setGenderFilter(/* @__PURE__ */ new Set());
      setHideTransitions(false);
      setHideNonRandom(false);
      setPage(0);
      setPreselected(false);
    }
    function handleActionPillClick(type) {
      setActionsFilter((s2) => toggleSet(s2, type));
      setPage(0);
    }
    function handleSceneTagPillClick(tag) {
      setSceneTagFilter((s2) => toggleSet(s2, tag));
      setPage(0);
    }
    function handleActorTagPillClick(tag) {
      setActorTagFilter((s2) => toggleSet(s2, tag));
      setPage(0);
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "scene-table-wrapper", children: [
      pinnedRow && /* @__PURE__ */ jsxRuntimeExports.jsx(
        CurrentScenePanel,
        {
          scene: pinnedRow,
          activeActions: actionsFilter,
          activeSceneTags: sceneTagFilter,
          activeActorTags: actorTagFilter,
          onActionClick: handleActionPillClick,
          onSceneTagClick: handleSceneTagPillClick,
          onActorTagClick: handleActorTagPillClick
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "scene-table-toolbar", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "scene-table-search prism-control-input",
            type: "text",
            placeholder: "Search by ID or name…",
            value: search,
            onChange: (e2) => {
              setSearch(e2.target.value);
              setPage(0);
            },
            onFocus: () => notifyTextFocus(true),
            onBlur: () => notifyTextFocus(false)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: `scene-table-filter-toggle prism-control-button${filtersExpanded || hasAnyRichFilter ? " scene-table-filter-toggle--active" : ""}`,
            onClick: () => setFiltersExpanded((v2) => !v2),
            "aria-expanded": filtersExpanded,
            "aria-controls": "scene-table-filters",
            type: "button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FontAwesomeIcon, { icon: faFilter, className: "scene-table-filter-icon", "aria-hidden": "true" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "scene-table-filter-label", children: "Filter" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                FontAwesomeIcon,
                {
                  icon: filtersExpanded ? faChevronDown : faChevronRight,
                  className: "scene-table-filter-caret",
                  "aria-hidden": "true"
                }
              )
            ]
          }
        ),
        hasAnyClearableFilter && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "scene-table-clear prism-control-button",
            onClick: clearAllFilters,
            children: "Clear filters"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "scene-table-count prism-count-text", children: [
          filtered.length,
          " scenes"
        ] })
      ] }),
      filtersExpanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "scene-table-filters", className: "scene-table-filters", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "scene-table-filter-row scene-table-filter-row--compat", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "compat-check", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                checked: hideTransitions,
                onChange: (e2) => {
                  setHideTransitions(e2.target.checked);
                  setPage(0);
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Hide Transitions" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "compat-check", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                checked: hideNonRandom,
                onChange: (e2) => {
                  setHideNonRandom(e2.target.checked);
                  setPage(0);
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Hide Non-Random Selection" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "scene-table-filter-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "scene-table-filter-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              MultiSelectFilter,
              {
                label: "Modpack",
                options: allModpacks,
                selected: modpackFilter,
                onToggle: (v2) => {
                  setModpackFilter((s2) => toggleSet(s2, v2));
                  setPage(0);
                },
                searchable: true
              }
            ),
            allGenderSetups.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              MultiSelectFilter,
              {
                label: "Actor Setup",
                options: allGenderSetups,
                selected: genderFilter,
                onToggle: (v2) => {
                  setGenderFilter((s2) => toggleSet(s2, v2));
                  setPage(0);
                },
                renderOption: (v2) => /* @__PURE__ */ jsxRuntimeExports.jsx(GenderSetupLabel, { setup: v2 })
              }
            ),
            allFurnitureTypes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              MultiSelectFilter,
              {
                label: "Furniture",
                options: allFurnitureTypes,
                selected: furnitureFilter,
                onToggle: (v2) => {
                  setFurnitureFilter((s2) => toggleSet(s2, v2));
                  setPage(0);
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              MultiSelectFilter,
              {
                label: "Actions",
                options: sceneSuggestions.actionTypes,
                selected: actionsFilter,
                onToggle: (v2) => {
                  setActionsFilter((s2) => toggleSet(s2, v2));
                  setPage(0);
                },
                searchable: true,
                showAndOr: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "scene-table-filter-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "desc-toggle", role: "group", "aria-label": "Custom description filter", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "desc-toggle-label", children: "Desc" }),
              ["all", "with", "without"].map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: `desc-toggle-btn${descFilter === opt ? " desc-toggle-btn--active" : ""}`,
                  onClick: () => {
                    setDescFilter(opt);
                    setPage(0);
                  },
                  children: opt === "all" ? "All" : opt === "with" ? "With" : "Without"
                },
                opt
              ))
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              MultiSelectFilter,
              {
                label: "Scene Tags",
                options: sceneSuggestions.sceneTags,
                selected: sceneTagFilter,
                andMode: sceneTagsAND,
                showAndOr: true,
                onToggle: (v2) => {
                  setSceneTagFilter((s2) => toggleSet(s2, v2));
                  setPage(0);
                },
                onAndOrToggle: () => setSceneTagsAND((v2) => !v2),
                searchable: true
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              MultiSelectFilter,
              {
                label: "Actor Tags",
                options: sceneSuggestions.actorTags,
                selected: actorTagFilter,
                andMode: actorTagsAND,
                showAndOr: true,
                onToggle: (v2) => {
                  setActorTagFilter((s2) => toggleSet(s2, v2));
                  setPage(0);
                },
                onAndOrToggle: () => setActorTagsAND((v2) => !v2),
                searchable: true
              }
            ),
            allActionTagOptions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              MultiSelectFilter,
              {
                label: "Action Tags",
                options: allActionTagOptions,
                selected: actionTagsFilter,
                andMode: actionTagsAND,
                showAndOr: true,
                onToggle: (v2) => {
                  setActionTagsFilter((s2) => toggleSet(s2, v2));
                  setPage(0);
                },
                onAndOrToggle: () => setActionTagsAND((v2) => !v2),
                searchable: true
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scene-table-filter-row" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scene-table-scroll", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "scene-table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          playerThreadRunning && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "col-warp", title: "Warp player thread to this scene" }),
          COLUMNS.map((col) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "th",
            {
              className: `col-${col.replace(" ", "-").toLowerCase()}`,
              children: col
            },
            col
          ))
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          pinnedRow && /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: [
            "row--current",
            "row--pinned",
            pinnedRow.isTransition ? "row-transition" : ""
          ].filter(Boolean).join(" "), children: [
            playerThreadRunning && /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "col-warp", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "active-marker" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: "row-action-btn row-action-btn--warp",
                  title: `Warp to ${pinnedRow.id}`,
                  onClick: () => {
                    var _a;
                    return (_a = window.warpToScene) == null ? void 0 : _a.call(window, pinnedRow.id);
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(FontAwesomeIcon, { icon: faPlay, "aria-hidden": "true" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "col-id", title: pinnedRow.id, children: [
              pinnedRow.id,
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-id-name", children: pinnedRow.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(GenderSetupLabel, { setup: getGenderSetup(pinnedRow.actors), showLabel: false })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "col-modpack", title: pinnedRow.modpack, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Pill,
              {
                label: pinnedRow.modpack,
                active: modpackFilter.has(pinnedRow.modpack),
                onClick: () => {
                  setModpackFilter((s2) => toggleSet(s2, pinnedRow.modpack));
                  setPage(0);
                }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "col-desc", title: pinnedRow.descriptionInherited ? "Has inherited description" : pinnedRow.hasCustomDescription ? "Has custom description" : "No custom description", children: pinnedRow.descriptionInherited ? "↷" : pinnedRow.hasCustomDescription ? "✓" : "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "col-presets", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "preset-btn-group", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "row-action-btn row-action-btn--ostim",
                onClick: () => openModal(pinnedRow),
                title: "Open Config Modal",
                children: "Edit"
              }
            ) }) })
          ] }, pinnedRow.id),
          pageRows.map((scene) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: [
            scene.isTransition ? "row-transition" : ""
          ].filter(Boolean).join(" "), children: [
            playerThreadRunning && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "col-warp", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "row-action-btn row-action-btn--warp",
                title: `Warp to ${scene.id}`,
                onClick: () => {
                  var _a;
                  return (_a = window.warpToScene) == null ? void 0 : _a.call(window, scene.id);
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(FontAwesomeIcon, { icon: faPlay, "aria-hidden": "true" })
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "col-id", title: scene.id, children: [
              scene.id,
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-id-name", children: scene.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(GenderSetupLabel, { setup: getGenderSetup(scene.actors), showLabel: false })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "col-modpack", title: scene.modpack, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Pill,
              {
                label: scene.modpack,
                active: modpackFilter.has(scene.modpack),
                onClick: () => {
                  setModpackFilter((s2) => toggleSet(s2, scene.modpack));
                  setPage(0);
                }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "col-desc", title: scene.descriptionInherited ? "Has inherited description" : scene.hasCustomDescription ? "Has custom description" : "No custom description", children: scene.descriptionInherited ? "↷" : scene.hasCustomDescription ? "✓" : "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "col-presets", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "preset-btn-group", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "row-action-btn row-action-btn--ostim",
                onClick: () => openModal(scene),
                title: "Open Config Modal",
                children: "Edit"
              }
            ) }) })
          ] }, scene.id)),
          pageRows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: COLUMNS.length + (playerThreadRunning ? 1 : 0), className: "empty-row", children: "No scenes match the current filters." }) })
        ] })
      ] }) }),
      modalScene && /* @__PURE__ */ jsxRuntimeExports.jsx(
        OStimPresetModal,
        {
          scene: modalScene,
          onClose: () => setModalScene(null)
        }
      ),
      totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "scene-table-pagination", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: currentPage === 0, onClick: () => setPage(0), children: /* @__PURE__ */ jsxRuntimeExports.jsx(FontAwesomeIcon, { icon: faAnglesLeft, "aria-hidden": "true" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: currentPage === 0, onClick: () => setPage((p2) => p2 - 1), children: /* @__PURE__ */ jsxRuntimeExports.jsx(FontAwesomeIcon, { icon: faChevronLeft, "aria-hidden": "true" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          currentPage + 1,
          " / ",
          totalPages
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: currentPage >= totalPages - 1, onClick: () => setPage((p2) => p2 + 1), children: /* @__PURE__ */ jsxRuntimeExports.jsx(FontAwesomeIcon, { icon: faChevronRight, "aria-hidden": "true" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: currentPage >= totalPages - 1, onClick: () => setPage(totalPages - 1), children: /* @__PURE__ */ jsxRuntimeExports.jsx(FontAwesomeIcon, { icon: faAnglesRight, "aria-hidden": "true" }) })
      ] })
    ] });
  }
  function App() {
    const visible = useNavigatorStore((state) => state.visible);
    const [pressedKey, setPressedKey] = reactExports.useState(null);
    const hideTimer = reactExports.useRef(null);
    reactExports.useEffect(() => {
      function onKeyDown(e2) {
        if (hideTimer.current) clearTimeout(hideTimer.current);
        setPressedKey(e2.key);
        hideTimer.current = setTimeout(() => setPressedKey(null), 1500);
      }
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }, []);
    if (!visible) return null;
    const style = {};
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ui-container", style, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navigator-panel prism-panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navigator-header", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "navigator-title", children: "OStim Navigator" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "navigator-close-btn", onClick: closeNavigatorView, title: "Close", children: "✕" })
      ] }),
      pressedKey && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "key-badge", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "key-badge-label", children: "KEY" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "key-badge-key", children: pressedKey })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SceneTable, {})
    ] }) });
  }
  const store = useNavigatorStore.getState();
  setupGameIntegration(store);
  client.createRoot(document.getElementById("root")).render(
    /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
  );
})();
