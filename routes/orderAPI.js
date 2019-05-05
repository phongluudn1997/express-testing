var express = require('express');
var router = express.Router();
var Order = require('../models/order');
var Cart = require('../models/cart');
var Product = require('../models/product');
var moment = require('moment')
var checkToken = require('../middleware/checkToken');

// Dat hang 
router.post('/', checkToken, async (req, res) => {
    let total_price = 0;
    for (let i = 0; i < req.body.items.length; i++) {
        total_price += req.body.items[i].price * req.body.items[i].quantity;
    }

    let order = new Order({
        user: req.decoded.userId,
        items: req.body.items,
        fullName: req.body.user.fullName,
        address: req.body.user.address,
        phoneNumber: req.body.user.phoneNumber,
        total_price: total_price
    })

    order
        .save()
        .then(order =>
            res.status(200).json({
                message: 'success',
                order: order
            }))
        .catch(err => res.status(500).json({
            message: 'error',
            error: err
        }));

});

// Get Order By Id
router.get('/:_id', (req, res) => {
    Order
        .findOne({ _id: req.params['_id'] })
        .populate('items.product')
        .exec()
        .then(order => {
            res.json({
                success: true,
                order: {
                    userNhanHang:{
                        phoneNumber: order.phoneNumber,
                        fullName: order.fullName,
                        address: order.address
                    },
                    items: order.items.map(item => {
                        return {
                            name: item.product.name,
                            image: 'http://localhost:3000/'+item.product.images[0],
                            price: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(item.price),
                            quantity: item.quantity,
                            pricePerProduct: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(item.price*item.quantity),
                        }
                    }),
                    total_price: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(order.total_price),
                    created_at: moment(order.created_at).format("MMM Do YY"),
                    _id: order._id
                }
            })
        })
        .catch(err => {
            res.json({
                success: false,
                message: err
            })
        })
})

// Get Orders Of User 
router.get('/user/:_id', (req, res) => {
    Order
        .find({ user: req.params['_id'] })
        .populate('items.product')
        .exec()
        .then(orders => {
            res.json({
                success: true,
                orders: orders.map(order => {
                    return {
                        _id: order._id,
                        created_at: moment(order.created_at).format("MMM Do YY"),
                        products: order.items.map(item => {
                            return item.product.name
                        }),
                        total_price: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(order.total_price)
                    }
                })
            })

        })
        .catch()
})

// GET all orders
router.get('/all', (req, res) => {
    Order
        .find()
        .exec()
        .then(orders => res.status(200).json({
            message: 'success',
            orders: orders
        }))
        .catch(err => res.status(400).json({
            message: 'error',
            error: err
        }));
});




module.exports = router;