const express = require('express');
const bodyParser = require('body-parser');

const userRouter = require('./Router/userRouter');
const productRouter = require('./Router/productRouter');

const app = express();

app.use(bodyParser.json());

app.use(express.static(`${__dirname}/public}`));

//routers
app.use('/api/v1/user', userRouter);
app.use('/api/v1/product', productRouter);

module.exports = app;
