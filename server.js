const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public"));

let board = ["", "", "", "", "", "", "", "", ""];
let turn = "X";
let players = {};

// Connection
io.on("connection", (socket) => {

  // Join Game
  socket.on("joinGame", (name) => {

    if (!players.X) {
      players.X = socket.id;
      socket.emit("assignSymbol", { symbol: "X" });

    } else if (!players.O) {
      players.O = socket.id;
      socket.emit("assignSymbol", { symbol: "O" });

    } else {
      socket.emit("full");
      return;
    }

    io.emit("updateBoard", board);
    io.emit("turn", turn);
  });

  // Make Move
  socket.on("move", (index) => {

    if (board[index] !== "") return;

    board[index] = turn;

    if (checkWin()) {
      io.emit("updateBoard", board);
      io.emit("gameOver", turn + " wins 🎉");
      return;
    }

    if (!board.includes("")) {
      io.emit("gameOver", "Draw 🤝");
      return;
    }

    turn = turn === "X" ? "O" : "X";

    io.emit("updateBoard", board);
    io.emit("turn", turn);
  });

  // Restart Game
  socket.on("restart", () => {
    board = ["", "", "", "", "", "", "", "", ""];
    turn = "X";

    io.emit("updateBoard", board);
    io.emit("turn", turn);
  });

});

// Win Check
function checkWin() {
  const w = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  return w.some(([a,b,c]) =>
    board[a] && board[a] === board[b] && board[a] === board[c]
  );
}

server.listen(3000, () => console.log("Server running on 3000"));