var mongoose = require('mongoose')

const Product = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    name: { type : String },
    description: { type: String }, 
    price: { type: Number, required: true},
    created_at: Date,
    quantity: Number,
    images: { type: [String] },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category'}
})

module.exports = mongoose.model('Product', Product, 'products');