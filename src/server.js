import express from "express";

const PORT_NUMBER = 3000;

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.get("/", (req, res) => res.render("home"));
app.use("/public", express.static(__dirname + "/public"));

const handleListen = () =>
  console.log(`Listening on http://localhost:${PORT_NUMBER}`);

app.listen(3000, handleListen);
