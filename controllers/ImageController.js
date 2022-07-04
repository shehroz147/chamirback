// const ResponseHelper 	= require("../Services/ResponseHelper");
const UserHelper = require("../helpers/userHelper");
const GeneralHelper = require("../helpers/generalHelper");
// const Message 			= require("../Constants/Message.js");
// const ResponseCode 		= require("../Constants/ResponseCode.js");

exports.update = async (req, res, next) => {

    // let response = ResponseHelper.getDefaultResponse();
    // let userId = req.body.productId;

    // let foundUser = await UserHelper.foundUserById(userId);
    // if (foundUser == null) {
    //     // response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.USER_NOT_EXIST);
    //     return res.status(400).json("Invalid");
    // }
    console.log(req.body);

    let imageName = GeneralHelper.makeImagePath(process.env.PROFILE_DIR, req.file.name);

    await UserHelper.updateUser({ email: "shehroz.virk147@gmail.com" }, { profileImage: imageName });

    // response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.IMAGE_UPDATE_SUCCESS, imageName);
    res.status(200).json("successfull");
}


exports.remove = async (req, res, next) => {

    // let response = ResponseHelper.getDefaultResponse();
    let userId = req.user.userId;

    let foundUser = await UserHelper.foundUserById(userId);
    if (foundUser == null) {
        // response = ResponseHelper.setResponse(ResponseCode.NOT_SUCCESS, Message.USER_NOT_EXIST);
        return res.status(400).json("Invalid");
    }

    let imageName = process.env.DEFAULT_PROFILE;
    await UserHelper.updateUser({ _id: foundUser._id }, { profileImage: imageName });

    // response = ResponseHelper.setResponse(ResponseCode.SUCCESS, Message.IMAGE_REMOVED_SUCCESS, imageName);
    res.status(200).json("Success");
};