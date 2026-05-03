class Quantity {
	constructor(selector, options = {}) {
		this.plusBtns = document.querySelectorAll(".qty-plus");
		this.minusBtns = document.querySelectorAll(".qty-minus");
		if (!this.plusBtns || !this.minusBtns) return;

		this.init();
	}

	init() {
		let self = this;

		this.plusBtns.forEach(function (btn) {
			let valueInput = btn.nextElementSibling;
			let min = valueInput.getAttribute("min");
			valueInput.value = min;
            
			btn.addEventListener("click", () => self.increment(valueInput));
			valueInput.addEventListener("change", () => self.setValue(valueInput));
            valueInput.addEventListener("keydown", function(event){
                if (event.key == "ArrowUp"){
                    self.increment(valueInput);
                }
                else if (event.key == "ArrowDown"){
                    self.decrement(valueInput);
                }
            });
		});

		this.minusBtns.forEach(function (btn) {
			let valueInput = btn.previousElementSibling;
			let min = valueInput.getAttribute("min");
			valueInput.value = min;
			btn.addEventListener("click", () => self.decrement(valueInput));
			valueInput.addEventListener("change", () => self.setValue(valueInput));
		});
	}

	increment(valueInput) {
		let max = valueInput.getAttribute("max");

		if (Number(valueInput.value) < Number(max)) {
			valueInput.value = Number(valueInput.value) + 1;
		}
        // window.addEventListener("keydown", function(event){
        //     if (event.key == ""){

        //     }
        // });
	}

	decrement(valueInput) {
		let min = valueInput.getAttribute("min");

		if (Number(valueInput.value) > Number(min)) {
			valueInput.value = Number(valueInput.value) - 1;
		}
        // window.addEventListener("keydown", function(event){
        //     if (event.key == ""){

        //     }
        // });
	}

    setValue(valueInput){
        let max = Number(valueInput.getAttribute("max"));
		let min = Number(valueInput.getAttribute("min"));
        valueInput.value = Number(valueInput.value);
        
        if (valueInput.value > max){
            valueInput.value = max;
        }
        else if (valueInput.value < min){
            console.log(valueInput.value , min);
            valueInput.value = min;
        }
    }
}

new Quantity(".qty");
