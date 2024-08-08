import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import { Socket } from 'net';
// import alertRoutes from './routes/alertRoutes';
import { fetchCryptoPrices } from './services/cryptoService';
// import { checkAlerts } from './services/alertService';
import wss from './websocket/webSocket';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
const MONGO_URI :string | undefined = process.env.MONGO_URL;

if (!MONGO_URI) {
    console.error('MongoDB connection string (MONGO_URL) is not defined in environment variables.');
    process.exit(1);
  }

app.use(express.json());
// app.use('/api', alertRoutes);

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    fetchCryptoPrices();
    // checkAlerts();
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });

server.on('upgrade', (request: http.IncomingMessage, socket: Socket, head: Buffer) => {
  wss.handleUpgrade(request, socket, head, (ws: any) => {
    wss.emit('connection', ws, request);
  });
});
