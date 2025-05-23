const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Timeclock API is live');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
