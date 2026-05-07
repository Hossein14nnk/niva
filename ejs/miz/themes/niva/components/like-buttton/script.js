class LikeBtn {
    constructor(selector, options = {}) {
        const containers = document.querySelectorAll(selector);
        if (!containers.length) return;

        containers.forEach((item) => {
            const countEl = item.querySelector(".count");
            if (!countEl) return;

            let value = parseInt(countEl.textContent) || 0;

            item.addEventListener("click", () => {
                const isActive = item.classList.contains("active");

                if (isActive) {
                    value--;
                    item.classList.remove("active");
                } else {
                    value++;
                    item.classList.add("active");
                }
                countEl.textContent = value;
            });
        });
    }
}

new LikeBtn(".like-comment");