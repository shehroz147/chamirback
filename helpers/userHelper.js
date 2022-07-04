// Mongoose
const mongoose = require("mongoose");

// Models
const User = require("../models/userModel");
const Product = require("../models/product");


exports.findUser = async (email, password) => {
    return await User.findOne({
        email: email,
        isVerified: true,
        password: password
    });
}
exports.foundUserById = async (_id) => {
    return await User.findOne({ _id: _id });
}


exports.updateUser = async (findObj, setObj) => {
    return await User.updateOne(findObj, { $set: setObj });
}


exports.findUserPass = async (email, pass) => {
    return await User.find({ email: email, password: pass });
}

exports.findUserIdByEmail = async (email) => {
    return await User.findOne({ email: email })
}