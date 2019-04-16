var mongoose = require('mongoose');

var Role = mongoose.Schema({
    name_role: {
        type: String
    },
    permissions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Permission'}]
})

module.exports = mongoose.model('Role', Role, 'roles');