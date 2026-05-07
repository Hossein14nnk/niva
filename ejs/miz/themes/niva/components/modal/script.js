class Modal {
    constructor() {
        this.initialPositions = new Map()
        this.init()
    }

    init() {
        this.initToggles()
        this.initClose()
    }

    initToggles() {
        document.querySelectorAll(".modal-toggle").forEach(btn => {
            const id = btn.dataset.modalId
            btn.addEventListener("click", () => {
                const modal = document.getElementById(id)
                if (!modal) return
                const modalContent = modal.querySelector(".modal-content")
                const container = modal.closest(".modal-container") || modal

                modal.style.display = "flex"
                modal.classList.remove("hide")
                modal.classList.add("show")

                modalContent.addEventListener("animationend", () => {
                    if (modal.classList.contains("modal-remember-position") && modal.dataset.position) {
                        try {
                            const { top, left } = JSON.parse(modal.dataset.position)
                            modalContent.style.position = "absolute"
                            modalContent.style.top = `${top}px`
                            modalContent.style.left = `${left}px`
                            return
                        } catch (e) { }
                    }

                    if (!this.initialPositions.has(modal)) {
                        const rect = modalContent.getBoundingClientRect()
                        const parentRect = container.getBoundingClientRect()

                        const top = rect.top - parentRect.top
                        const left = rect.left - parentRect.left

                        this.initialPositions.set(modal, { top, left })
                    }

                    const initial = this.initialPositions.get(modal)
                    if (initial) {
                        modalContent.style.position = "absolute"
                        modalContent.style.top = `${initial.top}px`
                        modalContent.style.left = `${initial.left}px`
                    }
                }, { once: true })
            })
        })
    }

    initClose() {
        document.querySelectorAll(".modal-close").forEach(btn => {
            btn.addEventListener("click", () => {
                const modal = btn.closest(".modal-container, .modal-draggable")
                if (!modal) return
                const modalContent = modal.querySelector(".modal-content")

                modal.classList.remove("show")
                modal.classList.add("hide")

                modal.addEventListener("animationend", () => {
                    if (!modal.classList.contains("hide")) return

                    if (!modal.classList.contains("modal-remember-position") && modalContent) {
                        const initial = this.initialPositions.get(modal)
                        if (initial) {
                            modalContent.style.top = `${initial.top}px`
                            modalContent.style.left = `${initial.left}px`
                        }
                    }

                    modal.style.display = "none";
                    modal.classList.remove("hide");
                }, { once: true })
            })
        })
    }
}
new Modal()