let btns = document.getElementsByClassName("btn");
let contents = document.getElementsByClassName("content");

btns[0].classList.add("active");
contents[0].classList.add("active");

for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function() {
        for (let j = 0; j < btns.length; j++) {
            btns[j].classList.remove("active");
            contents[j].classList.remove("active");
        }
        this.classList.add("active");
        let id = this.id.slice(-1); // Получаем номер кнопки из ее id
        document.getElementById("content" + id).classList.add("active");
    });
}