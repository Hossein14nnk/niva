let featureDescriptionBoxes = document.querySelectorAll(".feature-description-box");

featureDescriptionBoxes.forEach(featureDescriptionBox => {
    let description = featureDescriptionBox.querySelector(".description");
    description.addEventListener("click", () => {
        description.classList.remove("ellipsis-4");
    });
});