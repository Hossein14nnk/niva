class CommentLike {
  constructor(element) {
    this.container = element;

    this.positiveBtn = this.container.querySelector(".positive");
    this.negativeBtn = this.container.querySelector(".negative");

    this.positiveCountEl = this.positiveBtn.querySelector(".count");
    this.negativeCountEl = this.negativeBtn.querySelector(".count");

    this.positiveCount = parseInt(this.positiveCountEl.textContent);
    this.negativeCount = parseInt(this.negativeCountEl.textContent);

    this.state = null;

    this.init();
  }

  init() {
    this.positiveBtn.addEventListener("click", () => this.handleClick("positive"));
    this.negativeBtn.addEventListener("click", () => this.handleClick("negative"));
  }

  handleClick(type) {
    if (this.state === type) {
      this.removeVote(type);
      this.resetStyles();
      this.state = null;
    } else {
      if (this.state) {
        this.removeVote(this.state);
      }

      this.resetStyles();
      this.addVote(type);
      this.applyStyle(type);
      this.state = type;
    }
  }

  addVote(type) {
    if (type === "positive") {
      this.positiveCount++;
      this.positiveCountEl.textContent = this.positiveCount;
    } else {
      this.negativeCount++;
      this.negativeCountEl.textContent = this.negativeCount;
    }
  }

  removeVote(type) {
    if (type === "positive") {
      this.positiveCount--;
      this.positiveCountEl.textContent = this.positiveCount;
    } else {
      this.negativeCount--;
      this.negativeCountEl.textContent = this.negativeCount;
    }
  }

  applyStyle(type) {
    if (type === "positive") {
      this.positiveBtn.classList.add("active");
    } else {
      this.negativeBtn.classList.add("active");
    }
  }

  resetStyles() {
    this.positiveBtn.classList.remove("active");
    this.negativeBtn.classList.remove("active");
  }
}
document.querySelectorAll(".like-box").forEach(box => {
  new CommentLike(box);
});