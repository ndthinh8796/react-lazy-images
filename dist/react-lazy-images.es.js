import e from "react";
import { InView as t } from "react-intersection-observer";
import { unionize as n, ofType as r } from "unionize";
var o = function(e, t) {
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
!(function(e) {
  (e.NotAsked = "NotAsked"),
    (e.Loading = "Loading"),
    (e.LoadSuccess = "LoadSuccess"),
    (e.LoadError = "LoadError");
})(a || (a = {}));
var u = n({
    NotAsked: {},
    Buffering: {},
    Loading: {},
    LoadSuccess: {},
    LoadError: r()
  }),
  s = n({
    ViewChanged: r(),
    BufferingEnded: {},
    LoadSuccess: {},
    LoadError: r()
  }),
  d = function(e, t) {
    return function(n) {
      var r = g(l(e, t));
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
  p = (function(n) {
    function r(e) {
      var t = n.call(this, e) || this;
      return (
        (t.promiseCache = {}),
        (t.initialState = u.NotAsked()),
        (t.state = t.initialState),
        (t.update = t.update.bind(t)),
        t
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
      })(r, n),
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
                              var n = g(m(e));
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
        var n = this,
          r = this.props,
          o = r.children,
          d = r.loadEagerly,
          f = r.observerProps,
          p = c(r, [
            "children",
            "loadEagerly",
            "observerProps",
            "experimentalDecode",
            "debounceDurationMs",
            "debugActions"
          ]);
        return d
          ? o({ imageState: u.LoadSuccess().tag, imageProps: p })
          : e.createElement(
              t,
              i({ rootMargin: "50px 0px", threshold: 0.01 }, f, {
                onChange: function(e) {
                  return n.update(s.ViewChanged({ inView: e }));
                }
              }),
              function(e) {
                return o({
                  imageState:
                    "Buffering" === n.state.tag ? a.Loading : n.state.tag,
                  imageProps: p,
                  ref: e.ref
                });
              }
            );
      }),
      (r.displayName = "LazyImageFull"),
      r
    );
  })(e.Component),
  l = function(e, t) {
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
  m = function(e) {
    return new Promise(function(t) {
      return setTimeout(t, e);
    });
  },
  g = function(e) {
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
  h = function(t) {
    var n = t.actual,
      r = t.placeholder,
      o = t.loading,
      u = t.error,
      s = c(t, ["actual", "placeholder", "loading", "error"]);
    return e.createElement(p, i({}, s), function(e) {
      var t = e.imageProps,
        i = e.ref;
      switch (e.imageState) {
        case a.NotAsked:
          return !!r && r({ imageProps: t, ref: i });
        case a.Loading:
          return o ? o() : !!r && r({ imageProps: t, ref: i });
        case a.LoadSuccess:
          return n({ imageProps: t });
        case a.LoadError:
          return u ? u() : n({ imageProps: t });
      }
    });
  };
h.displayName = "LazyImage";
export { h as LazyImage, a as ImageState, p as LazyImageFull };
//# sourceMappingURL=react-lazy-images.es.js.map
