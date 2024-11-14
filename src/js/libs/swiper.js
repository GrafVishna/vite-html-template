/*
Slider Documentation: https://swiperjs.com/
*/
import Swiper from 'swiper';

// Base styles ====================================================================================

// Modules: =======================================================================================
// Navigation, Pagination, Autoplay, EffectFade, Lazy, Manipulation

import { EffectFade, Thumbs } from 'swiper/modules';

//=================================================================================================

function initSliders() {
  let productSliderThumbs;
  if (document.querySelector('.single-product-thumbnails')) {
    productSliderThumbs = new Swiper('.single-product-thumbnails', {
      spaceBetween: 0,
      slidesPerView: 'auto',
      speed: 500,
    });
  }
  let productSlider;
  if (document.querySelector('.single-product-slider')) {
    productSlider = new Swiper('.single-product-slider', {
      modules: [Thumbs, EffectFade],
      spaceBetween: 0,
      slidesPerView: 'auto',
      freeMode: true,
      loop: false,
      speed: 500,
      effect: 'fade',
      thumbs: {
        swiper: productSliderThumbs,
      },
    });
  }
}
window.addEventListener('load', function () {
  initSliders();
});
