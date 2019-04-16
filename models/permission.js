var mongoose = require('mongoose');

var Permission = mongoose.Schema({
    action_code : {
        type: String, 
        unique: true
    },
    action_name : {
        type: String
    }
});

module.exports = mongoose.model('Permission', Permission, 'permissions');