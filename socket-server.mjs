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

  // Aqui você pode adicionar lógica para lidar com eventos do cliente

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(PORT, () => {
  console.log(`Servidor Socket.IO está ouvindo na porta ${PORT}`);
});
