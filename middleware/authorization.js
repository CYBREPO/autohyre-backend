const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { constants } = require('../constant/constant');

const validateToken = asyncHandler(async (req, res, next) => {
    let token = "";
    const authHeader = req.headers.authorization || req.headers.Authorization;
    console.log(req.headers)
    if (authHeader && authHeader.startsWith('Bearer')) {
        token = authHeader.split(' ')[1];
        console.log(token)
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.status(constants.UNAUTHORIZED);
                throw new Error("Unauthorized User");
            }
            req.user = decoded;
            next();
        })
    }
    else{
        res.status(constants.UNAUTHORIZED);
        throw new Error("Unauthorized User");
    }
});

exports.validateToken = validateToken;