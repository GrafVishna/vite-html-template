import gsap from "gsap"
// Import modules
import ScrollTrigger from "gsap/ScrollTrigger.js"
import { Observer } from "gsap/Observer"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import horizontalLoop from "./horizonta-loop.js"
import ScrollSmoother from "./ScrollSmoother.js"

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin, Observer)

class ScrollAnimations {
   constructor(selectors) {
      this.selectors = {
         marqueeTextSelector: '.marquee-text',
         showElSelector: '[data-show]',
         anchorSelector: '.ancor',
         parallaxSelector: '[data-parallax]',
         ...selectors
      }
      this.loops = []
      this.init()
   }

   init() {
      this.initScrollSmoother()
      this.initMarqueeText(this.selectors.marqueeTextSelector)
      this.initShowBlock(this.selectors.showElSelector)
      this.initParallax(this.selectors.parallaxSelector)
      this.scrollToBlock(this.selectors.anchorSelector)

      screen.orientation.addEventListener("change", () => this.refresh())
      window.addEventListener("load", () => this.initStartScroll())
   }

   refresh() {
      clearTimeout(this.resizeTimeout)
      this.resizeTimeout = setTimeout(() => {
         ScrollTrigger.refresh()
      }, 300)
   }

   initScrollSmoother() {
      const isSm0oth = document.querySelector("[data-smooth-speed]")
      const smoothSpeed = parseFloat(isSm0oth?.getAttribute("data-smooth-speed")) || 0
      if (smoothSpeed > 0) {
         if (window.ScrollSmoother && window.innerWidth >= 1024) {
            if (!ScrollSmoother.get()) {
               ScrollSmoother.create({
                  wrapper: ".smooth-wrapper",
                  content: ".smooth-content",
                  smooth: smoothSpeed,
                  effects: true,
               })
            }
            this.refresh()
         } else if (ScrollSmoother.get()) {
            ScrollSmoother.get().kill()
         }
      }
   }

   initShowBlock(selector) {
      const showElements = document.querySelectorAll(selector)
      if (!showElements.length) return

      gsap.utils.toArray(showElements).forEach((showElement) => {
         gsap.from(showElement, {
            scrollTrigger: {
               trigger: showElement,
               scrub: 1,
               start: "top 100%",
               end: "50% 50%",
               toggleActions: "restart pause reverse pause",
               markers: false,
            },
            opacity: 0,
            y: 70,
         })
      })
   }

   initParallax(selector) {
      gsap.utils.toArray(selector).forEach((container) => {
         const image = container.querySelector("img")
         if (image) {
            gsap.to(image, {
               y: () => image.offsetHeight - container.offsetHeight,
               ease: "none",
               scrollTrigger: {
                  trigger: container,
                  scrub: true,
                  pin: false,
                  markers: false,
                  invalidateOnRefresh: true,
               },
            })
         }
      })
   }

   initMarqueeText(selector) {
      const speed = 2.5
      const marqueeText = document.querySelectorAll(selector)
      if (!marqueeText.length) return

      marqueeText.forEach((el) => {
         const loop = horizontalLoop(el, {
            repeat: -1,
            speed: 1.5,
            paddingRight: 10,
         })
         this.loops.push(loop)

         let tl
         Observer.create({
            target: window,
            type: "wheel",
            onChangeY: (self) => {
               if (tl) tl.kill()
               const factor = self.deltaY > 0 ? 1 : -1
               tl = gsap
                  .timeline()
                  .to(loop, { timeScale: speed * factor, duration: 0.25 })
                  .to(loop, { timeScale: 1 * factor, duration: 1 })
            },
         })
      })
   }

   scrollToBlock() {
      document.addEventListener("click", (e) => {
         if (!ScrollSmoother.get()) return

         const targetElement = e.target.closest('a[href]')
         if (!targetElement) return

         const href = targetElement.getAttribute('href')
         const url = new URL(href, window.location.origin)

         // Internal links with #
         if (href.startsWith('#')) {
            e.preventDefault()
            const target = document.querySelector(href)
            if (target) {
               ScrollSmoother.get().scrollTo(target, true, "top top")
            }
            return
         }

         // Internal pages with #
         if (url.origin === window.location.origin && url.pathname === window.location.pathname && url.hash) {
            e.preventDefault()
            const target = document.querySelector(url.hash)
            if (target) {
               ScrollSmoother.get().scrollTo(target, true, "top top")
            }
            return
         }

         // Other links from #
         if (url.hash) {
            e.preventDefault()
            window.location.href = href
         }
      })
   }

   initStartScroll() {
      if (window.loadingHash) {
         const hash = window.loadingHash
         const targetElement = document.querySelector(hash)
         if (targetElement) {
            ScrollSmoother.get() ? gsapScroll(hash) : defaultScroll(hash)
         }
      }

      function gsapScroll(hash) {
         setTimeout(() => {
            ScrollSmoother.get().scrollTo(hash, true, "top top")
         }, 200)
      }

      function defaultScroll(hash) {
         const element = document.querySelector(hash)
         const offset = 0
         const elementPosition = element.getBoundingClientRect().top
         const offsetPosition = elementPosition + window.scrollY - offset

         window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
         })
      }
   }
}

document.addEventListener("DOMContentLoaded", () => {
   const templateScrollAnimations = new ScrollAnimations()
})
