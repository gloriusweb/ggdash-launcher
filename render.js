let buttons = document.getElementsByClassName("btn");
for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function() {
        let activeButton = document.querySelector(".btn-active");
        activeButton.classList.remove("btn-active");
        this.classList.add("btn-active");
    });
}