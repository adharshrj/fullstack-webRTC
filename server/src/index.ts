"use strict";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import roomHandler from "./room";

const PORT = process.env.PORT || 8080;
const app = express();
app.use(cors);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Socket IO Connected");
  roomHandler(socket);
  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
});

server.listen(PORT, () => {
  console.log("Listning on PORT:", PORT);
});
