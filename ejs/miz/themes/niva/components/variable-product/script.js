class variableProduct {
  constructor() {
    this.variableProducts = document.querySelectorAll('.product-wrapper-sticky');
    this.descriptionHeader = document.querySelector('.description-header');
    
    this.lastScroll = 0;
    this.offset = 100;
    this.init();
  } 

  init() {
    if (this.variableProducts.length === 0 || !this.descriptionHeader) return;
    
    window.addEventListener('scroll', () => this.onScroll());
  }

  onScroll() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    if (currentScroll > this.lastScroll && currentScroll > this.offset) {
      this.hide();
    } else {
      this.show();
    }
    
    this.lastScroll = currentScroll <= 0 ? 0 : currentScroll;
  }

  hide() {
    this.variableProducts.forEach(element => {
      element.style.top = "6rem";
    });
    this.descriptionHeader.style.top = "5.6rem";
  }

  show() {
    this.variableProducts.forEach(element => {
      element.style.top = "10rem";
    });
    this.descriptionHeader.style.top = "9.6rem";
  }
}

new variableProduct();
