document.querySelectorAll(".card-content").forEach((el) => {
  new Swiper(el, {
    loop: true,
    spaceBetween: 32,
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
      0: { slidesPerView: 1 },
      576: { slidesPerView: 2 },
      768: { slidesPerView: 3 },
      992: { slidesPerView: 3 },
      1200: { slidesPerView: 4 },
      1400: { slidesPerView: 4 },
    },
  });
});
