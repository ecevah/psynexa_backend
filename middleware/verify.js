const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    const token = req.headers['x-access-token'] ||req.body.token || req.query.token

    if (token) {
        jwt.verify(token, process.env.SECRET_KEY_LOGER, (err, decoded) => {
            if (err) {
                res.json({
                    status: false,
                    message: 'Failed to authenticate token',
                    err: err,
                })

            } else {
                req.decode = decoded;
                res.json({
                    status: true,
                    message: 'JWT Authenticate True',
                    decoded
                })
            }
        })
    } else {
        res.json({
            status: false,
            message: 'No token provided.'
        })
    }
};