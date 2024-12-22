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
    origin: "http://localhost:5173",
  },
});

app.use(cors());
app.use(morgan("dev"));

const rooms = {};

// rooms["juan"] = {
//   players: [
//     { name: "mar", id: 1 },
//     { name: "mar", id: 1 },
//   ],
//   board: Array(9).fill(null),
//   playerIndex: 1,
// };

io.on("connection", (socket) => {
  // console.log(socket.id);

  socket.on("create-room", (value) => {
    rooms[value.roomCode] = {
      players: [{ name: value.name, id: socket.id, playerIndex: 0 }],
      board: Array(9).fill(null),
    };
    socket.join(value.roomCode);
    console.log(rooms[value.roomCode].players.length);
  });

  socket.on("join-room", (value) => {
    if (rooms[value.roomCode].players.length === 2) {
      console.log(rooms[value.roomCode].players.length);
      return;
    }

    rooms[value.roomCode].players.push({
      name: value.name,
      id: socket.id,
      playerIndex: 1,
    });

    socket.join(value.roomCode);
    io.to(value.roomCode).emit("hola", value.name);
  });
});

server.listen(3000, () => {
  console.log(`Server running on port ${port}`);
});
