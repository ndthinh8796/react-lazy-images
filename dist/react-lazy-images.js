var e,
  t =
    (e = require("react")) && "object" == typeof e && "default" in e
      ? e.default
      : e,
  n = require("react-intersection-observer"),
  r = require("unionize"),
  o = function(e, t) {
    return (o =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function(e, t) {
          e.__proto__ = t;
        }) ||
      function(e, t) {
        for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
      })(e, t);
  };
var a,
  i = function() {
    return (i =
      Object.assign ||
      function(e) {
        for (var t, n = 1, r = arguments.length; n < r; n++)
          for (var o in (t = arguments[n]))
            Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
        return e;
      }).apply(this, arguments);
  };
function c(e, t) {
  var n = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) &&
      t.indexOf(r) < 0 &&
      (n[r] = e[r]);
  if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
    var o = 0;
    for (r = Object.getOwnPropertySymbols(e); o < r.length; o++)
      t.indexOf(r[o]) < 0 && (n[r[o]] = e[r[o]]);
  }
  return n;
}
((a = exports.ImageState || (exports.ImageState = {})).NotAsked = "NotAsked"),
  (a.Loading = "Loading"),
  (a.LoadSuccess = "LoadSuccess"),
  (a.LoadError = "LoadError");
var u = r.unionize({
    NotAsked: {},
    Buffering: {},
    Loading: {},
    LoadSuccess: {},
    LoadError: r.ofType()
  }),
  s = r.unionize({
    ViewChanged: r.ofType(),
    BufferingEnded: {},
    LoadSuccess: {},
    LoadError: r.ofType()
  }),
  d = function(e, t) {
    return function(n) {
      var r = m(g(e, t));
      r.promise
        .then(function(e) {
          return n.update(s.LoadSuccess({}));
        })
        .catch(function(e) {
          e.isCanceled || n.update(s.LoadError({ msg: "Failed to load" }));
        }),
        (n.promiseCache.loading = r);
    };
  },
  f = function(e) {
    e.promiseCache.buffering.cancel();
  },
  p = (function(e) {
    function r(t) {
      var n = e.call(this, t) || this;
      return (
        (n.promiseCache = {}),
        (n.initialState = u.NotAsked()),
        (n.state = n.initialState),
        (n.update = n.update.bind(n)),
        n
      );
    }
    return (
      (function(e, t) {
        function n() {
          this.constructor = e;
        }
        o(e, t),
          (e.prototype =
            null === t
              ? Object.create(t)
              : ((n.prototype = t.prototype), new n()));
      })(r, e),
      (r.reducer = function(e, t, n) {
        return s.match(e, {
          ViewChanged: function(e) {
            return !0 === e.inView
              ? n.src
                ? u.match(t, {
                    NotAsked: function() {
                      return n.debounceDurationMs
                        ? {
                            nextState: u.Buffering(),
                            cmd: ((e = n.debounceDurationMs),
                            function(t) {
                              var n = m(l(e));
                              n.promise
                                .then(function() {
                                  return t.update(s.BufferingEnded());
                                })
                                .catch(function(e) {}),
                                (t.promiseCache.buffering = n);
                            })
                          }
                        : {
                            nextState: u.Loading(),
                            cmd: d(n, n.experimentalDecode)
                          };
                      var e;
                    },
                    default: function() {
                      return { nextState: t };
                    }
                  })
                : { nextState: u.LoadSuccess() }
              : u.match(t, {
                  Buffering: function() {
                    return { nextState: u.NotAsked(), cmd: f };
                  },
                  default: function() {
                    return { nextState: t };
                  }
                });
          },
          BufferingEnded: function() {
            return { nextState: u.Loading(), cmd: d(n, n.experimentalDecode) };
          },
          LoadSuccess: function() {
            return { nextState: u.LoadSuccess() };
          },
          LoadError: function(e) {
            return { nextState: u.LoadError(e) };
          }
        });
      }),
      (r.prototype.update = function(e) {
        var t = this,
          n = r.reducer(e, this.state, this.props),
          o = n.nextState,
          a = n.cmd;
        this.props.debugActions &&
          ("production" === process.env.NODE_ENV &&
            console.warn(
              'You are running LazyImage with debugActions="true" in production. This might have performance implications.'
            ),
          console.log({ action: e, prevState: this.state, nextState: o })),
          this.setState(o, function() {
            return a && a(t);
          });
      }),
      (r.prototype.componentWillUnmount = function() {
        this.promiseCache.loading && this.promiseCache.loading.cancel(),
          this.promiseCache.buffering && this.promiseCache.buffering.cancel(),
          (this.promiseCache = {});
      }),
      (r.prototype.render = function() {
        var e = this,
          r = this.props,
          o = r.children,
          a = r.loadEagerly,
          d = r.observerProps,
          f = c(r, [
            "children",
            "loadEagerly",
            "observerProps",
            "experimentalDecode",
            "debounceDurationMs",
            "debugActions"
          ]);
        return a
          ? o({ imageState: u.LoadSuccess().tag, imageProps: f })
          : t.createElement(
              n.InView,
              i({ rootMargin: "50px 0px", threshold: 0.01 }, d, {
                onChange: function(t) {
                  return e.update(s.ViewChanged({ inView: t }));
                }
              }),
              function(t) {
                return o({
                  imageState:
                    "Buffering" === e.state.tag
                      ? exports.ImageState.Loading
                      : e.state.tag,
                  imageProps: f,
                  ref: t.ref
                });
              }
            );
      }),
      (r.displayName = "LazyImageFull"),
      r
    );
  })(t.Component),
  g = function(e, t) {
    var n = e.src,
      r = e.srcSet,
      o = e.alt,
      a = e.sizes;
    return (
      void 0 === t && (t = !1),
      new Promise(function(e, i) {
        var c = new Image();
        if (
          (r && (c.srcset = r),
          o && (c.alt = o),
          a && (c.sizes = a),
          (c.src = n),
          t && "decode" in c)
        )
          return c
            .decode()
            .then(function() {
              return e(c);
            })
            .catch(function(e) {
              return i(e);
            });
        (c.onload = e), (c.onerror = i);
      })
    );
  },
  l = function(e) {
    return new Promise(function(t) {
      return setTimeout(t, e);
    });
  },
  m = function(e) {
    var t = !1;
    return {
      promise: new Promise(function(n, r) {
        e.then(function(e) {
          return t ? r({ isCanceled: !0 }) : n(e);
        }),
          e.catch(function(e) {
            return r(t ? { isCanceled: !0 } : e);
          });
      }),
      cancel: function() {
        t = !0;
      }
    };
  },
  h = function(e) {
    var n = e.actual,
      r = e.placeholder,
      o = e.loading,
      a = e.error,
      u = c(e, ["actual", "placeholder", "loading", "error"]);
    return t.createElement(p, i({}, u), function(e) {
      var t = e.imageProps,
        i = e.ref;
      switch (e.imageState) {
        case exports.ImageState.NotAsked:
          return !!r && r({ imageProps: t, ref: i });
        case exports.ImageState.Loading:
          return o ? o() : !!r && r({ imageProps: t, ref: i });
        case exports.ImageState.LoadSuccess:
          return n({ imageProps: t });
        case exports.ImageState.LoadError:
          return a ? a() : n({ imageProps: t });
      }
    });
  };
(h.displayName = "LazyImage"),
  (exports.LazyImage = h),
  (exports.LazyImageFull = p);
//# sourceMappingURL=react-lazy-images.js.map
