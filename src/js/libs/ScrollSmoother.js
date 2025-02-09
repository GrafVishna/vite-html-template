(function () {
    function _defineProperties(e, t) {
        for (var r = 0; r < t.length; r++) {
            var n = t[r]
            n.enumerable = n.enumerable || !1,
                n.configurable = !0,
                "value" in n && (n.writable = !0),
                Object.defineProperty(e, n.key, n)
        }
    }

    function p() {
        return typeof window !== "undefined"
    }

    function q() {
        return P || p() && (P = window.gsap) && P.registerPlugin && P
    }

    var P, k, R, _, C, H, M, A, F, B, I, U
    var ScrollSmoother = (function () {
        function ScrollSmoother(options) {
            k || ScrollSmoother.register(P) || console.warn("Please gsap.registerPlugin(ScrollSmoother)")
            this.init(options)
        }

        ScrollSmoother.register = function register(e) {
            return k || (
                P = e || q(),
                p() && window.document && (
                    R = window,
                    _ = document,
                    C = _.documentElement,
                    H = _.body
                ),
                P && (
                    M = P.utils.toArray,
                    A = P.utils.clamp,
                    I = P.parseEase("expo"),
                    F = P.core.globals().ScrollTrigger,
                    P.core.globals("ScrollSmoother", ScrollSmoother),
                    H && F && (U = F.core._getVelocityProp, k = 1)
                )
            ), k
        }

        var _proto = ScrollSmoother.prototype

        _proto.init = function init(options) {
            this.options = options || {}
            B && B.kill(), B = this
            function ja() {
                return T.update(-g)
            }
            function la() {
                return r.style.overflow = "visible"
            }
            function na(e) {
                var t = e.getTween()
                t && (t.pause(), t._time = t._dur, t._tTime = t._tDur), u = !1, e.animation.progress(e.progress, !0)
            }
            function oa(e, t) {
                (e !== g && !l || t) && (d && (r.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + e + ", 0, 1)"), w = e - g, g = e, F.isUpdating || F.update())
            }
            function pa(e) {
                return arguments.length ? (l && (g = -e), x.y = -e, u = !0, h(e), this) : -g
            }
            function ra(e) {
                v.scrollTop = 0, F.isInViewport(e.target) || e.target === f || this.scrollTo(e.target, !1, "center center"), f = e.target
            }
            function sa(e) {
                var r, n, o, i
                b.forEach(function (t) {
                    r = t.pins, i = t.markers, e.forEach(function (e) {
                        e.trigger !== t.trigger && e.pinnedContainer !== t.trigger || t === e || (n = e.start, o = (n - t.start - t.offset) / t.ratio - (n - t.start), r.forEach(function (e) {
                            return o -= e.distance / t.ratio - e.distance
                        }), e.setPositions(n + o, e.end + o), e.markerStart && i.push(P.quickSetter([e.markerStart, e.markerEnd], "y", "px")), e.pin && 0 < e.end && (o = e.end - e.start, r.push({ start: e.start, end: e.end, distance: o, trig: e }), t.setPositions(t.start, t.end + o), t.vars.onRefresh(t)))
                    })
                })
            }
            function ta() {
                la(), requestAnimationFrame(la), b && (b.forEach(function (e) {
                    var t = e.start, r = e.auto ? Math.min(F.maxScroll(e.scroller), e.end) : t + (e.end - t) / e.ratio, n = (r - e.end) / 2
                    t -= n, r -= n, e.offset = n || 1e-4, e.pins.length = 0, e.setPositions(Math.min(t, r), Math.max(t, r)), e.vars.onRefresh(e)
                }), sa(F.sort())), T.reset()
            }
            function ua() {
                return b && b.forEach(function (e) {
                    return e.vars.onRefresh(e)
                })
            }
            function va() {
                return b && b.forEach(function (e) {
                    return e.vars.onRefreshInit(e)
                }), ua()
            }
            function wa(t, r, n, o) {
                return function () {
                    var e = "function" == typeof r ? r(n, o) : r
                    return e || 0 === e || (e = o.getAttribute("data-" + t) || ("speed" === t ? 1 : 0)), o.setAttribute("data-" + t, e), "auto" === e ? e : parseFloat(e)
                }
            }
            function xa(r, e, t, n) {
                function lb() {
                    e = a(), t = f(), o = parseFloat(e) || 1, c = (s = "auto" === e) ? 0 : .5, l && l.kill(), l = t && P.to(r, { ease: I, overwrite: !1, y: "+=0", duration: t }), i && (i.ratio = o, i.autoSpeed = s)
                }
                function mb() {
                    d.y = h + "px", d.renderTransform(1), lb()
                }
                function qb(e) {
                    if (s) {
                        mb()
                        var t = function _autoDistance(e, t) {
                            var r, n, o = e.parentNode || C, i = e.getBoundingClientRect(), a = o.getBoundingClientRect(), s = a.top - i.top, l = a.bottom - i.bottom, c = (Math.abs(s) > Math.abs(l) ? s : l) / (1 - t), u = -c * t
                            return 0 < c && (u += -(n = .5 == (r = a.height / (R.innerHeight + a.height)) ? 2 * a.height : 2 * Math.min(a.height, -c * r / (2 * r - 1))) / 2, c += n), { change: c, offset: u }
                        }(r, A(0, 1, -e.start / (e.end - e.start)))
                        m = t.change, u = t.offset
                    } else m = (e.end - e.start) * (1 - o), u = 0
                    g.forEach(function (e) {
                        return m -= e.distance * (1 - o)
                    }), e.vars.onUpdate(e), l && l.progress(1)
                }
                var o, i, s, l, c, u, a = wa("speed", e, n, r), f = wa("lag", t, n, r), h = P.getProperty(r, "y"), d = r._gsap, g = [], p = [], m = 0
                return lb(), (1 !== o || s || l) && (qb(i = F.create({
                    trigger: s ? r.parentNode : r, scroller: v, scrub: !0, refreshPriority: -999, onRefreshInit: mb, onRefresh: qb, onKill: function onKill(e) {
                        var t = b.indexOf(e)
                        0 <= t && b.splice(t, 1)
                    }, onUpdate: function onUpdate(e) {
                        var t, r, n, o = h + m * (e.progress - c), i = g.length, a = 0
                        if (e.offset) {
                            if (i) {
                                for (r = -x.y, n = e.end; i--;) {
                                    if ((t = g[i]).trig.isActive || r >= t.start && r <= t.end) return void (l && (t.trig.progress += t.trig.direction < 0 ? .001 : -.001, t.trig.update(0, 0, 1), l.resetTo("y", parseFloat(d.y), -w, !0), S && l.progress(1)))
                                    r > t.end && (a += t.distance), n -= t.distance
                                }
                                o = h + a + m * ((P.utils.clamp(e.start, e.end, r) - e.start - a) / (n - e.start) - c)
                            }
                            o = function _round(e) {
                                return Math.round(1e5 * e) / 1e5 || 0
                            }(o + u), p.length && !s && p.forEach(function (e) {
                                return e(o - a)
                            }), l ? (l.resetTo("y", o, -w, !0), S && l.progress(1)) : (d.y = o + "px", d.renderTransform(1))
                        }
                    }
                })), P.core.getCache(i.trigger).stRevert = va, i.startY = h, i.pins = g, i.markers = p, i.ratio = o, i.autoSpeed = s, r.style.willChange = "transform"), i
            }
            var r, v, t, n, b, i, a, s, l, c, u, f, h = F.getScrollFunc(R), d = 1 === F.isTouch ? !0 === this.options.smoothTouch ? .8 : parseFloat(this.options.smoothTouch) || 0 : 0 === this.options.smooth || !1 === this.options.smooth ? 0 : parseFloat(this.options.smooth) || .8, g = 0, w = 0, S = 1, p = this.options.onUpdate, m = this.options.onStop, T = U(0), x = { y: 0 }
            function refreshHeight() {
                return t = r.clientHeight, r.style.overflow = "visible", H.style.height = t + "px", t - R.innerHeight
            }
            F.addEventListener("refresh", ta), P.delayedCall(.5, function () {
                return S = 0
            }), this.scrollTop = pa, this.scrollTo = function (e, t, r) {
                if (!e) return
                var n = P.utils.clamp(0, F.maxScroll(R), isNaN(e) ? this.offset(e, r) : +e)
                t ? l ? P.to(this, {
                    duration: d,
                    scrollTop: n,
                    overwrite: "auto",
                    ease: I,
                    onComplete: function () {
                        u = false
                    }
                }) : h(n) : pa(n)
            }, this.offset = function (e, t) {
                e = M(e)[0]
                var r, n = P.getProperty(e, "y"), o = F.create({ trigger: e, start: t || "top top" })
                return b && sa([o]), r = o.start, o.kill(!1), P.set(e, { y: n }), r
            }, this.content = function (e) {
                return arguments.length ? (r = M(e || "#smooth-content")[0] || H.children[0], s = r.getAttribute("style") || "", P.set(r, { overflow: "visible", width: "100%" }), this) : r
            }, this.wrapper = function (e) {
                return arguments.length ? (v = M(e || "#smooth-wrapper")[0] || function _wrap(e) {
                    var t = _.createElement("div")
                    return t.classList.add("ScrollSmoother-wrapper"), e.parentNode.insertBefore(t, e), t.appendChild(e), t
                }(r), a = v.getAttribute("style") || "", refreshHeight(), P.set(v, d ? { overflow: "hidden", position: "fixed", height: "100%", width: "100%", top: 0, left: 0, right: 0, bottom: 0 } : { overflow: "visible", position: "relative", width: "100%", height: "auto", top: "auto", bottom: "auto", left: "auto", right: "auto" }), this) : v
            }, this.effects = function (e, t) {
                if (b = b || [], !e) return b.slice(0);
                (e = M(e)).forEach(function (e) {
                    for (var t = b.length; t--;)b[t].trigger === e && (b[t].kill(), b.splice(t, 1))
                })
                t = t || {}
                var r, n, o = t.speed, i = t.lag, a = []
                for (r = 0; r < e.length; r++)(n = xa(e[r], o, i, r)) && a.push(n)
                return b.push.apply(b, a), a
            }, this.content(this.options.content), this.wrapper(this.options.wrapper), this.render = function (e) {
                return oa(e || 0 === e ? e : g)
            }, this.getVelocity = function () {
                return T.getVelocity(-g)
            }, F.scrollerProxy(v, {
                scrollTop: pa, scrollHeight: function scrollHeight() {
                    return H.scrollHeight
                }, fixedMarkers: !1 !== this.options.fixedMarkers && !!d, content: r, getBoundingClientRect: function getBoundingClientRect() {
                    return { top: 0, left: 0, width: R.innerWidth, height: R.innerHeight }
                }
            }), F.defaults({ scroller: v })
            var E = F.getAll().filter(function (e) {
                return e.scroller === R || e.scroller === v
            })
            E.forEach(function (e) {
                return e.revert(!0)
            })
            n = F.create({
                animation: P.to(x, {
                    y: function y() {
                        return R.innerHeight - t
                    }, ease: "none", data: "ScrollSmoother", duration: 100, onUpdate: function onUpdate() {
                        var e = u
                        e && (x.y = g, na(n)), oa(x.y, e), ja(), p && !l && p(this)
                    }
                }), onRefreshInit: function onRefreshInit() {
                    return x.y = 0
                }, id: "ScrollSmoother", scroller: R, invalidateOnRefresh: !0, start: 0, refreshPriority: -9999, end: refreshHeight, onScrubComplete: function onScrubComplete() {
                    T.reset(), m && m(this)
                }, scrub: d || !0, onRefresh: function onRefresh(e) {
                    na(e), oa(x.y)
                }
            }), this.smooth = function (e) {
                return d = e, arguments.length ? n.scrubDuration(e) : n.getTween() ? n.getTween().duration() : 0
            }, n.getTween() && (n.getTween().vars.ease = this.options.ease || I), this.scrollTrigger = n, this.options.effects && this.effects(!0 === this.options.effects ? "[data-speed], [data-lag]" : this.options.effects, {}), E.forEach(function (e) {
                e.vars.scroller = v, e.init(e.vars, e.animation)
            }), this.paused = function (e) {
                return arguments.length ? (!!l !== e && (e ? (n.getTween() && n.getTween().pause(), h(-g), T.reset(), (c = F.normalizeScroll()) && c.disable(), l = F.observe({
                    preventDefault: !0, type: "wheel,touch,scroll", debounce: !1, onChangeY: function onChangeY() {
                        return pa(-g)
                    }
                })) : (l.kill(), l = 0, c && c.enable(), n.progress = (-g - n.start) / (n.end - n.start), na(n))), this) : !!l
            }, this.kill = function () {
                this.paused(!1), na(n), n.kill()
                for (var e = b ? b.length : 0; e--;)b[e].kill()
                F.scrollerProxy(v), F.removeEventListener("refresh", ta), v.style.cssText = a, r.style.cssText = s
                var t = F.defaults({})
                t && t.scroller === v && F.defaults({ scroller: R }), this.observer && F.normalizeScroll(!1), clearInterval(i), B = null, R.removeEventListener("focusin", ra)
            }, this.options.normalizeScroll && (this.observer = F.normalizeScroll({ debounce: !0 })), F.config(this.options), "overscrollBehavior" in R.getComputedStyle(H) && P.set(H, { overscrollBehavior: "none" }), R.addEventListener("focusin", ra), i = setInterval(ja, 250), "loading" === _.readyState || requestAnimationFrame(function () {
                return F.refresh()
            })
        }
        return ScrollSmoother
    }())

    ScrollSmoother.version = "3.12.2"

    ScrollSmoother.create = function (options) {
        return B && options && B.content() === M(options.content)[0] ? B : new ScrollSmoother(options)
    }

    ScrollSmoother.get = function () {
        return B
    }

    q() && P.registerPlugin(ScrollSmoother)
    window.ScrollSmoother = ScrollSmoother

})()

export default ScrollSmoother