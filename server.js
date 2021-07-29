const express = require("express");
const socket = require("socket.io");

const tasks = [];

const app = express();
const server = app.listen(process.env.PORT || 8000, () => {
  console.log("Server is running...");
});
const io = socket(server);

app.use((req, res) => {
  res.status(404).send({ message: "Not found..." });
});

io.on("connction", (socket) => {
  socket.to(socket.id).emit("updateData", tasks);

  io.on("addTask", (taskName) => {
    tasks.push(taskName);
    socket.broadcast.emit("addTask", taskName);
  });

  io.on("removeTask", (taskName) => {
    const index = tasks.findIndex(taskName);
    tasks.splice(taskName[index], 1);
    socket.broadcast.emit("removeTask", taskName);
  });
});

// const user = users.find((item) => item.id === socket.id);
//     const index = users.findIndex((item) => item.id === socket.id);
//     tasks.splice(index, 1);
// socket.broadcast.emit("removeUser", nick);
