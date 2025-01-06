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

    socket.on("join-room-request", ({ name, roomCode }) => {
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
      io.to(roomCode).emit("join-room", { name: name, roomCode: roomCode });
      console.log(`${name} joined room ${roomCode}`);
    });

    socket.on("game-started", ({ roomCode }) => {
      if (!rooms[roomCode]) return;

      const room = rooms[roomCode];

      if (!room.currentTurnPlayer) {
        room.currentTurnPlayer =
          room.players[Math.floor(Math.random() * room.players.length)];
        room.currentTurnPlayer.isX = true;
      }

      io.to(roomCode).emit("current-player-turn", room.currentTurnPlayer);

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

    socket.on("play-again-request", ({ playerData, roomCode }) => {
      if (!rooms[roomCode]) return;

      socket.to(roomCode).emit("play-again-request", playerData);
    });

    socket.on("play-again", (roomCode) => {
      if (!rooms[roomCode]) return;

      const room = rooms[roomCode];
      room.currentTurnPlayer.isX = false;
      room.board = Array(9).fill("");
      room.currentTurnPlayer =
        room.players[Math.floor(Math.random() * room.players.length)];
      room.currentTurnPlayer.isX = true;

      io.to(roomCode).emit("play-again", room.currentTurnPlayer);
    });

    socket.on("chat-message", ({ message, roomCode, playerName, playerId }) => {
      socket.to(roomCode).emit("chat-message-received", {
        message: message,
        playerName: playerName,
        playerId: playerId,
      });
    });

    // handle when the user leaves the room
    const handlePlayerLeave = (socket, playerId, roomCode) => {
      const room = rooms[roomCode];
      if (!room) return;

      const player = room.players.find((player) => player.id === playerId);
      if (!player) return;

      console.log(`User ${player.name} left room ${roomCode}`);

      // Delete the player from the room
      room.players = room.players.filter((player) => player.id !== playerId);

      delete rooms[roomCode];
      socket.to(roomCode).emit("player-disconnect", player);
    };

    socket.on("leave-room", ({ playerId, roomCode }) => {
      handlePlayerLeave(socket, playerId, roomCode);
    });

    socket.on("disconnect", () => {
      console.log(`User ${socket.id} disconnected`);

      // Buscar todas las salas donde el usuario estaba conectado
      for (const roomCode in rooms) {
        const room = rooms[roomCode];
        const player = room.players.find((player) => player.id === socket.id);

        if (player) {
          handlePlayerLeave(socket, socket.id, roomCode);
        }
      }
    });
  });
};

export default socketHandler;
