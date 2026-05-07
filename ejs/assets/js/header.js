let searchBox = document.querySelector("header #searchBox");
let searchInput = searchBox.querySelector("#search");
let backdrop = document.querySelector("header #searchBox ~ .backdrop");

searchInput.addEventListener("click" , function (event){
    if (searchInput !== event.target) return;
    searchBox.classList.add("active");
    console.log("click")

    backdrop.addEventListener("click" , function (){
        searchBox.classList.remove("active");
    });

    window.addEventListener("keydown" , function (event){
        if (event.key === "Escape"){
            searchBox.classList.remove("active");
        }
    });
});