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
  let room = "";

  // ゲームを始めた・マップが変わったとき
  socket.on("enter room", (newRoom) => {
    if (room) {
      // 以前いたルームから出る
      socket.leave(room);
      socket.to(room).emit("leave room", socket.id);
    }
    room = newRoom;
    socket.join(room);
    console.log(`user ${socket.id} joined room ${room}`);
  });

  socket.on("update", (json) => {
    if (room) {
      socket.to(room).emit("sync", socket.id + "\n" + json);
    }
  });

  socket.on("disconnecting", () => {
    console.log("user disconnecting");
    if (room) {
      socket.to(room).emit("leave room", socket.id);
    }
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
