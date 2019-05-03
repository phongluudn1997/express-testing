var router = require('express').Router();
var Cart = require('../models/cart');
var checkToken = require('../middleware/checkToken');

// Add product to cart 
router.post('/add', checkToken, (req, res) => {
    let _idProduct = req.body._idProduct;
    let quantity = req.body.quantity;
    let exist = false;
    Cart
        .findOne({ user: req.decoded.userId })
        .exec()
        .then(cart => {
            let existItem = cart.items.filter(item => item.product == _idProduct)[0];
            if (existItem) {
                // Exist => add more quantity 
                existItem.quantity += quantity;
            }
            else {
                cart.items.push({
                    product: _idProduct,
                    quantity: quantity
                })
            }
            // How to check if no product with that id in Cart ??
            cart.save((err, result) => {
                if (err) {
                    res.status(500).json({
                        message: 'error',
                        error: err
                    })
                } else {
                    res.status(200).json({
                        message: 'success',
                        cart: result
                    })
                }
            })
        })
        .catch(err => { console.log(err) });
})

// Get Cart with User Id 
router.get('/', checkToken, (req, res) => {
    let userId = req.decoded.userId;
    // Cart.findOne({ user: userId }, (err, cart) => {
    //     if (err) {
    //         res.status(500).json({
    //             message: 'error',
    //             error: err
    //         })
    //     } else if (cart == null) {
    //         res.status(400).json({
    //             message: 'error',
    //             error: 'No Auth'
    //         })
    //     } else {
    //         res.status(200).json({
    //             message: 'success',
    //             cart: cart
    //         })
    //     }
    // })
    Cart
        .findOne({ user: userId })
        .populate('user')
        .populate('items.product')
        .exec()
        .then(cart => {
            if (cart == null) {
                res.status(400).json({
                    message: 'error',
                    error: 'No Auth'
                })
            }
            else {
                res.status(200).json({
                    message: 'success',
                    cart: {
                        _id: cart._id,
                        user:{
                            userId : cart.user._id,
                            email: cart.user.email
                        },
                        items: cart.items.map(item => {
                            return {
                                _id: item.product._id,
                                name: item.product.name,
                                image: item.product.images[0],
                                quantity: item.quantity,
                                price: item.product.price,
                                price_per_product: item.quantity * item.product.price
                            }
                        }),
                        total_price: cart.items.reduce((total, item) => total + item.product.price*item.quantity,0)
                    }
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'error',
                error: err
            })
        });
})

router.get('/all', (req, res) => {
    Cart
        .find()
        .populate('user')
        .exec().then(result => {
            res.json(result)
        }).catch();
})

module.exports = router;