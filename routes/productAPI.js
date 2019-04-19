var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var moment = require('moment');
const checkToken = require('../middleware/checkToken');
const checkAuth = require('../middleware/checkAuth');
const define = require('../lib/define');

// Setting file storage for uploading images
var multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})

// Get all products
router.get('/', (req, res, next) => {
    Product.find().exec().then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    user: doc.user,
                    _id: doc._id,
                    name: doc.name,
                    price: doc.price,
                    created_at: moment(doc.created_at).format("dddd"),
                    images: doc.images
                }
            })
        }
        res.status(200).json(response)
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

// Post a product
router.post('/', checkToken, upload.array('images', define.limitImageProduct), (req, res, next) => {
    var arrImagePaths = [];
    if (req.files) {
        req.files.forEach((item) => {
            arrImagePaths.push(item.path)
        })
    }
    const product = new Product({
        user: req.decoded.userId,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        created_at: Date.now(),
        images: arrImagePaths
    })
    product.save().then(result => {
        console.log(result);
        res.status(200).json({
            message: "Created product successfully",
            'Produce created': {
                _id: result._id,
                User: result.user,
                name: result.name,
                description: result.description,
                price: result.price,
                images: result.images,
                created_at: moment(result.created_at).format("MMMM Do YYYY, h:mm:ss a")
            }
        })
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            success: false,
            error: err
        })
    })

})


router.get('/luu',checkToken,(req, res) => {
    // if(checkAuth(req.decoded.userId,"1") == true){
    //     res.json({
    //         message: 'Auth success roi ne'
    //     })
    // } else {
    //     res.json({
    //         messgage: 'false'
    //     })
    // }
    console.log(checkAuth(req.decoded.userId, "1"))
   
})

// Get product by id
router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    Product.findOne({ _id: id }).populate('user').exec((err, result) => {
        if (err) res.status(500).json({ err })
        else {
            if (result != null) {
                res.status(500).json({
                    success: true,
                    product: result
                })
            }
            else {
                res.status(404).json({
                    success: false,
                    message: 'No product with that _id'
                })
            }
        }
    })
})

// Update product by id
router.put('/:id', checkToken, upload.array('images'), (req, res, next) => {
    updateObject = {};
    arrImagePaths = [];
    if (req.files) {
        req.files.forEach(item => {
            arrImagePaths.push(item.path)
        })
        updateObject.images = arrImagePaths
    }
    for (var key in req.body) {
        updateObject[key] = req.body[key]
    }


    Product.findOneAndUpdate({ _id: req.params.id }, updateObject, (err, result) => {
        if (result.user != req.decoded.userId) {
            console.log('Auth failed')
            return res.status(404).json({
                success: false,
                message: 'Auth Failed'
            })
        } else {
            if (err) {
                console.log(err)
                res.status(500).json({
                    error: err
                })
            } else {
                res.status(200).json({
                    success: true,
                    message: 'Update successfully',
                    result: result,
                })
            }
        }

    })

})

// Delete product by id
router.delete('/:_id', checkToken, (req, res, next) => {
    Product.findOneAndDelete({ _id: req.params._id }, (err, result) => {
        if (req.decoded.userId != result.user) {
            res.status(404).json({
                success: false, 
                message: 'Auth failed'
            })
        }
        else {
            if (err) {
                console.log(err)
                res.status(500).json({
                    error: err
                })
            } else {
                res.status(200).json({
                    success: true,
                    message: 'Delete successfully'
                })
            }
        }
    })
})




module.exports = router;