//gameui shared between both modes
game = (function() {
    let mode = '';

    //game always starts with X regardless of mode
    let turnX = true;
    let gameOver = false;
    let xWins = false;
    let oWins = false;

    const gameCells = Array.from(document.getElementsByClassName('cell'));
    
    document.getElementById('vs-bot').addEventListener('click', setBotMode);
    document.getElementById('vs-player').addEventListener('click', setPVPMode);

    //set two different functions because wrapping into one was causing a bug with e.target.textContent
    function setBotMode() {
        mode = 'bot';
        setDisplay();
        botGame();
    }

    function setPVPMode() {
        mode = 'player';
        setDisplay();
        pvpGame();
    }

    function setDisplay() {
        document.getElementById('start-overlay').classList.add('hidden');
        document.getElementById('game-div').classList.remove('hidden');
        const p1Message = document.getElementById('p1-status');
        const p2Message = document.getElementById('p2-status');
        if (mode === 'bot') {
            p1Message.textContent = 'Player: X';
            p2Message.textContent = 'Computer: O';
        } else {
            p1Message.textContent = 'Player 1: X';
            p2Message.textContent = 'Player 2: O';
        }
    }

    document.getElementById('reset').addEventListener('click', reset);

    function reset() {
        gameCells.forEach(cell => cell.textContent = '');
        mode = '';
        turnX = true;
        gameOver = false;
        xWins = false;
        oWins = false;
        turns = 0;
        document.getElementById('start-overlay').classList.remove('hidden');
        document.getElementById('game-div').classList.add('hidden');
    }

    return {
        cells: gameCells,
        turnX: turnX,
        gameOver: gameOver,
    }
})();

const pvpGame = function() {
    game.cells.forEach(cell => cell.addEventListener('click', makePvpMove));
}

function makePvpMove(e) {
    if (e.target.textContent === '') {
        let currMove = game.turnX ? 'X' : 'O';
        e.target.textContent = currMove;
        game.turnX = !game.turnX;
    }
    evaluateBoard(game.cells);
}

const botGame = function() {
    game.cells.forEach(cell => cell.addEventListener('click', makePlayerMove));
}

//player is X and X starts first
function makePlayerMove(e) {
    if (e.target.textContent === '') {
        e.target.textContent = 'X';
    }
    evaluateBoard(game.cells);
    makeBotMove();
    evaluateBoard(game.cells);
    console.log(game.turns);
}

function getEmptyCells() {
    const emptyCells = game.cells.filter(cell => cell.textContent === '').map(cell => cell.id);
    return emptyCells;
}

/*
bot will prioritize the middle cell
if that is unavailable it will choose a corner cell 
if those are unavailable it will pick at random
*/
function makeBotMove() {
    console.log(getEmptyCells());
    //4 is the middle cell
    if (getEmptyCells().includes('4')) {
        game.cells[4].textContent = 'O';
        return;
    }
    //check corners and pick a random corner
    const emptyCorners = getEmptyCells().filter(cell => cell === '0' || cell === '2' || cell === '6' || cell === '8');
    if (emptyCorners.length > 0) {
        makeRandomMove(emptyCorners);
        return;
    }
    makeRandomMove(getEmptyCells());
}

function makeRandomMove(availableMoves) {
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    game.cells[availableMoves[randomIndex]].textContent = 'O';
}


function evaluateBoard(gameboard) { 
    if (evaluateWin(gameboard, 'X')) {
        xWins = true;
        triggerWin('X');
        return 'X wins';
    }
    if (evaluateWin(gameboard, 'O')) {
        oWins = true;
        triggerWin('O');
        return 'O wins';
    }
    if (getEmptyCells().length === 0) {
        triggerWin('Draw');
        return 'Draw';
    }
    return null;
}

function evaluateWin(gameboard, symbol) {
    if (gameboard[0].textContent === symbol && gameboard[1].textContent === symbol && gameboard[2].textContent === symbol) {
        return true;
    }
    if (gameboard[3].textContent === symbol && gameboard[4].textContent === symbol && gameboard[5].textContent === symbol) {
        return true;
    }
    if (gameboard[6].textContent === symbol && gameboard[7].textContent === symbol && gameboard[8].textContent === symbol) {
        return true;
    }
    if (gameboard[0].textContent === symbol && gameboard[3].textContent === symbol && gameboard[6].textContent === symbol) {
        return true;
    }
    if (gameboard[1].textContent === symbol && gameboard[4].textContent === symbol && gameboard[7].textContent === symbol) {
        return true;
    }
    if (gameboard[2].textContent === symbol && gameboard[5].textContent === symbol && gameboard[8].textContent === symbol) {
        return true;
    }
    if (gameboard[0].textContent === symbol && gameboard[4].textContent === symbol && gameboard[8].textContent === symbol) {
        return true;
    }
    if (gameboard[2].textContent === symbol && gameboard[4].textContent === symbol && gameboard[6].textContent === symbol) {
        return true;
    }
}

function triggerWin(symbol) {
    let overlay = document.getElementById('game-over-overlay');
    if (symbol === 'X') {
        overlay.textContent = 'Player 1 wins!';
    } else if (symbol === 'O') {
        overlay.textContent = 'Player 2 wins!';
    } else {
        overlay.textContent = 'Draw';
    }
    overlay.classList.remove('hidden');
    overlay.addEventListener('click', () => {
        overlay.classList.add('hidden');
        //take away ability to modify game cells after game over
        game.cells.forEach(cell => cell.removeEventListener('click', makePvpMove));
        game.cells.forEach(cell => cell.removeEventListener('click', makePlayerMove));
    });
}


