import type { Socket, Server } from "socket.io";
import determineWinner from "./utils/index.ts";
import { SocketEvents, type Board, type Rooms } from "./utils/types.ts";

const rooms: Rooms = {};

export const socketHandler = async (io: Server) => {
  io.on("connection", (socket) => {
    console.log(`New connection: ${socket.id}`);

    socket.on(SocketEvents.CREATE_ROOM, ({ name, roomCode }) => {
      if (rooms[roomCode]) return;

      rooms[roomCode] = {
        players: [{ name: name, id: socket.id, isPlayerX: true }],
        board: Array(9).fill(null) as Board,
      };

      socket.join(roomCode);

      console.log(`${name} created room ${roomCode}`);
      console.log(rooms);
    });

    socket.on(SocketEvents.JOIN_ROOM_REQUEST, ({ name, roomCode }) => {
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

      io.to(roomCode).emit(SocketEvents.JOIN_ROOM, {
        name: name,
        roomCode: roomCode,
      });
      console.log(`${name} joined room ${roomCode}`);
    });

    // Refactor
    socket.on(SocketEvents.GAME_STARTED, ({ roomCode }) => {
      if (!rooms[roomCode]) return;

      const room = rooms[roomCode];

      room.currentTurnPlayer = room.players.find(
        (player) => player.isPlayerX === true
      );

      // Send to both player in the room the first player turn
      io.to(roomCode).emit(
        SocketEvents.CURRENT_PLAYER_TURN,
        room.currentTurnPlayer
      );

      io.to(room.players[0].id).emit(SocketEvents.PLAYER_DATA, {
        you: room.players[0],
        enemy: room.players[1],
      });

      io.to(room.players[1].id).emit(SocketEvents.PLAYER_DATA, {
        you: room.players[1],
        enemy: room.players[0],
      });
    });

    socket.on(SocketEvents.PLAYER_MOVE, ({ board, roomCode, playerId }) => {
      if (!rooms[roomCode]) return;

      const room = rooms[roomCode];

      // Update board
      room.board = board;

      const winner = determineWinner(room.board);

      const nextPlayer = room.players.find((player) => player.id !== playerId);

      io.to(roomCode).emit(SocketEvents.BOARD_UPDATE, {
        newBoard: room.board,
        nextPlayer: nextPlayer,
        winner: winner,
      });
    });

    socket.on(SocketEvents.PLAY_AGAIN_REQUEST, ({ playerData, roomCode }) => {
      if (!rooms[roomCode]) return;

      socket.to(roomCode).emit(SocketEvents.PLAY_AGAIN_REQUEST, playerData);
    });

    socket.on(SocketEvents.PLAY_AGAIN, (roomCode) => {
      if (!rooms[roomCode]) return;

      const room = rooms[roomCode];

      // Reset game data
      if (room.currentTurnPlayer) {
        room.currentTurnPlayer.isPlayerX = false;
      }

      room.board = Array(9).fill(null) as Board;

      // Randomly choose the player's turn.
      room.currentTurnPlayer =
        room.players[Math.floor(Math.random() * room.players.length)];
      room.currentTurnPlayer.isPlayerX = true;

      io.to(roomCode).emit(SocketEvents.PLAY_AGAIN, room.currentTurnPlayer);
    });

    // Handle user messages
    socket.on(
      SocketEvents.CHAT_MESSAGE,
      ({ message, roomCode, playerName, playerId }) => {
        socket.to(roomCode).emit(SocketEvents.CHAT_MESSAGE_RECEIVED, {
          message: message,
          playerName: playerName,
          playerId: playerId,
        });
      }
    );

    // handle when the user leaves the room
    async function handlePlayerLeave(
      socket: Socket,
      playerId: string,
      roomCode: string
    ) {
      const room = rooms[roomCode];
      if (!room) return;

      const player = room.players.find((player) => player.id === playerId);
      if (!player) return;

      // Leave the player for the room
      await socket.leave(roomCode);

      // Delete the player from the room object
      room.players = room.players.filter((player) => player.id !== playerId);

      delete rooms[roomCode];

      if (room.players.length > 0) {
        socket.to(roomCode).emit(SocketEvents.PLAYER_DISCONNECT, player);
      }

      console.log(`User ${player.name} left room ${roomCode}`);
    }

    socket.on(SocketEvents.LEAVE_ROOM, ({ playerId, roomCode }) => {
      handlePlayerLeave(socket, playerId, roomCode);
    });

    // handle when the user disconnect
    socket.on(SocketEvents.DISCONNECT, () => {
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

//Todo:
//Fix time (Fixed)
//fix first player turn (Fixed)
//add sounds
