const User = require("../models/userModel");
const mongoose = require('mongoose');
const UserHelper = require('../helpers/userHelper');
const Token = require('../models/tokenModel');
const EmailHelper = require('../utils/emailHelper');
const jwt = require("jsonwebtoken");


exports.registerUser = async (req, res) => {
    let request = req.body;
    console.log(request);
    let email = request.email;
    let password = request.password;

    let credentialsCheck = await this.checkCredentials(email.toLowerCase(), password);
    if (!credentialsCheck) {
        return res.status(400).json("Missing required information")
    }

    let checkEmail = await User.findOne({ email: email.toLowerCase() });
    // console.log(checkEmail);
    if (!(checkEmail === null)) {
        return res.status(400).json("Email already exists");
    }
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: email.toLowerCase(),
        password: password,
    });
    await user.save();
    return res.status(200).json("Successful");
};


exports.createAdmin = async (req, res) => {
    let request = req.body;
    console.log(request);
    let email = request.email;
    let password = request.password;

    let credentialsCheck = await this.checkCredentials(email.toLowerCase(), password);
    if (!credentialsCheck) {
        return res.status(400).json("Missing required information")
    }

    let checkEmail = await User.findOne({ email: email.toLowerCase() });
    // console.log(checkEmail);
    if (!(checkEmail === null)) {
        return res.status(400).json("Email already exists");
    }
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: email.toLowerCase(),
        password: password,
    });
    await user.save();
    return res.status(200).json("Successful");
};



exports.checkCredentials = async (email, password) => {
    if (!email || !password) {
        return false;
    }
    return true;
}



exports.tokenCreater = async (email) => {
    return jwt.sign({
        iss: 'Attornea',
        sub: email,
        iat: new Date().getTime(), // current time
        exp: Math.floor(Date.now() / 1000) + (60 * 60)// 60 minutes
    }, process.env.JWT_SECRET || 'Attornea123$');
}


exports.decodeToken = async (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return err;
    }
}


exports.verifyEmail = async (req, res) => {

    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send("Invalid link");

    const token = await Token.findOne({
        userId: user._id,
        token: req.params.token,
    });
    if (!token) return res.status(400).send("Invalid link");

    await User.updateOne({ _id: user._id }, { isVerified: true });
    await Token.findByIdAndRemove(token._id);

    res.status(200).json("email verified sucessfully");


}


exports.login = async (req, res) => {

    let request = req.body;
    let email = request.email;
    let password = request.password;
    const checkEmail = await User.findOne({ email: req.body.email, password: password });
    if (checkEmail === null) {
        return res.status(401).json("Invalid");
    }
    return res.status(200).json(checkEmail);
};
//checked
exports.askQuestion = async (req, res) => {

    let province = req.body.province
    let city = req.body.city
    let title = req.body.title
    let areaOfLaw = req.body.areaOfLaw
    let description = req.body.description
    let id = req.body.id;
    const findUser = await User.findOne({ _id: id });
    const ques = new Question({
        _id: new mongoose.Types.ObjectId(),
        city: city,
        title: title,
        province: province,
        areaOfLaw: areaOfLaw,
        description: description,
        user: findUser._id
    })
    await ques.save();
    // await Question.find({ _id: ques._id }).populate("userId");
    return res.status(200).json("Question Posted")
}



exports.shareDiary = async (req, res) => {

    let lawyerId = req.body.lawyerId;
    let userId = req.body.userId;
    const updateInfo = {
        sharedDiary: req.body.lawyerId
    }
    const findUser = await User.updateOne({ _id: userId }, { $set: updateInfo }).exec();
    // await Question.find({ _id: ques._id }).populate("userId");
    return res.status(200).json("Diary Shared")
}



exports.hire = async (req, res) => {
    let userId = req.body.userId
    const findUser = await User.find({ _id: userId })
    console.log(findUser)
    if (findUser.length === 0) {
        return res.status(400).json("User doesnot Exists")
    }

    let province = req.body.province
    let city = req.body.city
    let title = req.body.title
    let areaOfLaw = req.body.areaOfLaw
    let purpose = req.body.purpose
    let budget = req.body.budget
    let hireType = req.body.hireType
    if (!(province && purpose && budget)) {
        return res.status(400).json("Something Missing")
    }

    const hiree = new hireLawyer({
        _id: new mongoose.Types.ObjectId(),
        purpose: purpose,
        budget: budget,
        hireType: hireType,
        areaOfLaw: areaOfLaw,
        city: city,
        province: province,
        title: title,
        userId: userId
    })
    await hiree.save()
    return res.status(200).json("Done---")
}

exports.talk = async (req, res) => {
    let userId = req.body.userId
    const findUser = await User.find({ _id: userId })
    console.log(findUser)
    if (findUser.length === 0) {
        return res.status(400).json("User doesnot Exists")
    }
    let province = req.body.province
    let city = req.body.city
    let areaOfLaw = req.body.areaOfLaw
    if (!(city && areaOfLaw)) {
        return res.status(400).json("Feilds Missing")
    }
    const talkk = new Talk({
        _id: new mongoose.Types.ObjectId(),
        province: province,
        city: city,
        areaOfLaw: areaOfLaw,
        userId: userId
    })
    await talkk.save();
    return res.status(200).json("done--")
}


exports.viewRecentQuestions = async (req, res) => {
    let request = req.body;
    let queries = [];
    queries = await Question.find()
    return res.status(200).json(queries).populate("user");
}

exports.viewLawyers = async (req, res) => {
    let request = req.body;
    let lawyerList = [];
    lawyerList = await User.find({ role: "Lawyer" }).limit(6).sort({ createdAt: -1 });
    return res.status(200).json(lawyerList);
}

exports.viewAllLawyers = async (req, res) => {
    let request = req.body;
    let lawyerList = [];
    lawyerList = await User.find({ role: "Lawyer" });
    return res.status(200).json(lawyerList);
}



exports.showAllStudents = async (req, res) => {
    let request = req.body;
    let lawyerList = [];
    lawyerList = await User.find({ role: "Student" });
    return res.status(200).json(lawyerList);
}


exports.getLawyerByCategory = async (req, res) => {
    let request = req.body;
    let lawyerList = [];
    lawyerList = await User.find({ role: "Lawyer", areaOfSpecialization: req.body.category });
    return res.status(200).json(lawyerList);
}

exports.getUserData = async (req, res) => {
    let request = req.body;
    let id = request.id;
    let findUser = await User.findOne({ _id: id });
    if (findUser === 'null') {
        return res.status(400).json("User with thhis email doesnot exist")
    }
    else {
        return res.status(200).json(findUser);
    }
}


exports.getStudentData = async (req, res) => {
    let request = req.body;
    let id = request.id;
    let findUser = await User.findOne({ _id: id });
    if (findUser === 'null') {
        return res.status(400).json("User with thhis email doesnot exist")
    }
    else {
        return res.status(200).json(findUser);
    }
}


exports.getLawyerData = async (req, res) => {
    let request = req.body;
    // console.log(req.body.email);
    let id = request.id;
    // console.log(request);
    let findUser = await User.findOne({ _id: id });
    // console.log(findUser[0])
    if (findUser === null) {
        return res.status(400).json("User with thhis email doesnot exist")
    }
    else {
        return res.status(200).json(findUser);
    }
}

exports.viewqueries = async (req, res) => {

    const question = await Question.find({ isDeleted: false }).limit(6).sort({ createdAt: -1 }).populate("user");
    console.log(question);
    return res.status(200).json(question);
}


exports.showAllQuestion = async (req, res) => {

    const question = await Question.find({ isDeleted: false }).sort({ createdAt: -1 }).populate("user");
    console.log(question);
    return res.status(200).json(question);

}


exports.showQuestion = async (req, res) => {

    const id = req.body.id;
    const question = await Question.find({ _id: id }).populate("user").populate('comments.user');
    console.log(question);
    return res.status(200).json(question);

}


exports.getLawyerInfo = async (req, res) => {
    let request = req.body;
    // console.log(req.body.email);
    let id = request.id;
    // console.log(request);
    let findUser = await User.findOne({ _id: id });
    console.log(findUser)
    if (findUser.length === 0) {
        return res.status(400).json("User with thhis email doesnot exist")
    }
    else {
        return res.status(200).json(findUser);
    }
}


exports.unAnsweredQuestions = async (req, res) => {
    let id = req.body.id;
    console.log(id);
    const questions = await Question.find({ 'comments.user': { $ne: `${id}` } }).populate("user");
    console.log(questions);
    return res.status(200).json(questions);
}

exports.updateUser = async (req, res) => {
    let request = req.body;
    let id = req.body.id;
    const findUser = await User.findOne({ _id: id });
    const updateInfo = {
        firstName: req.body.firstName || findUser.firstName,
        gender: req.body.gender || findUser.gender,
        bio: req.body.bio || findUser.description,
        profileImage: req.body.imageUrl || findUser.profileImage
    };
    await User.updateOne({ _id: id }, { $set: updateInfo })
        .exec()
        .then(docs => {
            result = docs;
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    return res.status(200).json("successfull");
}


exports.updateLawyer = async (req, res) => {
    let request = req.body;
    console.log(request);
    const findUser = await User.findOne({ _id: req.body.id });
    const updateInfo = {
        firstName: req.body.firstName || findUser.firstName,
        gender: req.body.gender || findUser.gender,
        bio: req.body.bio || findUser.description,
        // email: req.body.email || findUser.email,
        profileImage: req.body.imageUrl || findUser.profileImage,
        licenseNo: req.body.License || findUser.licenseNo,
        education: req.body.education || findUser.education,
        workExperience: req.body.workExperience || findUser.workExperience,
        practiceArea: req.body.practiceArea || findUser.practiceArea,
        consultationFee: req.body.fee || findUser.consultationFee,
        areaOfSpecialization: req.body.areaOfSpecialization || findUser.areaOfSpecialization
    }
    await User.updateOne({ _id: req.body.id }, { $set: updateInfo });

    return res.status(200).json("successfull");
}

exports.showMyQuestions = async (req, res) => {

    const question = await Question.find({ user: req.body.id, isDeleted: false }).sort({ createdAt: -1 }).populate("user").populate('comments.user');
    console.log(question);
    return res.status(200).json(question);

}

exports.showResponded = async (req, res) => {

    let id = req.body.id;
    const findUser = await User.findOne({ _id: id });

    // console.log(email);
    const question = await Question.find({
        $getField: {
            comments: { $elemMatch: { user: id } }
        }
    });
    console.log(question)
    return res.status(200).json(question);

}


exports.showMyResponded = async (req, res) => {

    let id = req.body.id;
    const findUser = await User.findOne({ _id: id });
    console.log(findUser);
    // console.log(email);
    const question = await Question.find(

        {
            comments: { $elemMatch: { user: findUser._id } }

        }).populate('comments.user');
    console.log(question)
    return res.status(200).json(question);

}

exports.showAllUsers = async (req, res) => {

    let users = await User.find().sort({ createdAt: -1 });
    // let lawyers = await Lawyer.find().sort({ createdAt: -1 });
    // Array.prototype.push.apply(users, lawyers);
    return res.status(200).json(users);

}

exports.showEarnings = async (req, res) => {

    let users = await User.find({ role: "Lawyer" }).sort({ createdAt: -1 });
    // let lawyers = await Lawyer.find().sort({ createdAt: -1 });
    // Array.prototype.push.apply(users, lawyers);
    return res.status(200).json(users);

}

exports.showPosts = async (req, res) => {

    // let users = await User.find().sort({ createdAt: -1 });
    let posts = await Post.find().sort({ createdAt: -1 }).populate("user");
    // Array.prototype.push.apply(users, lawyers);
    // console.lo
    console.log(posts);
    return res.status(200).json(posts);

}


exports.addPost = async (req, res) => {

    let data = req.body.data;
    const id = req.body.id;
    const image = req.body.image;
    const user = await User.findOne({ _id: id });
    // console.log(user[0].firstName);
    const post = new Post({
        _id: new mongoose.Types.ObjectId(),
        data: data,
        image: image,
        user: id
    });
    await post.save();
    return res.status(200).json("success");
    // const post = await Question.find().limit(6).sort({ createdAt: -1 });
    // console.log(question);
    // return res.status(200).json(question);

}

exports.addComment = async (req, res) => {
    let request = req.body;
    // console.log(request);
    let questionId = request.questionId;
    const id = req.body.id;
    const user_ = await User.findOne({ _id: id });
    console.log("The user profile is :", user_);
    let findQuestion = await Question.findOne({ _id: questionId });
    const comments = {
        user: user_._id,
        comment: request.Description
    };
    console.log(comments)
    let addComment = await Question.updateOne({ _id: questionId }, { $push: { comments: comments } });
    return res.status(200).json("successfull");
}

exports.updateComment = async (req, res) => {
    let request = req.body;
    // console.log(request);
    let questionId = request.questionId;
    const id = req.body.userId;
    const user_ = await User.findOne({ _id: id });
    console.log("The user profile is :", user_);
    let findQuestion = await Question.findOne({ _id: questionId });
    const comments = {
        comment: request.comment
    };
    console.log(comments)
    let addComment = await Question.updateOne({ _id: questionId, comment: { $elemMatch: { user: id } } }, { comments: { $set: { comment: comments } } });
    return res.status(200).json("successfull");
}


exports.commentOnPost = async (req, res) => {
    // console.log(req.body);
    let postId = req.body.postId;
    let userId = req.body.userId;
    let comment = req.body.desc;
    let user = await User.findOne({ _id: userId });
    let post = await Post.findOne({ _id: postId });
    const comments = {
        user: user._id,
        comment: comment
    }
    // console.log(post);
    let addComment = await Post.updateOne(post, { $push: { comments: comments } });
    return res.status(200).json("Comment added")
    // exports.addFriend = async (user, friend, res) => {
    //     return User.updateOne(user, { $push: { friends: { friend } } });
    // }
}

exports.editBooking = async (req, res) => {
    let id = req.body.id;
    const findBooking = await Booking.findOne({ _id: id });
    const findUser = await User.findOne({ _id: findBooking.lawyerId });
    console.log(findUser);
    await Booking.updateOne({ _id: id }, { $set: { status: req.body.status } }).exec();
    const newEarnings = findUser.earnings + findBooking.charges;
    await User.updateOne({ _id: findBooking.lawyerId }, { $set: { earnings: newEarnings } }).exec();
    return res.status(200).json("Done");
}

exports.deleteUser = async (req, res) => {
    let email = req.body.email;
    const deleteData = await User.deleteOne({ email: email }).exec();
    return res.status(200).json("deleted")
}



exports.createBooking = async (req, res) => {
    let request = req.body;
    console.log(request)
    let userId = request.userId;
    let lawyerId = request.lawyerId;
    let time = request.time;
    let date = request.date;
    let userName = request.userName;
    let phoneNumber = request.phoneNumber;
    let charges = request.fee;
    const booking = new Booking({
        _id: new mongoose.Types.ObjectId(),
        userId: userId,
        lawyerId: lawyerId,
        time: time,
        date: date,
        userName: userName,
        phoneNumber: phoneNumber,
        charges: charges
    });
    await booking.save();
    return res.status(200).json("Successful");
};

exports.showBookings = async (req, res) => {

    // let users = await User.find().sort({ createdAt: -1 });
    let bookings = await Booking.find().sort({ createdAt: -1 }).populate("userId").populate("lawyerId");
    // Array.prototype.push.apply(users, lawyers);
    // console.lo
    return res.status(200).json(bookings);
}

exports.showAllBookings = async (req, res) => {

    let bookings = await Booking.find({ lawyerId: req.body.id, status: "Approved" }).sort({ createdAt: -1 }).populate("userId").populate("lawyerId");
    return res.status(200).json(bookings);
}

exports.showUserBookings = async (req, res) => {

    let bookings = await Booking.find({ userId: req.body.id, status: "Approved" }).sort({ createdAt: -1 }).populate("userId").populate("lawyerId");
    return res.status(200).json(bookings);
}
