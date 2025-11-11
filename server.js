const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve les fichiers du dossier "public"
app.use(express.static(path.join(__dirname, "public")));

let time = 0;
let interval = null;

// Quand un client se connecte (display ou controller)
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
  });

  // Arrêter le timer
  socket.on("stop", () => {
    clearInterval(interval);
    interval = null;
    console.log("⏸️ Timer arrêté");
  });

  // Remettre à zéro le timer
  socket.on("reset", () => {
    time = 0;
    io.emit("timeUpdate", time);
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
