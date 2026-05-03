class DualRangeSlider {
    constructor(config = {}) {
        this.settings = {
            locale: config.locale || 'en',
            selectors: {
                rangeSlider: config.selectors?.rangeSlider || '.range-slider',
                inputMin: config.selectors?.inputMin || '.range-slider .range-wrapper .range-min',
                inputMax: config.selectors?.inputMax || '.range-slider .range-wrapper .range-max',
                displayMin: config.selectors?.displayMin || '.range-slider .values .value-min',
                displayMax: config.selectors?.displayMax || '.range-slider .values .value-max',
                progressBar: config.selectors?.progressBar || '.range-slider .range-progress'
            }
        };

        this.elements = this._initElements();
        if (!this._validateElements()) return;

        const dataGap = this.elements.rangeSlider?.dataset.rangeSliderGap;
        this.settings.minGap = dataGap ? parseInt(dataGap) : (config.minGap || 0);
        this.handleSliderInput = this.handleSliderInput.bind(this);
        this.handleTextInput = this.handleTextInput.bind(this);
        this.handleTextBlur = this.handleTextBlur.bind(this);
        
        this.init();
    }

    _initElements() {
        const s = this.settings.selectors;
        return {
            rangeSlider: document.querySelector(s.rangeSlider),
            inputMin: document.querySelector(s.inputMin),
            inputMax: document.querySelector(s.inputMax),
            displayMin: document.querySelector(s.displayMin),
            displayMax: document.querySelector(s.displayMax),
            progressBar: document.querySelector(s.progressBar)
        };
    }

    _validateElements() {
    const missing = Object.values(this.elements).filter(el => el === null);

    if (missing.length > 0) {
        console.warn('DualRangeSlider: Some elements were not found.', missing);
        // به جای خطا، فقط این متد رو رد می‌کنیم
        return false;
    }

    return true;
}

    init() {
        this.elements.inputMin.addEventListener('input', this.handleSliderInput);
        this.elements.inputMax.addEventListener('input', this.handleSliderInput);
        
        this.elements.displayMin.addEventListener('input', this.handleTextInput);
        this.elements.displayMax.addEventListener('input', this.handleTextInput);
        
        this.elements.displayMin.addEventListener('blur', this.handleTextBlur);
        this.elements.displayMax.addEventListener('blur', this.handleTextBlur);

        this.updateUI();
    }

    handleSliderInput(e) {
        this._enforceGapConstraint(e.target);
        this.updateUI();
    }

    handleTextInput(e) {
        const target = e.target;
        const rawValue = target.value.replace(/[^0-9]/g, '');
        let val = parseInt(rawValue);
        
        if (isNaN(val)) return;

        const isMin = target === this.elements.displayMin;
        const sliderToUpdate = isMin ? this.elements.inputMin : this.elements.inputMax;
        const otherSlider = isMin ? this.elements.inputMax : this.elements.inputMin;
        
        const maxVal = parseInt(sliderToUpdate.max);
        const minVal = parseInt(sliderToUpdate.min);
        const gap = this.settings.minGap;

        let finalVal = Math.max(minVal, Math.min(maxVal, val));

        if (isMin) {
            if (finalVal > parseInt(otherSlider.value) - gap) {
                finalVal = parseInt(otherSlider.value) - gap;
            }
        } else {
            if (finalVal < parseInt(otherSlider.value) + gap) {
                finalVal = parseInt(otherSlider.value) + gap;
            }
        }

        sliderToUpdate.value = finalVal;
        this._updateProgressBar();
        target.value = this._formatNumber(finalVal);
    }

    handleTextBlur(e) {
        const target = e.target;
        const sliderVal = parseInt(target === this.elements.displayMin ? this.elements.inputMin.value : this.elements.inputMax.value);
        target.value = this._formatNumber(sliderVal);
    }

    _enforceGapConstraint(activeInput) {
        let val1 = parseInt(this.elements.inputMin.value);
        let val2 = parseInt(this.elements.inputMax.value);
        const gap = this.settings.minGap;

        if (val2 - val1 < gap) {
            if (activeInput === this.elements.inputMin) {
                this.elements.inputMin.value = val2 - gap;
            } else {
                this.elements.inputMax.value = val1 + gap;
            }
        }
    }

    updateUI() {
        const val1 = parseInt(this.elements.inputMin.value);
        const val2 = parseInt(this.elements.inputMax.value);

        const isMinFocused = document.activeElement === this.elements.displayMin;
        const isMaxFocused = document.activeElement === this.elements.displayMax;

        if (!isMinFocused) {
            this.elements.displayMin.value = this._formatNumber(val1);
        }
        if (!isMaxFocused) {
            this.elements.displayMax.value = this._formatNumber(val2);
        }

        this._updateProgressBar();
    }

    _updateProgressBar() {
        const val1 = parseInt(this.elements.inputMin.value);
        const val2 = parseInt(this.elements.inputMax.value);
        const percent1 = (val1 / this.elements.inputMin.max) * 100;
        const percent2 = (val2 / this.elements.inputMax.max) * 100;

        this.elements.progressBar.style.left = percent1 + "%";
        this.elements.progressBar.style.width = (percent2 - percent1) + "%";
    }

    _formatNumber(num) {
        let formatted = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        if (this.settings.locale === 'fa') {
            const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
            formatted = formatted.replace(/\d/g, x => farsiDigits[x]);
        }

        return formatted;
    }
}

new DualRangeSlider({locale: 'en'});