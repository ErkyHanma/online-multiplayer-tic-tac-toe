import express from "express";
import morgan from "morgan";
import { Server } from "socket.io";
import { createServer } from "node:http";
import cors from "cors";

const app = express();
const server = createServer(app);
const port = process.env.PORT ?? 3000;
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(morgan("dev"));

const rooms = {};

io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);

  // Listen for "create-room" event
  socket.on("create-room", ({ name, roomCode }) => {
    rooms[roomCode] = {
      players: [{ name: name, id: socket.id, isX: false }],
      board: Array(9).fill(""),
    };

    socket.join(roomCode);
    console.log(`${name} created room ${roomCode}`);
  });

  // Listen for "join-room" event
  socket.on("join-room", ({ name, roomCode }) => {
    if (!rooms[roomCode]) {
      socket.emit("error", { message: "Room does not exist" });
      return;
    }

    if (rooms[roomCode].players.length === 2) {
      socket.emit("error", { message: "Room is full" });
      return;
    }

    rooms[roomCode].players.push({
      name: name,
      id: socket.id,
      isX: false,
    });

    socket.join(roomCode);
    io.to(roomCode).emit("join", { name: name, roomCode: roomCode });
    console.log(`${name} joined room ${roomCode}`);
  });

  // Handle "game-started" event
  socket.on("game-started", ({ roomCode }) => {
    if (!rooms[roomCode]) return;

    const room = rooms[roomCode];

    // If no currentPlayer is assigned, randomly select one
    if (!room.currentPlayer) {
      room.currentPlayer =
        room.players[Math.floor(Math.random() * room.players.length)];
      room.currentPlayer.isX = true; // Assign "X" to the selected player
    }

    // Emit the current player to the room
    io.to(roomCode).emit("current-player", room.currentPlayer);

    // Sending player data to both players
    io.to(room.players[0].id).emit("player-data", {
      you: room.players[0],
      enemy: room.players[1],
    });

    io.to(room.players[1].id).emit("player-data", {
      you: room.players[1],
      enemy: room.players[0],
    });
  });

  socket.on("player-move", ({ board, roomCode, playerId }) => {
    if (!rooms[roomCode]) return;

    const room = rooms[roomCode];

    const nextPlayer = room.players.find((player) => player.id !== playerId);
    room.board = board;
    const winner = determineWinner(room.board);

    io.to(roomCode).emit("board-update", {
      newBoard: room.board,
      nextPlayer: nextPlayer,
      winner: winner,
    });
  });
});

const winCombs = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const determineWinner = (board) => {
  for (let i = 0; i < winCombs.length; i++) {
    const arr = winCombs[i];

    if (
      board[arr[0]] &&
      board[arr[0]] === board[arr[1]] &&
      board[arr[1]] === board[arr[2]]
    ) {
      return board[arr[0]];
    }
  }
};
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
