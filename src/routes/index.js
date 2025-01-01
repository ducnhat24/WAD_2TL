const express = require('express');
const siteRoute = require('../components/site/route/SiteRoute');
const productRoute = require('../components/product/route/ProductRoute');
const productAPIRoute = require('../components/product/route/ProductAPIRoute');
const userAPIRoute = require('../components/admin/route/UserAPIRoute');
const customerRoute = require('../components/customer/route/CustomerRoute');
const customerAPIRoute = require('../components/customer/route/CustomerAPIRoute');
const categoryAPIRoute = require('../components/category/route/CategoryAPIRoute');
const brandAPIRoute = require('../components/brand/route/BrandAPIRoute');
const orderAPIRoute = require('../components/customer/route/OrderAPIRoute');

function route(app) {
    app.use('/', siteRoute);

    app.use('/product', productRoute);
    app.use('/api/product', productAPIRoute);

    app.use('/api/user', userAPIRoute);

    app.use('/customer', customerRoute);
    app.use('/api/customer', customerAPIRoute);

    app.use('/api/category', categoryAPIRoute);
    app.use('/api/brand', brandAPIRoute);

}

module.exports = { route };