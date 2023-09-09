
// routes/stockRoutes.js
const express = require('express');
const Stock = require('../models/Stock');

const router = express.Router();

let totalSales = 0; // 売上合計を保持

// (1) 在庫の更新、作成
router.post('/stocks', async (req, res) => {
  const { name, amount } = req.body;

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
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// (2) 在庫チェック
router.get('/stocks', async (req, res) => {
  try {
    const stocks = await Stock.find();
    const response = {};
    
    stocks.forEach(stock => {
      response[stock.name] = stock.amount;
    });
    
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// (3) 販売
router.post('/sales', async (req, res) => {
  const { name, amount } = req.body;
  
  try {
    const stockItem = await Stock.findOne({ name });
    
    if (!stockItem || stockItem.amount < amount) {
      return res.status(400).json({ error: 'Not enough stock' });
    }
    
    stockItem.amount -= amount;
    totalSales += amount; // 簡単のため、1つの商品の単価を1と仮定
    await stockItem.save();
    
    res.status(200).json({ name, amount });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// (4) 売り上げチェック
router.get('/sales', (req, res) => {
  res.status(200).json({ sales: totalSales });
});

// (5) 全削除
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
