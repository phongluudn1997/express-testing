var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://user:user123@ds119996.mlab.com:19996/eventsdb', { useNewUrlParser: true }, err => {
    if (err) {
        console.error(err);
    }
    else {
        console.log('Connect to DB');
    }
})
mongoose.set('useCreateIndex', true);

router.use('/users', require('./userAPI'))
router.use('/products', require('./productAPI'))

module.exports = router;