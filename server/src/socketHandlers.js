import determineWinner from "./utils/index.js";

const rooms = {};

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`New connection: ${socket.id}`);

    socket.on("create-room", ({ name, roomCode }) => {
      if (rooms[roomCode]) return;

      rooms[roomCode] = {
        players: [{ name: name, id: socket.id, isPlayerX: false }],
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
        isPlayerX: false,
      });

      socket.join(roomCode);

      io.to(roomCode).emit("join-room", { name: name, roomCode: roomCode });
      console.log(`${name} joined room ${roomCode}`);
    });

    socket.on("game-started", ({ roomCode }) => {
      if (!rooms[roomCode]) return;

      const room = rooms[roomCode];

      // Randomly choose the player's turn.
      if (!room.currentTurnPlayer) {
        room.currentTurnPlayer =
          room.players[Math.floor(Math.random() * room.players.length)];
        room.currentTurnPlayer.isPlayerX = true;
      }

      // Send to both player in the room the first player turn
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

      // Update board
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

      // Reset game data
      room.currentTurnPlayer.isPlayerX = false;
      room.board = Array(9).fill("");

      // Randomly choose the player's turn.
      room.currentTurnPlayer =
        room.players[Math.floor(Math.random() * room.players.length)];
      room.currentTurnPlayer.isPlayerX = true;

      io.to(roomCode).emit("play-again", room.currentTurnPlayer);
    });

    // Handle user messages
    socket.on("chat-message", ({ message, roomCode, playerName, playerId }) => {
      socket.to(roomCode).emit("chat-message-received", {
        message: message,
        playerName: playerName,
        playerId: playerId,
      });
    });

    // handle when the user leaves the room
    function handlePlayerLeave(socket, playerId, roomCode) {
      const room = rooms[roomCode];
      if (!room) return;

      const player = room.players.find((player) => player.id === playerId);
      if (!player) return;

      console.log(`User ${player.name} left room ${roomCode}`);

      // Delete the player from the room
      room.players = room.players.filter((player) => player.id !== playerId);

      delete rooms[roomCode];
      socket.to(roomCode).emit("player-disconnect", player);
    }

    socket.on("leave-room", ({ playerId, roomCode }) => {
      handlePlayerLeave(socket, playerId, roomCode);
    });

    // handle when the user disconnect
    socket.on("disconnect", () => {
      console.log(`User ${socket.id} disconnected`);

      // Find the room where the user was.
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
