const express = require('express');
const mongoose = require('mongoose');
const stockRoutes = require('./route/stockRoutes');

const app = express();


mongoose
    .connect('mongodb://127.0.0.1:27017/DatabaseName')
    .then(() =>{
    console.log("DB接続中");
    }).catch((err) => {
        console.log(err);
    });


// 接続が成功した場合のリスナー
mongoose.connection.once('open', () => {
    console.log('Successfully connected to MongoDB.');
});

// エラーが発生した場合のリスナー
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

app.use(express.json());
app.use('/v1', stockRoutes);



const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});