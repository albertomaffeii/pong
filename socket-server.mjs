/*
*
* Server Socket.IO.
*
*/

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

io.on('connection', (socket) => {
  console.log('Novo cliente conectado');

    // Join room
    socket.on('join room', (room) => {
      socket.join(room);
      console.log(`Cliente entrou na sala: ${room}`);

      // 
      socket.emit('bem-vindo', 'Benvenuto nella sala: ${room}');
    }); 

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(PORT, () => {
  console.log(`Servidor Socket.IO está ouvindo na porta ${PORT}`);
});
