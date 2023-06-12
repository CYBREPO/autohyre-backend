const asyncHandler = require('express-async-handler');
const { constants } = require('../constant/constant');
const { leader } = require('../models/leaders');
const fileUploadController = require('./fileUpload-controller');

exports.saveLeaders = asyncHandler(async (req, res) => {
    if (req.body) {
        let profile = {}
        if (req.file) {
            const base64 = await fileUploadController.SingleUpload(req.file);
            profile = {
                filename: req.file.originalname,
                contentType: req.file.mimetype,
                imageBase64: base64
            }
        }

        const result = await leader.create({
            name: req.body.name,
            designation: req.body.designation,
            bio: req.body.bio,
            profile: profile
        });

        res.status(constants.OK).json({success: true, message: "data save successfully", data: {
            name: result.name,
            id: result._id,
        }});
    }
    res.status(constants.VALIDATION_ERROR);
    throw new Error('Invalid request');
});

exports.getAllLeaders = asyncHandler(async (req, res) => {
    const result = await leader.find({}).exec();

    res.status(constants.OK).json({success: true, data : result });
});

exports.saveTeams = asyncHandler(async (req,res) => {
    console.log(req.body);
    if(req.body){
        // console.log(req.files);
    }
    res.status(constants.OK).json();
    // throw new Error('Invalid request');
})