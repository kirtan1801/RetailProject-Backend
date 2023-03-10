const express = require('express');
const bodyParser = require('body-parser');

const userRouter = require('./Router/userRouter');
const productRouter = require('./Router/productRouter');
const orderRouter = require('./Router/orderRouter');
const reviewRouter = require('./Router/reviewRouter');
const accountRouter = require('./Router/accountRouter');
const cartRouter = require('./Router/cartRouter');
const promocodeRouter = require('./Router/promocodeRouter');

const app = express();

app.use(bodyParser.json());

app.use(express.static(`${__dirname}/public}`));

//routers
app.use('/api/v1/user', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/accountDetails', accountRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/promocode', promocodeRouter);

module.exports = app;
