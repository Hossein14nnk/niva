class SortBy {
    static initAll() {
        document.querySelectorAll('.sort-by').forEach(el => {
            new SortBy(el);
        });
    }

    constructor(container) {
        this.container = container;
        this.items = container.querySelectorAll('li');
        this.activeClass = 'active';

        this.bind();
    }

    bind() {
        this.items.forEach(item => {
            item.addEventListener('click', () => {
                this.items.forEach(i =>
                    i.classList.remove(this.activeClass)
                );
                item.classList.add(this.activeClass);
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    SortBy.initAll();
});
 