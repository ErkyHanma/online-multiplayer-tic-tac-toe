import express from "express";
import morgan from "morgan";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import { socketHandler } from "./socketHandlers.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173", // Dev client
  "https://online-multiplayer-tic-tac-toe.vercel.app", // Prod client
];

app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

const server = createServer(app);
const port = process.env.PORT ?? 3000;

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
  connectionStateRecovery: {},
});

socketHandler(io);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
