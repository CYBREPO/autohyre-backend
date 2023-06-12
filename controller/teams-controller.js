const asyncHandler = require('express-async-handler');
const { constants } = require('../constant/constant');
const { leader } = require('../models/leaders');
const teamsModel = require('../models/teams').teams;
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

        res.status(constants.OK).json({
            success: true, message: "data save successfully", data: {
                name: result.name,
                id: result._id,
            }
        });
    }
    res.status(constants.VALIDATION_ERROR);
    throw new Error('Invalid request');
});

exports.getAllLeaders = asyncHandler(async (req, res) => {
    const result = await leader.find({}).exec();

    res.status(constants.OK).json({ success: true, data: result });
});

exports.getTeams = asyncHandler(async (req,res) => {
    const teams = await teamsModel.findOne().exec();
    if(teams){
        res.status(constants.OK).json({success: true, data: teams});
    }
    res.status(constants.VALIDATION_ERROR);
    throw new Error("Not Found");
});

exports.saveTeams = asyncHandler(async (req, res) => {
    if (req.body) {
        const { bannerImg, leadersProfile, boardsProfile, leaders, boardOfDirectors } = req.files;

        let banner = {};
        if (bannerImg) {
            const base64 = await fileUploadController.SingleUpload(brandImg);

            banner = {
                filename: bannerImg.originalname,
                contentType: bannerImg.mimetype,
                imageBase64: base64
            }

        }

        let imgArray;
        if (leadersProfile) {
            imgArray = await fileUploadController.Uploads(leadersProfile);
        }
        let leadersArr = [];
        leaders.map((item, index) => {
            leadersArr.push({
                name: item.name,
                designation: item.designation,
                description: item.description,
                profile: {
                    filename: leadersProfile[index].originalname,
                    contentType: leadersProfile[index].mimetype,
                    imageBase64: imgArray[index]
                }
            })
        });
        
        if (boardsProfile) {
            imgArray = await fileUploadController.Uploads(boardsProfile);
        }
        let boardArr = [];
        leaders.map((item, index) => {
            boardArr.push({
                name: item.name,
                designation: item.designation,
                description: item.description,
                profile: {
                    filename: boardsProfile[index].originalname,
                    contentType: boardsProfile[index].mimetype,
                    imageBase64: imgArray[index]
                }
            })
        });

        const teams = await teamsModel.create({
            header: req.body.header,
            bannerImg: banner,
            leaders: leadersArr,
            boardOfDirectors: boardArr
        });

        if(teams){
            res.status(constants.OK).json({success: true, meesage: "teams saved successfully"});
        }
        res.status(constants.VALIDATION_ERROR);
        throw new Error('Something went wrong');

    }
    res.status(constants.VALIDATION_ERROR);
    throw new Error('Invalid request');
});

exports.updateTeams = asyncHandler(async (req, res) => {
    if (req.body) {
        const { bannerImg, leadersProfile, boardsProfile, leaders, boardOfDirectors } = req.files;

        let banner = {};
        if (bannerImg) {
            const base64 = await fileUploadController.SingleUpload(brandImg);

            banner = {
                filename: bannerImg.originalname,
                contentType: bannerImg.mimetype,
                imageBase64: base64
            }

        }

        let imgArray;
        if (leadersProfile) {
            imgArray = await fileUploadController.Uploads(leadersProfile);
        }
        let leadersArr = [];
        leaders.map((item, index) => {
            leadersArr.push({
                name: item.name,
                designation: item.designation,
                description: item.description,
                profile: {
                    filename: leadersProfile[index].originalname,
                    contentType: leadersProfile[index].mimetype,
                    imageBase64: imgArray[index]
                }
            })
        });
        
        if (boardsProfile) {
            imgArray = await fileUploadController.Uploads(boardsProfile);
        }
        let boardArr = [];
        leaders.map((item, index) => {
            boardArr.push({
                name: item.name,
                designation: item.designation,
                description: item.description,
                profile: {
                    filename: boardsProfile[index].originalname,
                    contentType: boardsProfile[index].mimetype,
                    imageBase64: imgArray[index]
                }
            })
        });

        const teams = await teamsModel.findByIdAndUpdate(req.body.id, {$set: {
            header: req.body.header,
            bannerImg: banner,
            leaders: leadersArr,
            boardOfDirectors: boardArr
        }});

        if(teams){
            res.status(constants.OK).json({success: true, meesage: "teams saved successfully"});
        }
        res.status(constants.VALIDATION_ERROR);
        throw new Error('Something went wrong');

    }
    res.status(constants.VALIDATION_ERROR);
    throw new Error('Invalid request');
});