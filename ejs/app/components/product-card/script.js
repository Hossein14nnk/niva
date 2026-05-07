document.addEventListener('DOMContentLoaded', () => {
    const cartLikeBtn = document.querySelectorAll('.feature.checkpay');

    cartLikeBtn.forEach(item => {
        item.addEventListener('click', () => {
          item.classList.toggle('active');
        });
    });
  
});