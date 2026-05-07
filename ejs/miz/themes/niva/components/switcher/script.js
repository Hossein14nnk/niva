class Switcher {
    constructor() {
        const switchers = document.querySelectorAll(".switcher");
        if (!switchers.length) return;
        switchers.forEach((switcher) => {
            switcher.addEventListener("click", () => {
                switcher.classList.toggle("active");
            });
        });
    }
}

new Switcher();

