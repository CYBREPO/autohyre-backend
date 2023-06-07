
const constant = require('../constant/constant').constants;
const userModel = require('../models/user').user;
const bcrypt = require('bcrypt');
const jwt  = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { email } = require('./email');
const fileUploadController = require('../controller/fileUpload-controller');
const encryptController = require('./encryption');

exports.getUserDetails = asyncHandler(async (req, res) => {
    let id = req.query.id;
    if (id > 0) {
        let v = await userModel.findOne({ id: id }).exec();
        return res.status(constant.OK).json(v);
    }
    res.status(constant.VALIDATION_ERROR);
    throw new Error("Invalid request");
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

    let profile = {}
    if (req.file) {
        const base64 = await fileUploadController.SingleUpload(profile[0]);

        profile = {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
            imageBase64: base64
        }
    }

    const regUser = await userModel.create({
        name: req.body.name,
        mobile: req.body.mobile,
        email: req.body.email,
        password: hashPassword,
        profile: profile,
        isAdmin: req.body.isAdmin ?? false,
    });

    if (regUser) {
        res.status(constant.CREATED).json({ id: regUser._id, email: regUser.email });
    }
    else {
        res.status(constant.VALIDATION_ERROR);
        throw new Error("User data not valid");
    }

});

exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(constant.VALIDATION_ERROR);
        throw new Error("Email and Password is required");
    }

    const user = await userModel.findOne({ email }).exec();

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
            { expiresIn: "10m" });

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
        throw new Error("Invalid User Credentials");
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

    res.status(200).json({ message: "success" });
});

exports.updatePassword = asyncHandler(async (req, res) => {
    if (req.body) {
        const hashPassword = await bcrypt.hash(req.body.password, 10);
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