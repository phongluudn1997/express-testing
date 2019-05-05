const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try { 
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, 'secretKey')
        req.decoded = decoded
        next();
    }
    catch(error){
        return res.json({
            success: false,
            message: "Auth failed"
        })
    }
}