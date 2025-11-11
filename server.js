import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: "*", // autorise tout (pour tester)
  methods: ["GET", "POST"]
}));

const io = new Server(server, {
  cors: {
    origin: "*", // autorise toutes les origines (à restreindre plus tard si besoin)
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("Un client est connecté");
  
  socket.on("start", () => {
    console.log("Commande de démarrage reçue");
    io.emit("start"); // envoie à tous les clients
  });

  socket.on("pause", () => {
    console.log("Commande de pause reçue");
    io.emit("pause");
  });

  socket.on("reset", () => {
    console.log("Commande de reset reçue");
    io.emit("reset");
  });
});

server.listen(10000, () => console.log("Serveur sur le port 10000"));
