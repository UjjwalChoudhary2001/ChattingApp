const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

//Set static folder or tells the system that static files are in public folder.
app.use(express.static(path.join(__dirname, "public")));

const botName = "Chat App Bot";

//Run when a new connection comes
io.on("connection", (socket) => {
  socket.on("joinroom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room); //Making that user join the chosen room.

    //Welcome the current user.
    socket.emit("message", formatMessage(botName, "Welcome to Chat App"));

    //Broadcast when some user connects in that room (Except that user everyone will be notified int that room).
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} joined the chat`)
      );

    //Send users and room info in that particular room
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  //Listen to chatmessage sent by that particular pipeline and send it to all.
  socket.on("chatmessage", (msg) => {
    const user = getCurrentUser(socket.id);
    // console.log(msg);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  //Runs when the client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    //If that user exist
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, ` ${user.username} has left the chat`)
      );

      //Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }

    // io.emit("message", formatMessage(botName, "A user has left the chat"));
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => console.log(` Server running on port ${port} `));
