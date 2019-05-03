var mongoose = require('mongoose');

var Cart = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number }
        }
    ],
   
})

module.exports = mongoose.model('Cart', Cart, 'cart');