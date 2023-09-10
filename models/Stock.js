// models/Stock.js
const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Stock', stockSchema);
