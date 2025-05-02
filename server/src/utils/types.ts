export type Board = [
  string | null,
  string | null,
  string | null,
  string | null,
  string | null,
  string | null,
  string | null,
  string | null,
  string | null
];

export type Player = {
  name: string;
  id: string;
  isPlayerX: boolean;
};

export type RoomData = {
  players: Player[];
  board: Board;
  currentTurnPlayer?: Player;
};

export type Rooms = {
  [roomCode: string]: RoomData;
};

export const rooms: Rooms = {};

export enum SocketEvents {
  // Room Management
  CREATE_ROOM = "create-room",
  JOIN_ROOM_REQUEST = "join-room-request",
  JOIN_ROOM = "join-room",
  LEAVE_ROOM = "leave-room",
  PLAYER_DISCONNECT = "player-disconnect",

  // Game Flow
  GAME_STARTED = "game-started",
  CURRENT_PLAYER_TURN = "current-player-turn",
  PLAYER_DATA = "player-data",
  PLAYER_MOVE = "player-move",
  BOARD_UPDATE = "board-update",
  PLAY_AGAIN_REQUEST = "play-again-request",
  PLAY_AGAIN = "play-again",

  // Chat System
  CHAT_MESSAGE = "chat-message",
  CHAT_MESSAGE_RECEIVED = "chat-message-received",

  // System / Connection
  DISCONNECT = "disconnect",
  ERROR = "error",
}

// export interface ServerToClientEvents {
//     noArg: () => void;
//     basicEmit: (a: number, b: string, c: Buffer) => void;
//     withAck: (d: string, callback: (e: number) => void) => void;
//   }

//   export interface ClientToServerEvents {
//     hello: () => void;
//   }

//   export interface InterServerEvents {
//     ping: () => void;
//   }

//   export interface SocketData {
//     name: string;
//     age: number;
//   }
