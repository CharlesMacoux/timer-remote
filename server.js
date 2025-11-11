// Importation des modules
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Initialisation du serveur
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Sert le dossier public (HTML, CSS, JS, etc.)
app.use(express.static('public'));

// Variable pour stocker le temps écoulé et l’état du timer
let time = 0;
let running = false;
let timerInterval = null;

// Événements Socket.IO
io.on('connection', (socket) => {
  console.log('Un utilisateur est connecté');

  // Envoie l’état actuel au nouvel utilisateur
  socket.emit('update', { time, running });

  // Quand le contrôleur démarre le timer
  socket.on('start', () => {
    if (!running) {
      running = true;
      timerInterval = setInterval(() => {
        time++;
        io.emit('update', { time, running });
      }, 1000);
      io.emit('update', { time, running });
    }
  });

  // Quand le contrôleur arrête le timer
  socket.on('stop', () => {
    running = false;
    clearInterval(timerInterval);
    io.emit('update', { time, running });
  });

  // Quand le contrôleur remet le timer à zéro
  socket.on('reset', () => {
    time = 0;
    io.emit('update', { time, running });
  });

  socket.on('disconnect', () => {
    console.log('Un utilisateur s\'est déconnecté');
  });
});

// Pour Render : utiliser le port attribué automatiquement
const PORT = process.env.PORT || 3000;

// Démarre le serveur
server.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
});
