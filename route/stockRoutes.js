const express = require('express');
const Stock = require('../models/Stock');

const router = express.Router();

let totalSales = 0;

// ストック全取得
router.post('/stocks', async (req, res) => {
  const { name, amount } = req.body;

  if (!Number.isInteger(amount)) {
    return res.status(400).json({ message: 'ERROR' });
  }
  
  try {
    let stockItem = await Stock.findOne({ name });
    
    if (stockItem) {
      stockItem.amount += amount;
      await stockItem.save();
    } else {
      stockItem = new Stock({ name, amount });
      await stockItem.save();
    }
    
    res.status(200).json({ name, amount: stockItem.amount });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 在庫確認
router.get('/stocks', async (req, res) => {
  try {
    const stocks = await Stock.find();
    const response = {};
    
    stocks.forEach(stock => {
      response[stock.name] = stock.amount;
    });
    
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 販売システム
router.post('/sales', async (req, res) => {
  const { name, amount = 0 } = req.body;  // Set default value for amount
  const { price } = req.body;

  if (price && typeof price !== 'number') {
    return res.status(400).json({ error: 'Price must be a number when provided.' });
  }

  try {
    const stockItem = await Stock.findOne({ name });
    
    if (!stockItem || stockItem.amount < amount) {
      return res.status(400).json({ error: 'Not enough stock' });
    }
    
    stockItem.amount -= amount;
    
    if (price) {
      totalSales += amount ? amount * price : price;
    }

    await stockItem.save();
    
    res.status(200).json({ name, amount });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 売上確認
router.get('/sales', (req, res) => {
  res.status(200).json({ sales: totalSales });
});

// 全部消す
router.delete('/stocks', async (req, res) => {
  try {
    await Stock.deleteMany({});
    totalSales = 0;
    res.status(200).end();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
