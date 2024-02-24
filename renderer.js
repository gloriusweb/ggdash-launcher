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


if (!localStorage.players || !localStorage.levels) {
    fetch('https://gofruit.space/gdps/001X')
        .then(response => response.text())
        .then(data => {
            const players = data.match(/(\d+) players/)[1];
            const levels = data.match(/(\d+) levels/)[1];

            localStorage.setItem('players', players);
            localStorage.setItem('levels', levels);

            const subtitleElement = document.getElementById('data');
            subtitleElement.innerText = `${players} players • ${levels} levels`;
        })
        .catch(error => console.error('Error:', error));
} else {
    const subtitleElement = document.getElementById('data');
    subtitleElement.innerText = `${localStorage.players} players • ${localStorage.levels} levels`;
}