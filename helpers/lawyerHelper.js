const mongoose = require("mongoose");

// Models
const Lawyer = require("../models/lawyerModel");
const Case = require('../models/caseModel');
const req = require("express/lib/request");


exports.findLawyer = async (email) => {
    return await User.find({ email: email, role: "Lawyer" });
}

exports.findLawyerPass = async (email, pass) => {
    return await User.find({ email: email, password: pass, role: "Lawyer" });
}


exports.addCase = async (request, user) => {
    console.log(request.nextHiring);
    // const userEmail = request.userEmail;
    const myCase = new Case({
        _id: new mongoose.Types.ObjectId(),
        user: user._id,
        title: request.title,
        category: request.category,
        stage: request.stage,
        nextHiring: request.nextHiring,
        // previousHiring: request.previousHiring,
        startingDate: request.startingDate,
        notes: request.notes,
        courtName: request.courtName,
    })
    return await myCase.save();


}
