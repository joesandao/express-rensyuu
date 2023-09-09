const express = require('express');
const router = express();

const { Inventory, Sales } = require('../models/models');
// (1) 在庫の更新、作成
router.post('/stock', async (req, res) => {
    const { name, amount } = req.body;
    let product = await Product.findOne({ name });
    if (!product) {
        product = new Product({ name, stock: amount, sales: 0 });
    } else {
        product.stock += amount;
    }
    await product.save();
    res.send({ name, amount });
});

// (2) 在庫チェック
router.get('/stock/:name?', async (req, res) => {
    if (req.params.name) {
        const product = await Product.findOne({ name: req.params.name });
        return res.send({ name: product.name, stock: product.stock });
    } else {
        const products = await Product.find({ stock: { $gt: 0 } });
        res.send(products.map(product => ({ name: product.name, stock: product.stock })));
    }
});

// (3) 販売
router.post('/sell', async (req, res) => {
    const { name, amount } = req.body;
    const product = await Product.findOne({ name });
    if (product && product.stock >= amount) {
        product.stock -= amount;
        product.sales += amount;
        await product.save();
        res.send({ message: "Sale completed." });
    } else {
        res.status(400).send({ message: "Not enough stock or product doesn't exist." });
    }
});

// (4) 売り上げチェック
router.get('/sales', async (req, res) => {
    const totalSales = await Product.aggregate([{ $group: { _id: null, total: { $sum: "$sales" } } }]);
    res.send({ totalSales: totalSales[0].total });
});

// (5) 全削除
router.delete('/reset', async (req, res) => {
    await Product.deleteMany({});
    res.send({ message: "All data deleted." });

});

module.exports = router;
