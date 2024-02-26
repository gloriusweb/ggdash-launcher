const updateData = async () => {
    const element = document.getElementById("data");
    element.textContent = "Loading GDPS Stats...";
    const response = await fetch("https://api.fruitspace.one/v1/repatch/getserverinfo?id=001X");
    const data = await response.json();
    const { players, levels } = data;
    element.textContent = `${players} players • ${levels} levels`;
};

updateData().then(() => {
    setInterval(updateData, 30000);
});


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

const { ipcRenderer } = require('electron');
const {send} = require("discord-rpc/src/transports/ipc");

ipcRenderer.on('game-exists', () => {
    document.querySelector('.download-btn').textContent = 'Open';
    document.querySelector('.download-btn').addEventListener('click', function() {
        ipcRenderer.send('open-file');
    });
});

ipcRenderer.on('game-not-exists', () => {
    document.querySelector('.download-btn').textContent = 'Download';
    document.querySelector('.download-btn').addEventListener('click', function() {
        const fileUrl = 'https://www.dropbox.com/scl/fi/yzhxymru0t9kfwgd7dfrk/GGDash.zip?rlkey=i67tabdp7d5306iei7oun5nkm&dl=1';
        const filePath = 'GGDash.zip';

        ipcRenderer.send('download-file', fileUrl, filePath);

        ipcRenderer.on('download-progress', (event, progress) => {
            document.querySelector('.download-btn').textContent = `Downloading... ${progress}%`;
        });

        ipcRenderer.on('download-complete', () => {
            document.querySelector('.download-btn').textContent = 'Open';
            document.querySelector('.download-btn').addEventListener('click', function() {
                ipcRenderer.send('open-file');
            });
        });

        ipcRenderer.on('download-error', (event, error) => {
            console.error(error);
        });
    });
});