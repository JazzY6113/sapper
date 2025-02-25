let name = '';
let game = null;

document.getElementById("startGame").addEventListener("click", (e) => {
    e.preventDefault();
    name = document.getElementById("nameInput").value.trim();
    if (name) {
        game = new Game(10, 10); // 10x10 grid with 10 mines
        game.setName(name);
        go('game', 'd-block');
    }
});

document.getElementById("restart").addEventListener("click", () => {
    go('start', 'd-flex');
    document.getElementById("end").classList.add('d-none');
});

function go(page, attribute) {
    const pages = ['start', 'game', 'end'];
    pages.forEach(el => {
        document.getElementById(el).classList.toggle('d-none', el !== page);
    });

    if (page === 'game') {
        // Сбросить состояние игры, если это новая игра
        if (game) {
            game.initialize();
        }
    }
}

window.onload = () => {
    document.getElementById("nameInput").addEventListener("input", checkName);
};

function checkName() {
    const nameInput = document.getElementById("nameInput").value.trim();
    const startButton = document.getElementById("startGame");
    if (nameInput !== '') {
        startButton.removeAttribute('disabled');
    } else {
        startButton.setAttribute('disabled', 'disabled');
    }
}