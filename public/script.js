// public/script.js
const socket = io();

// Variáveis para rastrear teclas pressionadas
const keysPressed = { 'a': false, 'z': false, 'l': false, 'm': false };


// Variáveis para controlar as direções anteriores dos jogadores
let lastPlayer1Direction = 'stop';
let lastPlayer2Direction = 'stop';


socket.on('connect', () => {
  console.log('Conectado ao servidor WebSocket');
});

socket.on('disconnect', () => {
  console.log('Desconectado do servidor WebSocket');
});

const paddleSpeed = 5; // Velocidade de movimento da paleta

// Obtenha elementos do DOM
const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');
const ball = document.querySelector('.ball');

// Adicione eventos de teclado para os jogadores
document.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  keysPressed[key] = true;
  handleKeyEvents();
});

// Remova a parte relacionada ao keyup
document.addEventListener('keyup', (event) => {
    const key = event.key.toLowerCase();
    keysPressed[key] = false;
    // Remova a chamada para handleKeyEvents aqui
  });
  

// Função para lidar com os eventos de tecla
function handleKeyEvents() {
  const player1Direction = keysPressed['a'] ? 'up' : keysPressed['z'] ? 'down' : 'stop';
  const player2Direction = keysPressed['l'] ? 'up' : keysPressed['m'] ? 'down' : 'stop';

  // Emita eventos para atualizar a posição da paleta no servidor
  socket.emit('move', { player: 'player1', direction: player1Direction });
  socket.emit('move', { player: 'player2', direction: player2Direction });
}

  
  socket.on('updatePaddle', ({ player, direction }) => {
    const paddle = player === 'player1' ? player1 : player2;
  
    if (direction === 'reset') {
      // Lógica de reset da paleta se necessário
      paddle.style.top = '160px'; // Defina a posição inicial da paleta
    } else if (direction === 'up') {
      // Lógica de movimento para cima
      paddle.style.top = Math.max(parseFloat(paddle.style.top) - paddleSpeed, 0) + 'px';
    } else if (direction === 'down') {
      // Lógica de movimento para baixo
      paddle.style.top = Math.min(parseFloat(paddle.style.top) + paddleSpeed, 400 - parseFloat(paddle.style.height)) + 'px';
    } else if (direction === 'stop') {
      // Lógica para parar a paleta
      // Aqui, você pode optar por não fazer nada ou ajustar conforme necessário
    }
  });

socket.on('updateBall', ({ x, y }) => {
  // Atualize a posição da bola
  ball.style.left = x + 'px';
  ball.style.top = y + 'px';
});

socket.on('goal', ({ scoringPlayer }) => {
  // Lógica quando um gol é marcado
  console.log(`Gol! Jogador ${scoringPlayer} pontuou.`);
});
