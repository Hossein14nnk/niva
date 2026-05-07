class StarsFull {
    constructor(){
        const stars = document.querySelectorAll('.stars-full');
        stars.forEach((star) => {
          const dataStar = star.dataset.starsWidth;
          star.style.width = dataStar;
        });
    }
}
new StarsFull();