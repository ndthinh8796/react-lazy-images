!(function(e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? t(
        exports,
        require("react"),
        require("react-intersection-observer"),
        require("unionize")
      )
    : "function" == typeof define && define.amd
      ? define([
          "exports",
          "react",
          "react-intersection-observer",
          "unionize"
        ], t)
      : t((e.reactLazyImages = {}), e.react, null, e.unionize);
})(this, function(e, t, n, r) {
  t = t && t.hasOwnProperty("default") ? t.default : t;
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
  ((a = e.ImageState || (e.ImageState = {})).NotAsked = "NotAsked"),
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
        var r = m(l(e, t));
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
    p = (function(r) {
      function a(e) {
        var t = r.call(this, e) || this;
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
        })(a, r),
        (a.reducer = function(e, t, n) {
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
                                var n = m(g(e));
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
              return {
                nextState: u.Loading(),
                cmd: d(n, n.experimentalDecode)
              };
            },
            LoadSuccess: function() {
              return { nextState: u.LoadSuccess() };
            },
            LoadError: function(e) {
              return { nextState: u.LoadError(e) };
            }
          });
        }),
        (a.prototype.update = function(e) {
          var t = this,
            n = a.reducer(e, this.state, this.props),
            r = n.nextState,
            o = n.cmd;
          this.props.debugActions &&
            ("production" === process.env.NODE_ENV &&
              console.warn(
                'You are running LazyImage with debugActions="true" in production. This might have performance implications.'
              ),
            console.log({ action: e, prevState: this.state, nextState: r })),
            this.setState(r, function() {
              return o && o(t);
            });
        }),
        (a.prototype.componentWillUnmount = function() {
          this.promiseCache.loading && this.promiseCache.loading.cancel(),
            this.promiseCache.buffering && this.promiseCache.buffering.cancel(),
            (this.promiseCache = {});
        }),
        (a.prototype.render = function() {
          var r = this,
            o = this.props,
            a = o.children,
            d = o.loadEagerly,
            f = o.observerProps,
            p = c(o, [
              "children",
              "loadEagerly",
              "observerProps",
              "experimentalDecode",
              "debounceDurationMs",
              "debugActions"
            ]);
          return d
            ? a({ imageState: u.LoadSuccess().tag, imageProps: p })
            : t.createElement(
                n.InView,
                i({ rootMargin: "50px 0px", threshold: 0.01 }, f, {
                  onChange: function(e) {
                    return r.update(s.ViewChanged({ inView: e }));
                  }
                }),
                function(t) {
                  return a({
                    imageState:
                      "Buffering" === r.state.tag
                        ? e.ImageState.Loading
                        : r.state.tag,
                    imageProps: p,
                    ref: t.ref
                  });
                }
              );
        }),
        (a.displayName = "LazyImageFull"),
        a
      );
    })(t.Component),
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
    g = function(e) {
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
    h = function(n) {
      var r = n.actual,
        o = n.placeholder,
        a = n.loading,
        u = n.error,
        s = c(n, ["actual", "placeholder", "loading", "error"]);
      return t.createElement(p, i({}, s), function(t) {
        var n = t.imageProps,
          i = t.ref;
        switch (t.imageState) {
          case e.ImageState.NotAsked:
            return !!o && o({ imageProps: n, ref: i });
          case e.ImageState.Loading:
            return a ? a() : !!o && o({ imageProps: n, ref: i });
          case e.ImageState.LoadSuccess:
            return r({ imageProps: n });
          case e.ImageState.LoadError:
            return u ? u() : r({ imageProps: n });
        }
      });
    };
  (h.displayName = "LazyImage"), (e.LazyImage = h), (e.LazyImageFull = p);
});
//# sourceMappingURL=react-lazy-images.umd.js.map
