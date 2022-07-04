//  JSON Web Token
const JWT = require('jsonwebtoken');

// Constants
// const Message           = require("../Constants/Message.js");
// const ResponseCode      = require("../Constants/ResponseCode.js");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const user = JWT.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(400).json("Failed")

    }
};