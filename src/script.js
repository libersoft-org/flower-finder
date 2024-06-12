let players = [];
let board = [];
let settings = {};
let currPlayer = 0;
let currentAction = null;
let gameOver = false;

function startGame() {
 settings = {
  numPlayers: Number(qs('#num-players').value),
  gridSize: Number(qs('#grid-size').value),
  numFlowers: Number(qs('#num-flowers').value),
  numStones: Number(qs('#num-stones').value),
  numMagnifiers: Number(qs('#num-magnifiers').value),
  numClocks: Number(qs('#num-clocks').value),
 };
 gameOver = false;
 players = [];
 for (let i = 0; i < settings.numPlayers; i++) players.push({ flowers: 0, magnifiers: 0, stones: 0 });
 currPlayer = 0;
 currentAction = null;
 board = Array(settings.gridSize).fill().map(() => Array(settings.gridSize).fill().map(() => ({ type: 0, revealed: false, blockedBy: [] })));
 placeItems(1, settings.numFlowers);
 placeItems(2, settings.numStones);
 placeItems(3, settings.numMagnifiers);
 placeItems(4, settings.numClocks);
 const elBoard = qs('#board');
 elBoard.innerHTML = '';
 elBoard.style.gridTemplateColumns = `repeat(${settings.gridSize}, 40px)`;
 elBoard.style.gridTemplateRows = `repeat(${settings.gridSize}, 40px)`;
 for (let x = 0; x < settings.gridSize; x++) {
  for (let y = 0; y < settings.gridSize; y++) {
   const field = document.createElement('div');
   field.classList.add('field');
   field.classList.add('unrevealed');
   field.addEventListener('click', () => handleCellClick(x, y));
   elBoard.appendChild(field);
  }
 }
 updatePlayerInfo();
 qs('#settings').style.display = 'none';
 qs('#game').removeAttribute('style');
}

function placeItems(type, count) {
 let placed = 0;
 while (placed < count) {
  const x = Math.floor(Math.random() * settings.gridSize);
  const y = Math.floor(Math.random() * settings.gridSize);
  if (board[x][y].type === 0) {
   board[x][y].type = type;
   placed++;
  }
 }
}

function handleCellClick(x, y) {
 if (gameOver) return;
 switch (currentAction) {
  case 1:
   magnifierHandler(x, y);
   currentAction = null;
   break;
  case 2:
   stoneHandler(x, y);
   currentAction = null;
   break;
  default:
   if (board[x][y].revealed || board[x][y].blockedBy.some(v => v !== currPlayer)) return;
   let itemCollected = false;
   if (board[x][y].type === 1) {
    players[currPlayer].flowers++;
    itemCollected = true;
   } else if (board[x][y].type === 2) {
    players[currPlayer].stones++;
    itemCollected = true;
   } else if (board[x][y].type === 3) {
    players[currPlayer].magnifiers++;
    itemCollected = true;
   } else if (board[x][y].type === 4) {
    itemCollected = true;
    nextTurn();
   }
   revealCell(x, y);
   if (itemCollected) {
    hideSymbolAfterTime(x, y);
    updatePlayerInfo();
    if (board[x][y].type !== 4) nextTurn();
   } else nextTurn();
 }
}

function revealCell(x, y) {
 board[x][y].revealed = true;
 renderCell(x, y, board[x][y].type);
}

function renderCell(x, y, type) {
 const elBoard = qs('#board');
 const button = elBoard.children[x * settings.gridSize + y];
 button.classList.remove('unrevealed');
 let symbol = '';
 switch (type) {
  case 1:
   symbol = '🌸';
   break;
  case 2:
   symbol = '🪨';
   break;
  case 3:
   symbol = '🔍';
   break;
  case 4:
   symbol = '⏰';
   break;
 }
 button.innerHTML = symbol;
}

function hideSymbolAfterTime(x, y) {
 const elBoard = qs('#board');
 const button = elBoard.children[x * settings.gridSize + y];
 setTimeout(() => button.innerHTML = '', 1000);
}

function updatePlayerInfo() {
 qs('#score').innerHTML = players.map((player, index) => `👨 ${index + 1}: ${player.flowers} 🌸`).join('<br />');
 qs('#player').innerHTML = `Current 👨: ${currPlayer + 1}`;
 updateActions();
 checkGameEnd();
}

function updateActions() {
 const player = players[currPlayer];
 qs('#magnifier-count').innerText = player.magnifiers;
 qs('#stone-count').innerText = player.stones;
 const elMagnifier = qs('#use-magnifier');
 if (player.magnifiers === 0) elMagnifier.classList.add('disabled');
 else elMagnifier.classList.remove('disabled');
 const elStone = qs('#use-stone');
 if (player.stones === 0) elStone.classList.add('disabled');
 else elStone.classList.remove('disabled');
}

function checkGameEnd() {
 const flowersLeft = board.flat().filter(cell => cell.type === 1 && !cell.revealed).length;
 if (flowersLeft === 0) {
  gameOver = true;
  const elMagnifier = qs('#use-magnifier');
  if (!elMagnifier.classList.contains('disabled')) elMagnifier.classList.add('disabled');
  const elStone = qs('#use-stone');
  if (!elStone.classList.contains('disabled')) elStone.classList.add('disabled');
  const maxFlowers = Math.max(...players.map(player => player.flowers));
  const winners = players.filter(player => player.flowers === maxFlowers);
  if (winners.length > 1) alert('Game over! It\'s a tie.');
  else {
   const winnerIndex = players.findIndex(player => player.flowers === maxFlowers);
   alert(`Game over! Player ${winnerIndex + 1} wins.`);
  }
 }
}

function nextTurn() {
 currPlayer = (currPlayer + 1) % settings.numPlayers;
 renderBlockedCells();
 updatePlayerInfo();
}

function useItem(id) {
 if (gameOver) return;
 switch (id) {
  case 1:
   if (players[currPlayer].magnifiers > 0) { 
    alert('Select a cell to use the 🔍.'); 
    currentAction = id;
   }
   break;
  case 2:
   if (players[currPlayer].stones > 0) {
    alert('Select a cell to place the 🪨.');
    currentAction = id;
   }
   break;
 }
}

function magnifierHandler(x, y) {
 const cellsToReveal = [];
 for (let i = x - 1; i <= x + 1; i++) {
  for (let j = y - 1; j <= y + 1; j++) {
   if (i >= 0 && i < settings.gridSize && j >= 0 && j < settings.gridSize) {
    if (!board[i][j].revealed || !board[i][j].blockedBy.some(v => v !== currPlayer)) {
     revealCell(i, j);
     cellsToReveal.push({ x: i, y: j });
    }
   }
  }
 }
 players[currPlayer].magnifiers--;
 cellsToReveal.forEach(cell => {
  revealCell(cell.x, cell.y, 0);
  hideSymbolAfterTime(cell.x, cell.y);
 });
 updatePlayerInfo();
 nextTurn();
}

function stoneHandler(x, y) {
 if (board[x][y].revealed) {
  players[currPlayer].stones--;
  for (let i = 0; i < settings.gridSize; i++) {
   if (!board[i][y].blockedBy.includes(currPlayer)) board[i][y].blockedBy.push(currPlayer);
   if (!board[x][i].blockedBy.includes(currPlayer)) board[x][i].blockedBy.push(currPlayer);
  }
  updatePlayerInfo();
  nextTurn();
 }
}

function renderBlockedCells() {
 const elBoard = qs('#board');
 for (let x = 0; x < settings.gridSize; x++) {
  for (let y = 0; y < settings.gridSize; y++) {
   const button = elBoard.children[x * settings.gridSize + y];
   if (board[x][y].blockedBy.some(v => v !== currPlayer)) {
    button.classList.remove('unrevealed');
    button.classList.add('blocked');   
   } else {
    button.classList.remove('blocked');
    if (!board[x][y].revealed) button.classList.add('unrevealed');
   }
  }
 }
}

function resetGame() {
 qs('#settings').removeAttribute('style');
 qs('#game').style.display = 'none';
}

function qs(name) {
 return document.querySelector(name);
}
