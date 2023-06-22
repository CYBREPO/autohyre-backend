
const constant = require('../constant/constant').constants;
const userModel = require('../models/user').user;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { email } = require('./email');
const encryptController = require('./encryption');
const fileUploadController = require('./fileUpload-controller');

exports.getUserDetails = asyncHandler(async (req, res) => {
    let id = req.query.id;
    if (id > 0) {
        let v = await userModel.findOne({ id: id }).exec();
        return res.status(constant.OK).json(v);
    }
    res.status(constant.VALIDATION_ERROR);
    throw new Error("Invalid request");
});

exports.getUsers = asyncHandler(async (req, res) => {
    let { pageSize, pageIndex, searchText } = req.body;
    let query = {};
    if (searchText && searchText != "") {
        query['$text'] = { $search: searchText };
    }

    const totalCount = await userModel.countDocuments(query);
    if (totalCount > pageSize) {
        const result = await userModel.find(query).skip((pageIndex - 1) * pageSize).limit(pageSize).exec();
        return res.status().json({ success: true, data: result, count: totalCount });
    }
    const result = await userModel.find(query).exec();
    return res.status(constant.OK).json({ success: true, data: result, count: totalCount });
});

exports.registerUser = asyncHandler(async (req, res) => {
    const { name, phone, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(constant.VALIDATION_ERROR);
        throw new Error("All fields are required");
    }

    const userExist = await userModel.findOne({ email }).exec();
    if (userExist) {
        res.status(constant.VALIDATION_ERROR);
        throw new Error("User already registered");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const regUser = await userModel.create({
        name: req.body.name,
        mobile: req.body.mobile,
        email: req.body.email,
        password: hashPassword,
        profile: req.file ?req.file?.path?.split('uploads\\')[1] : "",
        isAdmin: req.body.isAdmin ?? false,
    });

    if (regUser) {
        res.status(constant.CREATED).json({ success: true, message: 'Registered Successfully', data: { id: regUser._id, email: regUser.email } });
    }
    else {
        res.status(constant.VALIDATION_ERROR);
        throw new Error("User data not valid");
    }

});

exports.updateUserStatus = asyncHandler(async (req, res) => {
    if (req.body.id) {
        const user = await userModel.findByIdAndUpdate(req.body.id, { isActive: req.body.isActive });
        if (user)
            res.status(constant.OK).json({ success: true, message: "User has been blocked" });
        else {
            res.status(constant.VALIDATION_ERROR);
            throw new Error('Record not found');
        }
    }
    res.status(constant.VALIDATION_ERROR);
    throw new Error('Invalid request');
});

exports.deleteUser = asyncHandler(async (req, res) => {
    if (req.query.id) {
        const user = await userModel.findByIdAndDelete(req.query.id);
        if (user) {
            if(user.profile)
                fileUploadController.removeFiles([user.profile]);
            return res.status(constant.OK).json({ success: true, message: "User has been deleted" });
        }
        res.status(constant.VALIDATION_ERROR);
        throw new Error('User not deleted');
    }
    res.status(constant.VALIDATION_ERROR);
    throw new Error('Invalid request');
});

exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(constant.VALIDATION_ERROR);
        throw new Error("Email and Password is required");
    }

    const user = await userModel.findOneAndUpdate({ email: email, isActive: true }, { lastLogin: new Date() }).exec();

    if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({
            user: {
                email: user.email,
                name: user.name,
                id: user._id,
                admin: user.isAdmin
            }
        },
            process.env.JWT_SECRET,
            { expiresIn: "100m" });

        let param = {
            message: "Logged In Successfully",
            data: {
                email: user.email,
                name: user.name,
                id: user._id,
                profile: user.profile,
                token: token,
                isAdmin: user.isAdmin
            },
            success: true

        }

        res.status(constant.OK).json(param);
    }
    else {
        res.status(constant.UNAUTHORIZED);
        throw new Error("Invalid User Credentials or User has been blocked");
    }

});

exports.resetPassword = asyncHandler(async (req, res) => {

    const user = await userModel.findOne({ email: req.body.email }).exec();

    if (user) {
        const now = new Date();

        const year = now.getUTCFullYear();
        const month = now.getUTCMonth() + 1;
        const day = now.getUTCDate();
        const hours = now.getUTCHours();
        const minutes = now.getUTCMinutes();
        const seconds = now.getUTCSeconds();

        const genLink = process.env.AUTOHYRELINK + "/account/reset-passeord/" + encryptController.encrypt(user._id) +
            "/" + encryptController.encrypt(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);

        let emailBody = {
            body: {
                name: user.name,
                intro: 'You have received this mail because a password reset request for your account was received',
                action: {
                    instructions: 'Click the button below to reset your password',
                    button: {
                        color: '#22BC66', // Optional action button color
                        text: 'Reset your Password',
                        link: process.env.AUTOHYRELINK + "/account/reset-password/" + encryptController.encrypt(user._id) +
                            "/" + encryptController.encrypt(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`)
                    }
                },
                outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
            }
        }

        let info = await email({ mails: req.body.email, email: emailBody });
    }

    res.status(200).json({ success: true, message: "Password reset successful" });
});

exports.updatePassword = asyncHandler(async (req, res) => {
    if (req.body) {
        const hashPassword = await bcrypt.hash(req.body.password, 10);
        if (req.body.oldPassword != null && req.body.oldPassword != "") {
            //check if old password matches
            let userCheck = await userModel.findById(req.body.id).exec();

            if (!userCheck || userCheck.password != hashPassword) {
                res.status(constant.VALIDATION_ERROR);
                throw new Error("Old password is invalid");
            }

        }

        let user = await userModel.findOneAndUpdate({ _id: req.body.id }, { password: hashPassword }).exec();

        if (!user) {
            res.status(constant.VALIDATION_ERROR);
            throw new Error('Error in updating the user');
        }

        res.status(constant.OK).json({ success: true, message: "Password reset successfully" });
    }
    else {
        res.status(constant.VALIDATION_ERROR);
        throw new Error('Invalid request');
    }
});

exports.updateUser = asyncHandler(async (req, res) => {
    if (req.body) {
        let update = {};
        if (req.file) {
            // const usrP = await userModel.findById(req.body.id);
            // if (usrP && usrP.profile)
            //     fileUploadController.removeFiles([usrP.profile]);

            update['profile'] = req.file.path.split('uploads\\')[1]

        }
        update['name'] = req.body.name;
        update['email'] = req.body.email;
        let user;
        if (req.body.id && req.body.id != "") {
            user = await userModel.findByIdAndUpdate(req.body.id, update).exec();
            if(user && user.profile && req.file)
                fileUploadController.removeFiles([user.profile]);
        }
        else {
            update['password'] = await bcrypt.hash('Pass@123', 10);
            update['isAdmin'] = false
            user = await userModel.create(update);
        }


        if (user) {
            return res.status(constant.OK).json({ success: true, message: 'User Details Saved successfully', data: user });
        }
        // res.status(constant.VALIDATION_ERROR);
        // throw new Error('user does not exists');
    }
    res.status(constant.VALIDATION_ERROR);
    throw new Error('Invalid request');
})

exports.getCount = asyncHandler(async (req, res) => {

    const totalUser = await userModel.countDocuments();

    const loggedInUser = await userModel.countDocuments({ lastLogin: { $ne: null } });
    if (totalUser) {
        return res.status(constant.OK).json({ success: true, data: { totalUser: totalUser, loggedInUser: loggedInUser } });
    }
    res.status(constant.VALIDATION_ERROR);
    throw new Error('Something went wrong');
})