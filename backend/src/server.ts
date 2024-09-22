import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import app, { init } from './app.js';

const port = +process.env.PORT || 4000;
const httpServer = createServer(app);
const io = new SocketServer(httpServer, { cors: { origin: '*' } });

io.on('connection', (socket) => {
   socket.on('joinRoom', async (room) => {
      await socket.join(room);
   });

   socket.on('disconnect', () => {});
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
