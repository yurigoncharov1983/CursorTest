// Minesweeper game logic and UI
const boardElement = document.getElementById('game-board');
const statusElement = document.getElementById('game-status');
const startBtn = document.getElementById('start-btn');
const rowsInput = document.getElementById('rows');
const colsInput = document.getElementById('cols');
const minesInput = document.getElementById('mines');

let board = [];
let revealed = [];
let flagged = [];
let gameOver = false;
let rows = 9;
let cols = 9;
let mines = 10;


function initGame() {
    rows = parseInt(rowsInput.value);
    cols = parseInt(colsInput.value);
    mines = parseInt(minesInput.value);
    board = createBoard(rows, cols, mines);
    revealed = Array.from({ length: rows }, () => Array(cols).fill(false));
    flagged = Array.from({ length: rows }, () => Array(cols).fill(false));
    gameOver = false;
    statusElement.textContent = '';
    renderBoard();
}


function createBoard(rows, cols, mines) {
    const board = Array.from({ length: rows }, () => Array(cols).fill(0));
    let placed = 0;
    while (placed < mines) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);
        if (board[r][c] === 'M') continue;
        board[r][c] = 'M';
        placed++;
    }
    // Fill numbers
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c] === 'M') continue;
            board[r][c] = countMines(board, r, c);
        }
    }
    return board;
}

function countMines(board, r, c) {
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < board.length && nc >= 0 && nc < board[0].length) {
                if (board[nr][nc] === 'M') count++;
            }
        }
    }
    return count;
}

function renderBoard() {
    boardElement.innerHTML = '';
    for (let r = 0; r < rows; r++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'board-row';
        for (let c = 0; c < cols; c++) {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'cell';
            if (revealed[r][c]) {
                cellDiv.classList.add('revealed');
                if (board[r][c] === 'M') {
                    cellDiv.classList.add('mine');
                    cellDiv.textContent = '💣';
                } else if (board[r][c] > 0) {
                    cellDiv.textContent = board[r][c];
                }
            } else if (flagged[r][c]) {
                cellDiv.classList.add('flagged');
                cellDiv.textContent = '🚩';
            }
            cellDiv.addEventListener('click', (e) => handleCellClick(r, c));
            cellDiv.addEventListener('contextmenu', (e) => handleCellRightClick(e, r, c));
            rowDiv.appendChild(cellDiv);
        }
        boardElement.appendChild(rowDiv);
    }
}

function handleCellClick(r, c) {
    if (gameOver || revealed[r][c] || flagged[r][c]) return;
    revealCell(r, c);
    renderBoard();
    checkWin();
}

function handleCellRightClick(e, r, c) {
    e.preventDefault();
    if (gameOver || revealed[r][c]) return;
    flagged[r][c] = !flagged[r][c];
    renderBoard();
}

function revealCell(r, c) {
    if (revealed[r][c] || flagged[r][c]) return;
    revealed[r][c] = true;
    if (board[r][c] === 'M') {
        statusElement.textContent = 'Game Over! 💥';
        gameOver = true;
        revealAllMines();
        return;
    }
    if (board[r][c] === 0) {
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    if (!revealed[nr][nc]) revealCell(nr, nc);
                }
            }
        }
    }
}

function revealAllMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c] === 'M') revealed[r][c] = true;
        }
    }
    renderBoard();
}

function checkWin() {
    let safeCells = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (!revealed[r][c] && board[r][c] !== 'M') safeCells++;
        }
    }
    if (safeCells === 0 && !gameOver) {
        statusElement.textContent = 'You Win! 🎉';
        gameOver = true;
        revealAllMines();
    }
}

startBtn.addEventListener('click', initGame);
window.addEventListener('DOMContentLoaded', initGame); 