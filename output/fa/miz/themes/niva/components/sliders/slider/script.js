class Slider {
    constructor(selector = ".slider") {
        this.instances = [];
        document.querySelectorAll(selector).forEach(slider => {
            this.instances.push(this.createInstance(slider));
        });
    }

    createInstance(slider) {
        const instance = {
            container: slider,
            wrapper: slider.querySelector(".slider-wrapper"),
            track: slider.querySelector(".slider-container"),
            slides: Array.from(slider.querySelectorAll(".slider-content")),
            toggles: slider.querySelectorAll(".slider-toggle"),
            nextArrows: slider.querySelectorAll(".slider-arrow-next"),
            prevArrows: slider.querySelectorAll(".slider-arrow-prev"),

            current: 0,
            startX: 0,
            startY: 0,
            isDragging: false,
            autoplayTimer: null,
            pointerId: null,

            clickStartX: 0,
            clickStartY: 0,

            isVertical: false,
            isLoop: false,
            isDraggable: false,
            isRTL: false,
            autoplayDelay: null,

            init() {
                this.isVertical = this.container.classList.contains("slider-column");
                this.isLoop = this.container.classList.contains("slider-loop");
                this.isDraggable = this.container.classList.contains("slider-draggable");
                this.isRTL = getComputedStyle(this.container).direction === "rtl";

                this.autoplayDelay = this.container.dataset.sliderTimer ? parseInt(this.container.dataset.sliderTimer) : null;

                const activeIndex = this.slides.findIndex(s => s.classList.contains("active"));
                this.current = activeIndex >= 0 ? activeIndex : 0;

                this.bindEvents();
                this.update();
                this.initAutoplay();
            },

            /* ---------- core ---------- */
            update() {
                let value = this.current * 100;
                if (this.isVertical || !this.isRTL) value *= -1;

                this.track.style.transform = this.isVertical
                    ? `translateY(${value}%)`
                    : `translateX(${value}%)`;

                this.slides.forEach(s => s.classList.remove("active"));
                if(this.slides[this.current]) this.slides[this.current].classList.add("active");

                this.toggles.forEach(t => t.classList.remove("active"));
                const t = this.container.querySelector(`.slider-toggle[data-slider-id="${this.slides[this.current]?.id}"]`);
                t?.classList.add("active");

                this.updateArrows();
            },

            updateArrows() {
                if (!this.prevArrows || !this.nextArrows || this.isLoop) return;

                this.prevArrows.forEach(prevArrow => {
                    prevArrow.classList.toggle("disabled", this.current === 0);
                });
                this.nextArrows.forEach(nextArrow => {
                    nextArrow.classList.toggle("disabled", this.current === this.slides.length - 1);
                });
            },

            next() {
                if (this.current < this.slides.length - 1) this.current++;
                else if (this.isLoop) this.current = 0;
                this.update();
            },
            prev() {
                if (this.current > 0) this.current--;
                else if (this.isLoop) this.current = this.slides.length - 1;
                this.update();
            },

            goTo(target) {
                if (typeof target === "number") {
                    this.current = target;
                } else {
                    const slide = document.getElementById(target);
                    this.current = this.slides.indexOf(slide);
                }
                this.update();
            },

            /* ---------- drag / touch ---------- */
            onStart(e) {
                e.preventDefault(); 
                
                this.isDragging = true;
                this.pointerId = e.pointerId;
                
                this.startX = e.clientX;
                this.startY = e.clientY;
                this.clickStartX = e.clientX;
                this.clickStartY = e.clientY;

                this.track.style.transition = "none";
                this.wrapper.classList.add("dragging");

                this.wrapper.setPointerCapture(e.pointerId);

                this.slides.forEach(s => {
                    s.querySelectorAll("img").forEach(img => img.setAttribute("draggable", "false"));
                });

                this.stopAutoplay();
            },

            onMove(e) {
                if (!this.isDragging) return;
                e.preventDefault();

                let diff;
                if (this.isVertical) {
                    diff = this.startY - e.clientY;
                    this.track.style.transform = `translateY(calc(${this.current * -100}% - ${diff}px))`;
                } else {
                    diff = this.startX - e.clientX;
                    const sign = this.isRTL ? -1 : 1;
                    this.track.style.transform = `translateX(calc(${this.current * -100 * sign}% - ${diff}px))`;
                }
            },

            onEnd(e) {
                if (!this.isDragging) return;

                this.wrapper.releasePointerCapture(e.pointerId);

                let diff;
                if (this.isVertical) {
                    diff = this.startY - e.clientY;
                } else {
                    diff = this.startX - e.clientX;
                }

                const moveDist = Math.hypot(e.clientX - this.clickStartX, e.clientY - this.clickStartY);
                const isClick = moveDist < 5;

                this.track.style.transition = "";
                this.isDragging = false;
                this.wrapper.classList.remove("dragging");

                this.slides.forEach(s => {
                    s.querySelectorAll("img").forEach(img => img.setAttribute("draggable", "true"));
                });

                if (Math.abs(diff) > 50) {
                    let sign;
                    this.isRTL || this.isVertical ? sign = diff < 0 : sign = diff > 0;
                    sign ? this.next() : this.prev();
                } else {
                    this.update();
                }

                this.initAutoplay();
                
                if (isClick) {
                    const target = document.elementFromPoint(e.clientX, e.clientY);
                    if (target) {
                        const clickEvent = new MouseEvent('click', {
                            view: window,
                            bubbles: true,
                            cancelable: true
                        });
                        target.dispatchEvent(clickEvent);
                    }
                }
            },

            /* ---------- autoplay ---------- */
            initAutoplay() {
                if (!this.autoplayDelay) return;
                this.stopAutoplay();
                this.autoplayTimer = setInterval(() => this.next(), this.autoplayDelay * 1000);
            },

            stopAutoplay() {
                if (this.autoplayTimer) clearInterval(this.autoplayTimer);
            },

            /* ---------- events ---------- */
            bindEvents() {
                this.nextArrows.forEach(nextArrow => {
                    nextArrow?.addEventListener("click", () => this.next());
                });
                this.prevArrows.forEach(prevArrow => {
                    prevArrow?.addEventListener("click", () => this.prev());
                });

                this.toggles.forEach(toggle => {
                    toggle.addEventListener("click", () =>
                        this.goTo(toggle.dataset.sliderId)
                    );
                });

                if (this.isDraggable){
                    this.wrapper.addEventListener("pointerdown", (e) => this.onStart(e));
                    this.wrapper.addEventListener("pointermove", (e) => this.onMove(e));
                    this.wrapper.addEventListener("pointerup", (e) => this.onEnd(e));
                    this.wrapper.addEventListener("pointercancel", (e) => this.onEnd(e));
                }

                this.container.addEventListener("focus" , () => {
                    window.addEventListener("keydown", e => {
                        if (e.key === "ArrowRight") this.isRTL ? this.prev() : this.next();
                        if (e.key === "ArrowLeft") this.isRTL ? this.next() : this.prev();
                    });
                });
            },

            /* ---------- public api ---------- */
            getCurrentIndex() {
                return this.current;
            },

            getCurrentSlide() {
                return this.slides[this.current];
            },

            destroy() {
                this.stopAutoplay();
                this.track.style.transform = "";
            }
        };

        instance.init();
        return instance;
    }

    /* global api */
    next() {
        this.instances.forEach(i => i.next());
    }
    prev() {
        this.instances.forEach(i => i.prev());
    }
    goTo(v) {
        this.instances.forEach(i => i.goTo(v));
    }
}

new Slider();