import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import locationRouter from './routes/location.js';
import Location from './models/Location.js'; // ✅ Added
import path from 'path';
import { fileURLToPath } from 'url';


dotenv.config();

// For ES modules, derive __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());
app.use('/api/location', locationRouter);

// ✅ Connect MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// ✅ Live Socket.io setup
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('location-update', async (data) => {

    const { userId, latitude, longitude } = data;

    try {

      await Location.findOneAndUpdate(
        { userId }, // Filter: if userId exists
        {
          $set: {
            latitude,
            longitude,
            updatedAt: new Date()
          }
        },
        { upsert: true } // Insert if not exists
      );

      console.log('Location update:', data);

      io.emit('location-tracked', data);
    } catch (err) {
      console.error('Error saving location:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Serve static files from the React app build
const clientBuildPath = path.join(__dirname, './react');
app.use(express.static(clientBuildPath));

// Catch-all route to serve index.html for any other requests
app.get('/', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
