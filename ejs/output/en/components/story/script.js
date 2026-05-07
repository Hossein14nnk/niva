new LikeBtn(".story-content .like-story");

class StoryTimeLine {
    constructor() {
            const slider = document.querySelectorAll(".story-modal .slider");

            slider.forEach((slid) => {

            const timer = slid.dataset.sliderTimer;
            if (timer) {
                slid.style.setProperty('--timer-time-line', `${timer}s`);
            }
        });
    }
}

new StoryTimeLine();