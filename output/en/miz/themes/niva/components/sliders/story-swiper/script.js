document.querySelectorAll(".story-container").forEach((el) => {
  new Swiper(el, {
    loop: true,
    spaceBetween: 0,
    grabCursor: true,

    pagination: {
      el: el.closest(".card-container").querySelector(".swiper-pagination"),
      clickable: true,
      dynamicBullets: true,
    },

    navigation: {
      nextEl: el.closest(".card-container").querySelector(".swiper-button-next"),
      prevEl: el.closest(".card-container").querySelector(".swiper-button-prev"),
    },

    breakpoints: {
      0: { slidesPerView: 6 },
      576: { slidesPerView: 6 },
      768: { slidesPerView: 8 },
      992: { slidesPerView: 8 },
      1200: { slidesPerView: 10 },
      1400: { slidesPerView: 13 },  
    },
  });
});
