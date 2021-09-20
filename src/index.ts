import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://sandbox.hackforplay.xyz",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("update", (json) => {
    socket.broadcast.emit("sync", socket.id + "\n" + json);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    socket.broadcast.emit("remove", socket.id);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
