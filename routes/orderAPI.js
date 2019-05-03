var express = require('express');
var router = express.Router();
var Order = require('../models/order');
var Product = require('../models/product');
var checkToken = require('../middleware/checkToken');

// Dat hang 
router.post('/', checkToken, async (req, res) => {
    let total_price = 0;
    for(let i = 0; i < req.body.items.length; i++){
        total_price += req.body.items[i].pricePerUnit * req.body.items[i].quantity;
    }

    let order = new Order({
        user: req.decoded.userId,
        items: req.body.items,
        total_price: total_price
    })

    order
    .save()
    .then(order => res.status(200).json({
        message: 'success',
        order: order
    }))
    .catch(err => res.status(500).json({
        message: 'error',
        error: err
    }));

});

// GET all orders
router.get('/', (req, res) => {
    Order
    .find()
    .exec()
    .then(orders => res.status(200).json({
        message: 'success',
        orders: orders
    }))
    .catch(err => res.status(400).json({
        message: 'error',
        error : err
    }));
});




module.exports = router;