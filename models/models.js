const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
    name: String,
    amount: Number,
});

const SalesSchema = new mongoose.Schema({
    sales: Number,
});

const Inventory = mongoose.model('Inventory', InventorySchema);
const Sales = mongoose.model('Sales', SalesSchema);

module.exports = {
    Inventory,
    Sales
};
