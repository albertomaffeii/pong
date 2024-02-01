// public/script.js
const socket = io();

// Variabili per tracciare i tasti premuti
const tastiPremuti = { 'a': false, 'z': false, 'l': false, 'm': false };

// Variabili per controllare le direzioni precedenti dei giocatori
let ultimaDirezioneGiocatore1 = 'stop';
let ultimaDirezioneGiocatore2 = 'stop';

socket.on('connect', () => {
  console.log('Connesso al server WebSocket');
});

socket.on('disconnect', () => {
  console.log('Disconnesso dal server WebSocket');
});

const velocitaPala = 5; // Velocità di movimento della pala

// Ottiene elementi dal DOM
const giocatore1 = document.getElementById('player1');
const giocatore2 = document.getElementById('player2');
const palla = document.querySelector('.ball');

// Aggiunge eventi tastiera per i giocatori
document.addEventListener('keydown', (evento) => {
  const tasto = evento.key.toLowerCase();
  tastiPremuti[tasto] = true;
  gestisciEventiTastiera();
});

document.addEventListener('keyup', (evento) => {
    const tasto = evento.key.toLowerCase();
    tastiPremuti[tasto] = false;
    gestisciEventiTastiera();
  });  

// Gestisce gli eventi della tastiera
function gestisciEventiTastiera() {
  const direzioneGiocatore1 = tastiPremuti['a'] ? 'up' : tastiPremuti['z'] ? 'down' : 'stop';
  const direzioneGiocatore2 = tastiPremuti['l'] ? 'up' : tastiPremuti['m'] ? 'down' : 'stop';

  // Emette eventi per aggiornare la posizione della pala sul server
  socket.emit('move', { player: 'player1', direction: direzioneGiocatore1 });
  socket.emit('move', { player: 'player2', direction: direzioneGiocatore2 });
}
  
socket.on('updatePaddle', ({ player, direction }) => {
  const pala = player === 'player1' ? giocatore1 : giocatore2;

  if (direction === 'reset') {
    pala.style.top = '160px'; // Imposta la posizione iniziale della pala
  } else if (direction === 'up') {
    // Logica di movimento verso l'alto
    pala.style.top = Math.max(parseFloat(pala.style.top) - velocitaPala, 0) + 'px';
  } else if (direction === 'down') {
    // Logica di movimento verso il basso
    pala.style.top = Math.min(parseFloat(pala.style.top) + velocitaPala, 400 - parseFloat(pala.style.height)) + 'px';
  } else if (direction === 'stop') {
    // Logica per fermare la pala
  }
});

socket.on('updateBall', ({ x, y }) => {
  // Aggiorna la posizione della palla
  palla.style.left = x + 'px';
  palla.style.top = y + 'px';
});

socket.on('goal', ({ scoringPlayer }) => {
  // Logica quando viene segnato un gol
  console.log(`Goal! Il giocatore ${scoringPlayer} ha segnato.`);
});
