class Cell {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.isOpen = false;
        this.hasMine = false;
        this.adjacentMines = 0;
        this.isFlagged = false;
        this.createElement();
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.className = "cell";
        this.element.addEventListener("click", () => this.game.openCell(this));
        this.element.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            this.toggleFlag();
        });
        this.game.gridElement.appendChild(this.element);
    }

    open() {
        if (this.isOpen || this.isFlagged) return;
        this.isOpen = true;
        this.element.classList.add("open");

        if (this.hasMine) {
            this.element.classList.add("mine");
            this.game.end(false);
        } else {
            this.element.textContent = this.adjacentMines || "";
            this.game.updateScore(5);
            if (this.adjacentMines === 0) {
                this.game.openAdjacentCells(this);
            }
        }
    }

    toggleFlag() {
        if (!this.isOpen) {
            this.isFlagged = !this.isFlagged;
            this.element.classList.toggle("flag");
        }
    }
}

class Game {
    constructor(size, mineCount, playerName) {
        this.size = size;
        this.mineCount = mineCount;
        this.playerName = playerName;
        this.grid = [];
        this.gridElement = document.querySelector(".grid");
        this.pointsElement = document.getElementById("points");
        this.timerElement = document.getElementById("timer");
        this.resultModal = document.getElementById("end");
        this.resultMessage = document.getElementById("congratulation");
        this.resultPlayerName = document.getElementById("playerName");
        this.resultTime = document.getElementById("endTime");
        this.finalPoints = document.getElementById("finalPoints");
        this.newGameButton = document.getElementById("newGame");
        this.timer = null;
        this.timeLeft = 300;
        this.score = 0;
        this.gameActive = true;
        this.overlay = document.getElementById("overlay");
        this.initialize();
    }

    initialize() {
        this.gridElement.innerHTML = "";
        this.gridElement.classList.remove("inactive");
        this.resultModal.classList.add("d-none");
        this.overlay.classList.add("d-none");
        this.grid = [...Array(this.size)].map((_, x) => [...Array(this.size)].map((_, y) => new Cell(this, x, y)));
        this.placeMines();
        this.startTimer();
    }

    placeMines() {
        let minesPlaced = 0;
        while (minesPlaced < this.mineCount) {
            let x = Math.floor(Math.random() * this.size);
            let y = Math.floor(Math.random() * this.size);
            let cell = this.grid[x][y];
            if (!cell.hasMine) {
                cell.hasMine = true;
                minesPlaced++;
                this.updateNumbersAround(x, y);
            }
        }
    }

    updateNumbersAround(x, y) {
        this.getNeighbors(x, y).forEach(cell => cell.adjacentMines++);
    }

    getNeighbors(x, y) {
        let neighbors = [];
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue;
                let nx = x + dx, ny = y + dy;
                if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size) {
                    neighbors.push(this.grid[nx][ny]);
                }
            }
        }
        return neighbors;
    }

    openCell(cell) {
        if (!this.gameActive || cell.isOpen || cell.isFlagged) return;
        cell.open();
        this.checkWin();
    }

    openAdjacentCells(cell) {
        this.getNeighbors(cell.x, cell.y).forEach(neighbor => {
            if (!neighbor.isOpen && !neighbor.hasMine) {
                neighbor.open();
            }
        });
    }

    checkWin() {
        let totalCells = this.size * this.size;
        let openedCells = this.grid.flat().filter(cell => cell.isOpen).length;
        if (openedCells === totalCells - this.mineCount) {
            this.end(true);
        }
    }

    startTimer() {
        clearInterval(this.timer);
        this.timeLeft = 300;
        this.timer = setInterval(() => {
            if (this.timeLeft <= 0) {
                this.end(false);
                return;
            }
            this.timeLeft--;
            let minutes = Math.floor(this.timeLeft / 60);
            let seconds = this.timeLeft % 60;
            this.timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }, 1000);
    }

    updateScore(points) {
        this.score += points;
        this.pointsElement.textContent = this.score;
    }

    end(isWin) {
        clearInterval(this.timer);
        this.gameActive = false;
        this.gridElement.classList.add("inactive");
        this.resultModal.classList.remove("d-none");
        this.overlay.classList.remove("d-none");
        this.resultPlayerName.textContent = `${this.playerName}`;
        this.resultTime.textContent = `Ваше время: ${this.timerElement.textContent}`;
        this.finalPoints.textContent = this.score;
        this.resultMessage.textContent = isWin ? "Вы выиграли!" : "Вы проиграли!";
    }
}