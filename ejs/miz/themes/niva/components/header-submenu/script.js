let headerContainer = document.querySelector("header .container");
if(headerContainer){
  let height = headerContainer.querySelector(".primary-part").offsetHeight + "px";
  headerContainer.style.setProperty("--height-primary-part", height);
}

class ScrollHeader {
  constructor() {
    this.header = document.querySelector('header .secondary-part');
    this.lastScroll = 0;
    this.offset = 100;
    this.init();
  }

  init() {
    if (!this.header) return;
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
    this.header.classList.add('hide-submenu');
  }

  show() {
    this.header.classList.remove('hide-submenu');
  }
}
new ScrollHeader();