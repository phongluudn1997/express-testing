const User = require('../models/user')

const jwt = require('jsonwebtoken');

module.exports = (userId, action_code) => {
    User
        .findOne({ _id: userId })
        .populate({
            path: 'user_role',
            populate: {
                path: 'permissions',
                match: { action_code: action_code }
            }
        })
        .exec((err, user) => {
            if (err) {
                return console.log(err)
            }
            else if (user.user_role.permissions.length == 0) {
                return false
            }
            else {
                console.log(user.user_role.permissions)
                return true
            }
        })
}