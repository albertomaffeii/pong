// index.js
import http from 'http';
import express from 'express';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const paddleSpeed = 5; // Velocidade de movimento da paleta

// Inicialize as posições iniciais dos jogadores e da bola
let player1Pos = 160; // Posição vertical inicial do jogador 1
let player2Pos = 160; // Posição vertical inicial do jogador 2
let ballPos = { x: 300, y: 200 }; // Posição inicial da bola
let ballSpeed = { x: 3, y: 2 }; // Velocidade inicial da bola

io.on('connection', (socket) => {
  console.log('Novo Jogo Iniciado');

  socket.on('move', ({ player, direction }) => {
    if (direction === 'up' || direction === 'down' || direction === 'stop' || direction === 'reset') {
      if (direction === 'reset') {
        // Lógica de reset da paleta se necessário
        io.emit('updatePaddle', { player, direction });
      } else {
        // Lógica de movimento normal da paleta
        io.emit('updatePaddle', { player, direction });
      }
    }
  });
  

  
    socket.on('disconnect', () => {
    console.log('Jogo finalizado');
  });
});

// Lógica para atualizar a posição da bola e verificar se há um gol
setInterval(() => {
  ballPos.x += ballSpeed.x;
  ballPos.y += ballSpeed.y;

  // Lógica para colisões com as bordas do campo
  if (ballPos.y <= 0 || ballPos.y >= 390) {
    ballSpeed.y = -ballSpeed.y;
  }

  // Lógica para colisões com as paletas dos jogadores
  if (
    (ballPos.x <= 20 && ballPos.x >= 10 && ballPos.y >= player1Pos && ballPos.y <= player1Pos + 80) ||
    (ballPos.x >= 570 && ballPos.x <= 580 && ballPos.y >= player2Pos && ballPos.y <= player2Pos + 80)
  ) {
    ballSpeed.x = -ballSpeed.x;
  }

  // Lógica para verificar se a bola ultrapassou a linha de fundo
  if (ballPos.x < 0) {
    io.emit('goal', { scoringPlayer: 'player2' });
    resetGame();
  } else if (ballPos.x > 600) {
    io.emit('goal', { scoringPlayer: 'player1' });
    resetGame();
  }

  // Emita eventos para atualizar a posição da bola no cliente
  io.emit('updateBall', { x: ballPos.x, y: ballPos.y });
}, 16);

function resetGame() {
  // Reseta as posições da bola e das paletas para o início do jogo
  player1Pos = 160;
  player2Pos = 160;
  ballPos = { x: 300, y: 200 };
  ballSpeed = { x: 3, y: 2 };

  // Emita eventos para atualizar as posições no cliente
  io.emit('updatePaddle', { player: 'player1', direction: 'reset' });
  io.emit('updatePaddle', { player: 'player2', direction: 'reset' });
  io.emit('updateBall', { x: ballPos.x, y: ballPos.y });
}

server.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});
