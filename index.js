// index.js
import http from 'http';
import express from 'express';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const paddleSpeed = 5; // Velocità di movimento della pala

// Inizializza le posizioni iniziali dei giocatori e della palla
let player1Pos = 160; // Posizione verticale iniziale del giocatore 1
let player2Pos = 160; // Posizione verticale iniziale del giocatore 2
let ballPos = { x: 300, y: 200 }; // Posizione iniziale della palla
let ballSpeed = { x: 3, y: 2 }; // Velocità iniziale della palla

io.on('connection', (socket) => {
  console.log('Nuovo gioco avviato');

  socket.on('move', ({ player, direction }) => {
    if (direction === 'up' || direction === 'down' || direction === 'stop' || direction === 'reset') {
      if (direction === 'reset') {
        // Logica di reset della pala se necessario
        io.emit('updatePaddle', { player, direction });
      } else {
        // Logica di movimento normale della pala
        io.emit('updatePaddle', { player, direction });
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('Gioco terminato');
  });
});

// Logica per aggiornare la posizione della palla e verificare se c'è un gol
setInterval(() => {
  ballPos.x += ballSpeed.x;
  ballPos.y += ballSpeed.y;

  // Logica per collisioni con i bordi del campo
  if (ballPos.y <= 0 || ballPos.y >= 390) {
    ballSpeed.y = -ballSpeed.y;
  }

  // Logica per collisioni con le palette dei giocatori
  if (
    (ballPos.x <= 20 && ballPos.x >= 10 && ballPos.y >= player1Pos && ballPos.y <= player1Pos + 80) ||
    (ballPos.x >= 570 && ballPos.x <= 580 && ballPos.y >= player2Pos && ballPos.y <= player2Pos + 80)
  ) {
    ballSpeed.x = -ballSpeed.x;
  }

  // Logica per verificare se la palla ha superato la linea di fondo
  if (ballPos.x < 0) {
    io.emit('goal', { scoringPlayer: 'player2' });
    resetGame();
  } else if (ballPos.x > 600) {
    io.emit('goal', { scoringPlayer: 'player1' });
    resetGame();
  }

  // Emetti eventi per aggiornare la posizione della palla sul client
  io.emit('updateBall', { x: ballPos.x, y: ballPos.y });
}, 16);

function resetGame() {
  // Reimposta le posizioni della palla e delle palette all'inizio del gioco
  player1Pos = 160;
  player2Pos = 160;
  ballPos = { x: 300, y: 200 };
  ballSpeed = { x: 3, y: 2 };

  // Emetti eventi per aggiornare le posizioni sul client
  io.emit('updatePaddle', { player: 'player1', direction: 'reset' });
  io.emit('updatePaddle', { player: 'player2', direction: 'reset' });
  io.emit('updateBall', { x: ballPos.x, y: ballPos.y });
}

server.listen(3000, () => {
  console.log('Server avviato sulla porta 3000');
});
