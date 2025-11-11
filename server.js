// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Pour tester, autorise tout. À restreindre plus tard.
    methods: ["GET", "POST"]
  }
});

// Sert les fichiers statiques du dossier "public"
app.use(express.static(path.join(process.cwd(), "public")));
app.use(cors());

// Variables pour le timer
let time = 0;
let interval = null;

// Quand un client se connecte
io.on("connection", (socket) => {
  console.log("Un client est connecté :", socket.id);

  // Envoie le temps actuel à la nouvelle connexion
  socket.emit("timeUpdate", time);

  // Démarrer le timer
  socket.on("start", () => {
    if (!interval) {
      interval = setInterval(() => {
        time++;
        io.emit("timeUpdate", time);
      }, 1000);
      console.log("⏱️ Timer démarré");
    }
    io.emit("start");
  });

  // Pause
  socket.on("pause", () => {
    console.log("⏸️ Timer en pause");
    io.emit("pause");
  });

  // Stop / Reset
  socket.on("reset", () => {
    time = 0;
    clearInterval(interval);
    interval = null;
    io.emit("timeUpdate", time);
    io.emit("reset");
    console.log("🔄 Timer remis à zéro");
  });

  // Déconnexion
  socket.on("disconnect", () => {
    console.log("Client déconnecté :", socket.id);
  });
});

// Utilise le port Render ou 10000 localement
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
});
