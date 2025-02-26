class Cell {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.isOpen = false;
        this.hasMine = false;
        this.adjacentMines = 0;
        this.createElement();
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.className = "cell";
        this.element.dataset.x = this.x;
        this.element.dataset.y = this.y;
        this.element.addEventListener("click", () => this.game.openCell(this));
        this.element.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            this.game.toggleFlag(this);
        });
        this.game.gridElement.appendChild(this.element);
    }

    open() {
        if (this.isOpen) return;
        this.isOpen = true;
        this.element.classList.add("open");
        if (this.hasMine) {
            this.element.classList.add("mine");
            this.game.end(false);
        } else {
            this.element.textContent = this.adjacentMines > 0 ? this.adjacentMines : '';
            this.game.updateScore(5); // Добавляем 5 очков за открытую клетку
            if (this.adjacentMines === 0) {
                this.game.openAdjacentCells(this);
            }
        }
    }

    toggleFlag() {
        if (!this.isOpen) {
            this.element.classList.toggle("flag");
        }
    }
}

class Game {
    constructor(size, mineCount) {
        this.size = size;
        this.mineCount = mineCount;
        this.grid = [];
        this.gridElement = document.querySelector(".grid");
        this.timerElement = document.getElementById("timer");
        this.pointsElement = document.getElementById("points");
        this.finalPointsElement = document.getElementById("finalPoints");
        this.timer = 0;
        this.startTime = null;
        this.isGameOver = false;
        this.score = 0;
        this.initialize();
    }

    initialize() {
        this.gridElement.innerHTML = '';
        this.grid = Array.from({ length: this.size }, (_, x) =>
            Array.from({ length: this.size }, (_, y) => new Cell(this, x, y))
        );

        this.placeMines();
        this.calculateAdjacentMines();
        this.startTimer();
        this.score = 0; // Сбрасываем очки при новой игре
        this.updatePointsDisplay();
    }

    placeMines() {
        let minesPlaced = 0;
        while (minesPlaced < this.mineCount) {
            const x = Math.floor(Math.random() * this.size);
            const y = Math.floor(Math.random() * this.size);
            const cell = this.grid[x][y];
            if (!cell.hasMine) {
                cell.hasMine = true;
                minesPlaced++;
            }
        }
    }

    calculateAdjacentMines() {
        this.grid.forEach(row => {
            row.forEach(cell => {
                if (cell.hasMine) {
                    this.incrementAdjacentMines(cell);
                }
            });
        });
    }

    incrementAdjacentMines(cell) {
        const directions = [
            { x: -1, y: -1 }, { x: -1, y: 0 }, { x: -1, y: 1 },
            { x: 0, y: -1 },                     { x: 0, y: 1 },
            { x: 1, y: -1 }, { x: 1, y: 0 }, { x: 1, y: 1 }
        ];
        directions.forEach(dir => {
            const newX = cell.x + dir.x;
            const newY = cell.y + dir.y;
            if (this.isInBounds(newX, newY)) {
                this.grid[newX][newY].adjacentMines++;
            }
        });
    }

    isInBounds(x, y) {
        return x >= 0 && x < this.size && y >= 0 && y < this.size;
    }

    openCell(cell) {
        if (this.isGameOver) return;
        cell.open();
        this.updateScore();
    }

    openAdjacentCells(cell) {
        const directions = [
            { x: -1, y: -1 }, { x: -1, y: 0 }, { x: -1, y: 1 },
            { x: 0, y: -1 },                     { x: 0, y: 1 },
            { x: 1, y: -1 }, { x: 1, y: 0 },             { x: 1, y: 1 }
        ];
        directions.forEach(dir => {
            const newX = cell.x + dir.x;
            const newY = cell.y + dir.y;
            if (this.isInBounds(newX, newY)) {
                this.grid[newX][newY].open();
            }
        });
    }

    toggleFlag(cell) {
        cell.toggleFlag();
    }

    startTimer() {
        this.startTime = Date.now();
        this.timer = setInterval(() => {
            if (!this.isGameOver) {
                const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
                this.timerElement.textContent = this.formatTime(elapsed);
            }
        }, 1000);
    }

    end(isWin) {
        this.isGameOver = true;
        clearInterval(this.timer);
        document.getElementById("end").classList.remove('d-none');
        document.getElementById("playerName").textContent = `Поздравляем, ${this.name}!`;
        document.getElementById("endTime").textContent = `Ваше время: ${this.formatTime(Math.floor((Date.now() - this.startTime) / 1000))}`;
        document.getElementById("congratulation").textContent = isWin ? "Вы выиграли!" : "Вы проиграли!";
        this.finalPointsElement.textContent = `${this.score}`; // Отображаем финальные очки
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    updateScore(points = 0) {
        this.score += points;
        this.updatePointsDisplay();
    }

    updatePointsDisplay() {
        this.pointsElement.textContent = `${this.score}`;
    }

    setName(name) {
        this.name = name;
    }
}