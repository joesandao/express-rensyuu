// server.js
const express = require('express');
const mongoose = require('mongoose');
const stockRoutes = require('./route/stockRoutes');

const app = express();
mongoose.connect('mongodb://localhost:27017/aws', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use('/v1', stockRoutes);

mongoose.connection.on('error', err => {
  console.error('Failed to connect to MongoDB', err);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
