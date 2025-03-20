/*
Slider Documentation: https://swiperjs.com/
*/
import Swiper from 'swiper'

// Base styles ====================================================================================

// Modules: =======================================================================================
// Navigation, Pagination, Autoplay, EffectFade, Lazy, Manipulation

import { EffectFade, Thumbs } from 'swiper/modules'

//=================================================================================================

function initSliders() {
  if (document.querySelector('.test__slider')) {
    productSlider = new Swiper('.test__slider', {
      modules: [Thumbs, EffectFade],
      spaceBetween: 0,
      slidesPerView: 1,
      freeMode: true,
      loop: false,
      speed: 500,
      effect: 'fade',
    })
  }
}

window.addEventListener('load', function () {
  initSliders()
})
