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
  let currentPlayer = {};

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

    currentPlayer = rooms[roomCode].players[Math.floor(Math.random() * 2)];
    currentPlayer.isX = true;
  });

  // Handle "game-started" event
  socket.on("game-started", ({ roomCode }) => {
    if (!rooms[roomCode]) return;

    const room = rooms[roomCode];

    io.to(roomCode).emit("current-player", currentPlayer);

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

    currentPlayer = room.players.find((player) => player.id !== playerId);

    room.board = board;

    socket.to(roomCode).emit("board-update", {
      newBoard: room.board,
      nextPlayer: currentPlayer,
    });
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
