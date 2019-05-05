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
    Cart
        .findOne({ user: userId })
        .populate('user')
        .populate('items.product')
        .exec()
        .then(cart => {
            if (cart == null) {
                res.status(200).json({
                    success: false,
                    message: 'Cart have not been created yet'
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
                                image: 'http://localhost:3000/' + item.product.images[0],
                                quantity: item.quantity,
                                price_no_format: item.product.price,
                                price: new Intl.NumberFormat('de-DE',{style: 'currency', currency: 'VND'}).format(item.product.price),
                                price_per_product:  new Intl.NumberFormat('de-DE',{style: 'currency', currency: 'VND'}).format(item.quantity * item.product.price)
                            }
                        }),
                        total_quantity: cart.items.reduce((total, item) => total+item.quantity,0),
                        total_price:  new Intl.NumberFormat('de-DE',{style: 'currency', currency: 'VND'}).format(cart.items.reduce((total, item) => total + item.product.price*item.quantity,0)) 
                    }
                })
            }
        })
        .catch(err => {
            res.json({
                success: false,
                message: err
            })
        });
})

// Change quantity of Cart item
router.post('/update', checkToken, (req, res) => {
    _idProduct = req.body._idProduct;
    quantity = req.body.quantity;
    Cart
    .findOne({user: req.decoded.userId})
    .exec()
    .then(cart => {
        let existItem = cart.items.filter(item => item.product == _idProduct)[0];
        if(existItem){
            existItem.quantity = quantity;
            cart.save().then(
                result => {
                    res.json({
                        success: true,
                        cart: result
                    })
                }
            ).catch(err => {
                res.json({
                    success: false,
                    message: err
                })
            });
        }
        else{
            res.json({
                success: false,
                message: 'No item with that ID in cart'
            })
        }
    })
    .catch(err => {
        res.json({
            success: false,
            message: err
        })
    })
})

// Delete product from Cart
router.post('/delete',checkToken, (req, res) => {
    _idProduct = req.body._idProduct;
    Cart
    .findOne({user: req.decoded.userId})
    .exec()
    .then(cart => {
        FoundItemIndex = cart.items.findIndex(item => item.product._id = _idProduct);
        if(FoundItemIndex < 0){
            // Not Found
            res.json({
                success: false,
                message: 'Product not found'
            })
        }
        else{
            cart.items.splice(FoundItemIndex, 1);
            cart.save().then(result=>{
                res.json({
                    success: true,
                    message: 'Delete successfully',
                    cart: cart
                })
            }).catch( err => {
                res.json({
                    success: false,
                    message: err
                })
            });
        }
    })
    .catch(err =>{
        res.json({
            success: false,
            message: err
        })
    });
})

// Clear item in Cart 
router.get('/clear', checkToken,(req,res)=>{
    Cart
    .findOneAndUpdate({user: req.decoded.userId}, {items:[]})
    .exec()
    .then(result => {
        res.json({
            success: true,
            message: 'Clear Cart Successfully'
        })
    })
    .catch(err => {
        res.json({
            success: false,
            message: err
        })
    })
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