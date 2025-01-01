import determineWinner from "./utils/index.js";

const rooms = {};

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`New connection: ${socket.id}`);

    socket.on("create-room", ({ name, roomCode }) => {
      rooms[roomCode] = {
        players: [{ name: name, id: socket.id, isX: false }],
        board: Array(9).fill(""),
      };

      socket.join(roomCode);
      console.log(`${name} created room ${roomCode}`);
    });

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

    socket.on("game-started", ({ roomCode }) => {
      if (!rooms[roomCode]) return;

      const room = rooms[roomCode];

      if (!room.currentPlayer) {
        room.currentPlayer =
          room.players[Math.floor(Math.random() * room.players.length)];
        room.currentPlayer.isX = true;
      }

      console.log(room.currentPlayer, socket.id);

      io.to(roomCode).emit("current-player", room.currentPlayer);

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

      room.board = board;

      const winner = determineWinner(room.board);

      const nextPlayer = room.players.find((player) => player.id !== playerId);

      io.to(roomCode).emit("board-update", {
        newBoard: room.board,
        nextPlayer: nextPlayer,
        winner: winner,
      });
    });

    socket.on("chat-message", ({ message, roomCode, playerName, playerId }) => {
      console.log(message);
      console.log(roomCode);
      console.log(playerName);
      console.log(playerId);
      socket
        .to(roomCode)
        .emit("chat-message-2", {
          message: message,
          playerName: playerName,
          playerId: playerId,
        });
    });

    socket.on("user-room-exit", (value) => {
      console.log(value);
    });

    socket.on("disconnect", () => {
      console.log(`user ${socket.id} disconnect`);
    });
  });
};

export default socketHandler;
