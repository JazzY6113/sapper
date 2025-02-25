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
        this.timer = 0;
        this.startTime = null;
        this.isGameOver = false;
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
                if (cell.hasMine) return;
                const adjacentCells = this.getAdjacentCells(cell);
                cell.adjacentMines = adjacentCells.filter(c => c.hasMine).length;
            });
        });
    }

    getAdjacentCells(cell) {
        const { x, y } = cell;
        const adjacentCells = [];
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue; // Пропускаем саму клетку
                const newX = x + i;
                const newY = y + j;
                if (newX >= 0 && newX < this.size && newY >= 0 && newY < this.size) {
                    adjacentCells.push(this.grid[newX][newY]);
                }
            }
        }
        return adjacentCells;
    }

    openCell(cell) {
        if (this.isGameOver) return;
        cell.open();
        if (this.checkWin()) {
            this.end(true);
        }
    }

    openAdjacentCells(cell) {
        const adjacentCells = this.getAdjacentCells(cell);
        adjacentCells.forEach(adjCell => {
            if (!adjCell.isOpen) {
                adjCell.open();
                if (adjCell.adjacentMines === 0) {
                    this.openAdjacentCells(adjCell);
                }
            }
        });
    }

    toggleFlag(cell) {
        if (this.isGameOver) return;
        cell.toggleFlag();
    }

    startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            this.timer = Math.floor((Date.now() - this.startTime) / 1000);
            this.updateTimer();
        }, 1000);
    }

    updateTimer() {
        const minutes = String(Math.floor(this.timer / 60)).padStart(2, '0');
        const seconds = String(this.timer % 60).padStart(2, '0');
        this.timerElement.textContent = `${minutes}:${seconds}`;
        this.pointsElement.textContent = this.timer; // Очки = время
    }

    checkWin() {
        return this.grid.flat().every(cell => cell.isOpen || cell.hasMine);
    }

    end(won) {
        this.isGameOver = true;
        clearInterval(this.timerInterval);
        const resultMessage = won ? "Вы выиграли!" : "Вы проиграли!";
        document.getElementById("playerName").textContent = `Поздравляем, ${this.name}!`;
        document.getElementById("congratulation").textContent = resultMessage;
        document.getElementById("end").classList.remove('d-none');
    }

    setName(name) {
        this.name = name;
        document.getElementById("name").textContent = name;
    }
}