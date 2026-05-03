// قبل از init Swiper، المنت رو چک می‌کنیم
const bannerSwiperEl = document.querySelector(".banner-card-content");

if (bannerSwiperEl) {
  new Swiper(".banner-card-content", {
    loop: true,
    spaceBetween: 0,
    grabCursor: true,

    pagination: {
      el: ".swiper-pagination",
      clickable: true, 
      dynamicBullets: true,
    },

    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    }, 

    breakpoints: { 
      1: { slidesPerView: 3 },
      576: { slidesPerView: 4 },
      768: { slidesPerView: 6 },
      992: { slidesPerView: 8 },
      1200: { slidesPerView: 10 },
      1400: { slidesPerView: 12 }  
    },
  });
} else {
  console.warn('Swiper: ".banner-card-content" not found, slider init skipped.');
}