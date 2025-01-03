import express from "express";
import morgan from "morgan";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import socketHandler from "./socketHandlers.js";

const app = express();
app.use(cors());
app.use(morgan("dev"));

const server = createServer(app);
const port = process.env.PORT ?? 3000;
const io = new Server(server, {
  cors: {
    origin: "*",
  },
  connectionStateRecovery: {},
});

socketHandler(io);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
