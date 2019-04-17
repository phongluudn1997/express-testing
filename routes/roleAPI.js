var express = require('express');
var router = express.Router();

var Role = require('../models/role');
var permissions = require('../models/permission');

router.post('/', (req, res) => {
    const role = new Role({
        name_role: req.body.name,
        permissions: req.body.permissions
    })
    role.save().then(result => {
        res.status(200).json({
            message: 'success',
            role: result
        })
    }).catch(err => {
        res.status(500).json({
            message: 'error',
            error: err
        })
    })
})

router.put('/:_id', (req, res) => {
    Role.findOneAndUpdate({_id: req.params._id}, {permissions: req.body.permissions}, (err, doc) => {
        if(err){
            res.status(500).json({
                messgage: "error",
                err: err
            })
        } else{
            res.status(200).json({
                message: 'success',
                Role: doc
            })
        }
    })
})

router.get('/', (req, res) => {
    Role.
        find().
        populate('permissions').
        exec((err, result) => {
            if (err) {
                res.status(500).json({
                    message: 'error',
                    error: err
                })
            } else {
                res.status(200).json({
                    message: 'success',
                    roles: result.map(role => {
                        return {
                            name : role.name_role,
                            _id: role._id,
                            permissions: role.permissions.map(permission => permission.action_name)
                        }
                    })
                })
            }
        })
})

router.delete('/:_id', (req, res) => {
    Role.findOneAndDelete({_id: req.params._id}, (err, result) =>{
        if(err){
            res.status(500).json({
                message: 'error',
                error: err
            })
        } else {
            res.status(200).json({
                message: 'success - Deleted successfully'
            })
        }
    })
})

module.exports = router;