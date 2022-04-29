import Swiper, { Navigation, Pagination } from 'swiper';

const swiper = new Swiper('.swiper', {
    modules: [Navigation, Pagination],
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
  });
