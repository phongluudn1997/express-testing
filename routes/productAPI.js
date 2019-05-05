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

// Get products by Category
router.get('/category/:_idCat', (req, res, next) => {
    Product
    .find({category: req.params['_idCat']})
    .populate('category')
    .exec()
    .then(docs => {
        const response = {
            success: true,
            count: docs.length,
            products: docs.map(doc => {
                return {
                   // user: doc.user,
                    _id: doc._id,
                    name: doc.name,
                    category: doc.category.name,
                    price: doc.price + 'đ',
                   // quantity: doc.quantity,
                   // description: doc.description,
                    created_at: moment(doc.created_at).format("dddd"),
                    image: `http://localhost:3000/${doc.images[0]}`
                }
            })
        }
        res.status(200).json(response)
    }).catch(err => {
        res.status(200).json({
            success: false,
            message: err
        })
    })
})



// Post a product - check if login - check if permission
router.post('/', checkToken, upload.array('images', define.limitImageProduct), async (req, res, next) => {
    if (await checkAuth(req.decoded.userId, define.CREATE_PRODUCT)) {
        var arrImagePaths = [];
        if (req.files) {
            req.files.forEach((item) => {
                arrImagePaths.push(item.path)
            })
        }
        const product = new Product({
            user: req.decoded.userId,
            category: req.body.category,
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity,
            description: req.body.description,
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
                    category: result.category,
                    name: result.name,
                    quantity: result.quantity,
                    price: result.price,
                    description: result.description,                
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
    }
    else{
        res.json({
            message: 'Auth failed'
        })
    }
})

router.get('/luu', checkToken, async (req, res) => {
    try {
        if (await checkAuth(req.decoded.userId, define.UPDATE_PRODUCT)) {
            console.log('OK -> Continue')
        }
        else {
            console.log('Auth failed')
        }
    } catch (e) {
        console.error(e)
    }
})

// router.get('/luu',checkToken,(req, res) => {
//     checkAuth(req.decoded.userId, "0", function(err, result){
//         if(err){
//             console.log(err)
//         }
//         else if(!result){
//             console.log(result)
//         } else {
//             console.log(result)
//         }
//     })
// })

// Get product by id
router.get('/:_id', (req, res, next) => {
    const _id = req.params._id;
    Product
    .findOne({ _id: _id })
    .populate('user')
    .populate('category')
    .exec()
    .then(product => {
        res.json({
            success: true,
            name: product.name,
            price:  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(product.price),
            images: product.images.map(image => 'http://localhost:3000/'+image),
            quantity: product.quantity,
            category: product.category.name,
            user_name: product.user.email,
            description: product.description
        })
    })
    .catch(err => {
        res.json({
            success: false,
            message: 'No Product'
        })
    });
    
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