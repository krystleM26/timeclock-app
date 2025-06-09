const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors')
const path = require('path')


require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();


// Middleware
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI,)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('❌ MongoDB connection error:', err.message));




const timeEntryRoutes = require('./routes/timeEntries');


// Routes
app.use('/api/timeEntries', timeEntryRoutes);

app.get('/', (req, res) => {
  res.send('Timeclock API is live');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
