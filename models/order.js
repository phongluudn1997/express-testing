var mongoose = require('mongoose');

var Order = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            pricePerUnit: { type: Number, required: true, default: 0 },
            quantity: { type: Number, default: 1}
        }
    ],
    created_at: { type: Date, default: Date.now() },
    total_price: { type: Number, default: 0 }
})

module.exports = mongoose.model('Order', Order, 'orders');