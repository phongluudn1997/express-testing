var mongoose = require('mongoose');

var Category = mongoose.Schema({
    name: { type: String },
    image: { type: String }
})

module.exports = mongoose.model('Category', Category, 'categories');