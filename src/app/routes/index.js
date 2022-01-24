const addressRouter = require('./address');
const categoryRouter = require('./category');
const industryRouter = require('./industry');
const orderRouter = require('./order');
const productRouter = require('./product');
const siteRouter = require('./site');
const transactionRouter = require('./transaction');
const userRouter = require('./user');

function route(app) {
    app.use('/api/address', addressRouter);

    app.use('/api/categories', categoryRouter);

    app.use('/api/industry', industryRouter);

    app.use('/api/orders', orderRouter);

    app.use('/api/products', productRouter);

    app.use('/', siteRouter);

    app.use('/api/transaction', transactionRouter);

    app.use('/api/user', userRouter);
}

module.exports = route;
