var express = require('express');
var router = express.Router();

var User = require('../models/user');
var jwt = require('jsonwebtoken');

var bcrypt = require('bcrypt');

// middleware verify token
function checkToken(req, res, next) {
    let token = req.headers.authorization; // Express headers are auto converted to lowercase
    if (token) {
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string, it will return Bearer + token
            token = token.split(' ')[2];
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
                        password: hash
                    });
                    user.save().then(result => {
                        console.log(result)
                        res.status(201).json({
                            message: "User created",
                            User: result
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
                res.status(400).json('No user with that email')
            }
            else {
                bcrypt.compare(req.body.password, userOutput.password, (err, same) => {
                    if (err) res.status(401).json({
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
                        res.status(401).json({
                            message: "Wrong password"
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
        .populate('post')
        .exec((err, users) => {
            if (err) res.status(500).json(err)
            res.status(200).json(users)
        })
})



module.exports = router;