class ButtonDate {
    constructor (){
        const choices = document.querySelectorAll(".choices");
        choices.forEach(choice => {
            const btnDates = choice.querySelectorAll(".button-date");

            btnDates.forEach(btnDate => {
                btnDate.addEventListener("click", () => {
                    btnDates.forEach(btnDateDelActive => {
                        btnDateDelActive.classList.remove("active");
                        btnDate.classList.add("active");
                    });
                });
            });
        });
    }
}
new ButtonDate();