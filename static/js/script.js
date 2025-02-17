const board = document.getElementById('game-board');
const resetBtn = document.getElementById('reset-btn');
const undoBtn = document.getElementById('undo-btn');
let firstClick = true;
let selectedPiece = null;
let boardState = [];
let history = [];


function initializeBoard() {
    board.innerHTML = '';
    boardState = [];
    for (let i = 0; i < 4; i++) {
        const row = [];
        for (let j = 0; j < 4; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            const piece = document.createElement('div');
            piece.className = 'piece';
            cell.appendChild(piece);
            cell.addEventListener('click', () => handleCellClick(i, j));
            board.appendChild(cell);
            row.push(1);
        }
        boardState.push(row);
    }
    firstClick = true;
    selectedPiece = null;
    history = [];
    updateBoard();
}

function handleCellClick(row, col) {
    if (firstClick) {
        boardState[row][col] = 0;
        firstClick = false;
        history.push(JSON.parse(JSON.stringify(boardState)));
    } else if (selectedPiece === null) {
        if (boardState[row][col] === 1) {
            selectedPiece = { row, col };
        }
    } else {
        const { row: selectedRow, col: selectedCol } = selectedPiece;
        if (boardState[row][col] === 0 &&
            ((Math.abs(row - selectedRow) === 2 && col === selectedCol) ||
             (Math.abs(col - selectedCol) === 2 && row === selectedRow))) {
            const middleRow = (row + selectedRow) / 2;
            const middleCol = (col + selectedCol) / 2;
            if (boardState[middleRow][middleCol] === 1) {
                boardState[middleRow][middleCol] = 0;
                boardState[selectedRow][selectedCol] = 0;
                boardState[row][col] = 1;
                history.push(JSON.parse(JSON.stringify(boardState)));
            }
        }
        selectedPiece = null;
    }
    updateBoard();
}

function updateBoard() {
    const cells = document.querySelectorAll('.cell');
    boardState.forEach((row, i) => {
        row.forEach((cell, j) => {
            const index = i * 4 + j;
            cells[index].querySelector('.piece').style.display = cell ? 'block' : 'none';
        });
    });
}

function undo() {
    if (history.length > 0) {
        boardState = history.pop();
        updateBoard();
        firstClick = false;
        selectedPiece = null;
    }
}


function updateBoard() {
    const cells = document.querySelectorAll('.cell');
    boardState.forEach((row, i) => {
        row.forEach((cell, j) => {
            const index = i * 4 + j;
            const piece = cells[index].querySelector('.piece');
            if (cell) {
                piece.style.display = 'block';
                piece.style.backgroundColor = selectedPiece && selectedPiece.row === i && selectedPiece.col === j ? '#E74C3C' : '#2C3E50';
            } else {
                piece.style.display = 'none';
            }
        });
    });
}

resetBtn.addEventListener('click', initializeBoard);
undoBtn.addEventListener('click', undo);

initializeBoard();
