const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const timeEntryRoutes = require('./routes/timeEntries');
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // 🔑 .env must be loaded early



const app = express();

// ✅ 1. Apply CORS first
app.use(cors());

// ✅ 2. Middleware to parse JSON
app.use(express.json());

// ✅ 3. MongoDB connection (before routes)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));

// ✅ 4. Request logger
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

// ✅ 5. Register routes
app.use('/timeEntries', timeEntryRoutes);

// ✅ 6. Basic test routes
app.get('/', (req, res) => {
  res.send('hello world');
});

app.post('/test', (req, res) => {
  console.log('🔥 Received body:', req.body);
  res.json({ message: 'Test successful' });
});

// ✅ 7. Start server
const PORT = 5050;
app.listen(PORT, () => {
  console.log(`✅ Server live at http://localhost:${PORT}`);
});
