import http from "http";
import express from "express";
import SocketIo from "socket.io";

const PORT_NUMBER = 3000;

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.get("/", (req, res) => res.render("home"));
app.use("/public", express.static(__dirname + "/public"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () =>
  console.log(`Listening on http://localhost:${PORT_NUMBER}`);

const httpServer = http.createServer(app);
const wsServer = SocketIo(httpServer);

wsServer.on("connection", (socket) => {
  socket["nickname"] = "Anon";
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (roomName, doen) => {
    socket.join(roomName);
    doen();
    socket.to(roomName).emit("welcome", socket.nickname);
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname)
    );
  });
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  });
  socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});

// const sockets = [];

// wss.on("connection", (socket) => {
//   sockets.push(socket);
//   socket["nickname"] = "Anon";
//   console.log("Connected to Browser ✅");
//   socket.on("close", () => {
//     console.log("Disconnected from client ❌");
//   });
//   socket.on("message", (msg) => {
//     const messageObj = JSON.parse(msg);
//     switch (messageObj.type) {
//       case "message":
//         sockets.forEach((aSocket) =>
//           aSocket.send(`${socket.nickname}: ${messageObj.payload}`)
//         );
//         break;
//       case "nickname":
//         socket["nickname"] = messageObj.payload;
//         break;
//     }
//   });
// });

httpServer.listen(PORT_NUMBER, handleListen);
