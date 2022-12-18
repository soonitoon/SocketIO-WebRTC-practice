import http from "http";
import WebSocket from "ws";
import express from "express";

const PORT_NUMBER = 3000;

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.get("/", (req, res) => res.render("home"));
app.use("/public", express.static(__dirname + "/public"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () =>
  console.log(`Listening on http://localhost:${PORT_NUMBER}`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  console.log("Connected to Browser ✅");
  socket.on("close", () => {
    console.log("Disconnected from client ❌");
  });
  socket.on("message", (message) => {
    sockets.forEach((aSocket) => aSocket.send(message.toString()));
  });
});

server.listen(PORT_NUMBER, handleListen);
