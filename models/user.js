var mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String,
        required: true
    },
    user_role: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Role',
        default: '5cb2d26f7dd8dd437cdbfe32'
    }
})

module.exports = mongoose.model('User', userSchema, 'users');