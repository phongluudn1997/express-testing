var express = require('express');
var router = express.Router();

var Cart = require('../models/cart');
var User = require('../models/user');
var Role = require('../models/role');
var Permission = require('../models/permission');
var jwt = require('jsonwebtoken');

var bcrypt = require('bcrypt');

// middleware verify token
function checkToken(req, res, next) {
    let token = req.headers.authorization; // Express headers are auto converted to lowercase
    if (token) {
        if (token.startsWith('Bearer')) {
            // Remove Bearer from string, it will return Bearer token
            token = token.split(' ')[1];
        }
        jwt.verify(token, 'secretKey', (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: 'Token is not valid'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.json({
            success: false,
            message: 'Auth token is not supplied'
        });
    }
};

// Register

router.post('/register', (req, res, next) => {
    User.find({ email: req.body.email }).exec().then(user => {
        if (user.length >= 1) {
            return res.status(409).json({
                message: 'Mail existed'
            })
        }
        else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    })
                } else {
                    const user = new User({
                        email: req.body.email,
                        password: hash,
                        user_role: req.body.user_role,
                        fullName: req.body.fullName,
                        phoneNumber: req.body.phoneNumber,
                        address: req.body.address
                    });

                    user.save().then(result => {
                        // Check if user is customer, then create a cart
                        if (result.user_role == '5cb72bf9edf6ea1b7cee748a') {
                            const cart = new Cart({
                                user: result._id,
                                items: []
                            })
                            cart.save().then(result => {
                                console.log('create cart successfully')
                            }).catch(err => {
                                res.status(500).json({
                                    message: 'error',
                                    error: err
                                })
                            });
                        }
                        console.log(result)
                        res.status(201).json({
                            message: "User created",
                            result: result,
                            User: {
                                _id: result._id,
                                email: result.email,
                                password: result.password,
                                user_role: result.user_role,
                                fullName: result.user.fullName,
                                phoneNumber: result.user.phoneNumber,
                                address: result.user.address
                            }
                        })
                    }).catch(err => {
                        console.log(err)
                        res.status(500).json({
                            error: err
                        })
                    })
                }
            })
        }
    })
})

// Login

router.post('/login', (req, res) => {
    let userInput = req.body;
    User.findOne({ email: userInput.email }, (err, userOutput) => {
        if (err) {
            console.log(err)
            res.status(500).json({
                error: err
            })
        }
        else {
            if (!userOutput) {
                res.status(200).json({
                    message: 'error',
                    err: "No user with that email"
                })
            }
            else {
                bcrypt.compare(req.body.password, userOutput.password, (err, same) => {
                    if (err) res.status(200).json({
                        message: "Error",
                        error: err
                    })
                    if (same) {
                        const token = jwt.sign({ userId: userOutput._id }, 'secretKey')
                        return res.status(200).json({
                            message: "Auth successful",
                            token: token,
                            userId: userOutput._id
                        })
                    }
                    else {
                        res.status(200).json({
                            message: 'error',
                            err: "Wrong password"
                        })
                    }
                })
            }
        }
    })
})

// Delete User
router.delete('/:userId', (req, res, next) => {
    User.findOneAndDelete(req.params.userId).exec().then(result => {
        res.status(200).json({
            message: "User deleted"
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})



router.get('/', (req, res) => {
    User
        .find()
        .populate({ path: 'user_role', populate: { path: 'permissions' } })
        .exec((err, users) => {
            if (err) res.status(500).json(err)
            res.status(200).json({
                message: 'sucesss',
                users: users.map(user => {
                    return {
                        user_id: user._id,
                        user_email: user.email,
                        user_password: user.password,
                        user_role: user.user_role.name_role,
                        user_permissions: user.user_role.permissions.map(per => per.action_name),
                        user_fullName: user.fullName,
                        user_address: user.address,
                        user_phoneNumber: user.phoneNumber
                    }
                })
            })
        })
})

// Get information of a User
router.get('/:_id', (req, res) => {
    let _id = req.params._id;
    User
        .findOne({ _id: _id })
        .populate('user_role')
        .exec()
        .then(user => {
            res.status(200).json({
                message: 'success',
                user: {
                    email: user.email,
                    role: user.user_role.name_role,
                    fullName: user.fullName,
                    address: user.address,
                    phoneNumber: user.phoneNumber
                }
            })
        })
        .catch(err => {
            res.status(200).json({
                message: 'error',
                error: err
            })
        });
})

// Update User Info
router.put('/update', checkToken, (req, res) => {
    _idUser = req.decoded.userId;
    console.log(_idUser)
    User.findOneAndUpdate({_id: _idUser}, req.body, (err, user) => {
        if(err){
            res.json({
                success: false,
                message: err
            })
        } else {
            res.json({
                success: true,
                message: 'Update successfully',
                user: {
                    _id: user._id,
                    email: user.email,
                    password: user.password,
                    fullName: user.fullName,
                    address: user.address,
                    phoneNumber: user.phoneNumber
                },
            })
        }
    })
})





module.exports = router;