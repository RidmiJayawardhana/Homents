const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const { providerRouter, bookingRouter, notifRouter, complaintRouter, userRouter } = require('./routes/routes');
const { Message } = require('./models/Other');

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = socketIo(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', methods: ['GET', 'POST'] }
});

// Connect to MongoDB
connectDB();

const seedAll = require('./seed');

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/providers', providerRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/notifications', notifRouter);
app.use('/api/complaints', complaintRouter);
app.use('/api/users', userRouter);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', time: new Date() }));

// Socket.IO chat
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  socket.on('userOnline', (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit('onlineUsers', Array.from(onlineUsers.keys()));
  });

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
  });

  socket.on('sendMessage', async (data) => {
    try {
      const message = await Message.create({
        chatRoom: data.roomId,
        sender: data.senderId,
        receiver: data.receiverId,
        content: data.content,
        messageType: data.messageType || 'text',
        image: data.image
      });
      const populated = await message.populate('sender', 'fullName avatar');
      io.to(data.roomId).emit('newMessage', populated);
    } catch (error) {
      console.error('Message error:', error);
    }
  });

  socket.on('typing', (data) => {
    socket.to(data.roomId).emit('userTyping', { userId: data.userId, isTyping: data.isTyping });
  });

  socket.on('disconnect', () => {
    for (const [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) { onlineUsers.delete(userId); break; }
    }
    io.emit('onlineUsers', Array.from(onlineUsers.keys()));
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  console.log(`🚀 Homents Server running on port ${PORT}`);
  await seedAll().catch(err => console.error('Seed error:', err.message));
});

// Messages route
app.get('/api/messages/:roomId', async (req, res) => {
  try {
    const messages = await Message.find({ chatRoom: req.params.roomId })
      .populate('sender', 'fullName avatar')
      .sort({ createdAt: 1 });
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = { app, io };
