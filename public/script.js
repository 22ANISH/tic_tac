const socket = io();

let mySymbol = "";
let currentTurn = "";

// Create Board
const boardDiv = document.getElementById("board");

for (let i = 0; i < 9; i++) {
  const cell = document.createElement("div");
  cell.className = "cell";
  cell.onclick = () => makeMove(i);
  boardDiv.appendChild(cell);
}

// Join Game
function joinGame() {
  const name = document.getElementById("playerName").value;
  if (!name) return alert("Enter name");

  socket.emit("joinGame", name);
}

// Get Symbol
socket.on("assignSymbol", (data) => {
  mySymbol = data.symbol;
  document.getElementById("status").innerText =
    "You are " + mySymbol;
});

// Update Board
socket.on("updateBoard", (board) => {
  const cells = document.querySelectorAll(".cell");

  cells.forEach((cell, i) => {
    cell.innerText = board[i];
  });
});

// Turn Update
socket.on("turn", (turn) => {
  currentTurn = turn;

  document.getElementById("status").innerText =
    turn === mySymbol ? "Your Turn 🔥" : "Opponent Turn ⏳";
});

// Make Move
function makeMove(index) {
  if (mySymbol !== currentTurn) return;
  socket.emit("move", index);
}

// Restart
function restartGame() {
  socket.emit("restart");
}

// Game Over
socket.on("gameOver", (msg) => {
  alert(msg);
});