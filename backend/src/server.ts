import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import app, { init } from './app.js';

const port = +process.env.PORT || 4000;
const httpServer = createServer(app);
const io = new SocketServer(httpServer, { cors: { origin: '*' } });

io.on('connection', (socket) => {
   console.log('Um cliente conectado:', socket.id);
   socket.emit('log', 'Você está conectado!');
   socket.on('joinRoom', async (room) => {
      console.log('cliente entrou na sala:', room);
      await socket.join(`${room}`);
   });

   socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
   });
});

init()
   .then(() => {
      httpServer.listen(port, () => {
         console.log(`Server is listening on port ${port}.`);
      });
   })
   .catch((err) => {
      console.error(err);
   });

export { io };
