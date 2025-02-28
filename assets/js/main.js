document.addEventListener("DOMContentLoaded", () => {
    let game = null;

    const startButton = document.getElementById("startGame");
    if (startButton) {
        startButton.addEventListener("click", (e) => {
            e.preventDefault();
            const playerName = document.getElementById("nameInput").value.trim();
            if (playerName) {
                game = new Game(10, 10, playerName);
                document.getElementById("name").textContent = playerName;
                go("game");
            }
        });
    }

    const restartButton = document.getElementById("restart");
    if (restartButton) {
        restartButton.addEventListener("click", () => {
            document.getElementById("timer").textContent = "00:00";
            document.getElementById("points").textContent = "0";
            go("start");
        });
    }

    const startGameFromRulesButton = document.getElementById("startGameFromRules");
    if (startGameFromRulesButton) {
        startGameFromRulesButton.addEventListener("click", () => {
            const playerName = prompt("Введите ваше имя:");
            if (playerName) {
                game = new Game(10, 10, playerName);
                go("game");
            }
        });
    }

    const nameInput = document.getElementById("nameInput");
    if (nameInput) {
        nameInput.addEventListener("input", function() {
            startButton.disabled = !this.value.trim();
        });
    }

    function go(page) {
        const pages = ["start", "game", "end"];
        pages.forEach(el => {
            document.getElementById(el).classList.toggle("d-none", el !== page);
        });
        if (page === "game" && game) game.initialize();
    }
});