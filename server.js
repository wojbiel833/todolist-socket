const express = require("express");
const socket = require("socket.io");
const { v4: uuidv4 } = require("uuid");

const tasks = [
  { name: "Shopping", id: uuidv4() },
  { name: "Gym", id: uuidv4() },
  { name: "Learning how to code", id: uuidv4() },
];

const app = express();
const server = app.listen(process.env.PORT || 7000, () => {
  console.log("Server is running on port 7000");
});
const io = socket(server);

// app.use((req, res) => {
//   res.status(404).send({ message: "Not found..." });
// });
app.use((req, res) => {
  res.send(tasks);
});

io.on("connection", (socket) => {
  socket.to(socket.id).emit("updateData", tasks);

  io.on("addTask", (taskName) => {
    tasks.push(taskName);
    socket.broadcast.emit("addTask", taskName);
  });

  io.on("removeTask", (taskName, id) => {
    const index = tasks[id];
    if (id == tasks.id) tasks.splice(taskName[index], 1);
    socket.broadcast.emit("removeTask", taskName);
  });
});

// const user = users.find((item) => item.id === socket.id);
//     const index = users.findIndex((item) => item.id === socket.id);
//     tasks.splice(index, 1);
// socket.broadcast.emit("removeUser", nick);
