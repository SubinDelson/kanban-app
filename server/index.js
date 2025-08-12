// server/index.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/db');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const authRoutes = require('./routes/authRoutes');
const workspaceRoutes = require('./routes/workspaceRoutes');
const boardRoutes = require('./routes/boardRoutes');
const listRoutes = require('./routes/listRoutes');
const cardRoutes = require('./routes/cardRoutes');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api', boardRoutes); // board endpoints
app.use('/api', listRoutes);  // list endpoints
app.use('/api/cards', cardRoutes); // card endpoints

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*' }
});

// simple socket auth middleware
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next();
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = payload.id;
    next();
  } catch (err) {
    next();
  }
});

io.on('connection', (socket) => {
  console.log('Socket connected', socket.id, 'user:', socket.userId);

  socket.on('joinBoard', (boardId) => {
    socket.join('board:' + boardId);
    console.log(`Socket ${socket.id} joined board:${boardId}`);
  });

  socket.on('leaveBoard', (boardId) => {
    socket.leave('board:' + boardId);
  });

  socket.on('card:move', (payload) => {
    // broadcast to others in room
    socket.to('board:' + payload.boardId).emit('card:moved', payload);
  });

  socket.on('card:created', (payload) => {
    socket.to('board:' + payload.boardId).emit('card:created', payload);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected', socket.id);
  });
});

server.listen(PORT, () => console.log(`Server running on ${PORT}`));
