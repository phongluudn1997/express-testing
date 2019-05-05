var router = require('express').Router();
var multer = require('multer');
const Category = require('../models/category');

// Setting Upload image
//Storage
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-'+ file.originalname)
    }
})
//fileFilter
var fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}
//limits
var limits = {
    fileSize: 1024 * 1024 * 5
}

var upload = multer({
    storage: storage,
    limits: limits,
    fileFilter: fileFilter
})

// Create Cateogry
router.post('/', upload.single('image'), (req, res) => {
    
    const category = new Category({
        name: req.body.name,
        image: (req.file?req.file.path: null)
    })


    category.save(err => {
        if(err) {
            res.json({
                success: false, 
                error: err
            })
        } else{
            res.json({
                success: true,
                category:{
                    name: category.name,
                    image: category.image
                }
            })
        }
    })
})
// Get all Categories
router.get('/', (req, res) => {
    Category
    .find()
    .exec()
    .then(categories => {
        res.json({
            success: true,
            categories: categories.map(category => {
                return {
                    _id: category._id,
                    name: category.name,
                    image: 'http://localhost:3000/' + category.image
                }
            })
        })
    })
    .catch(err => {
        res.json({
            success: false,
            message : err
        })
    });
})

module.exports = router;