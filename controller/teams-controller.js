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
        const {leaders, boardOfDirectors} = req.body;
        const { bannerImg, leadersProfile, boardsProfile } = req.files;

        let banner = {};
        if (bannerImg) {
            const base64 = await fileUploadController.SingleUpload(bannerImg[0]);

            banner = {
                filename: bannerImg[0].originalname,
                contentType: bannerImg[0].mimetype,
                imageBase64: base64
            }

        }

        let imgArray;
        if (leadersProfile) {
            imgArray = await fileUploadController.Uploads(leadersProfile);
        }
        let leadersArr = [];
        leaders.map((item, index) => {
            let file = {};
            if(leadersProfile && leadersProfile[index]){
                file = {
                    filename: leadersProfile[index].originalname,
                    contentType: leadersProfile[index].mimetype,
                    imageBase64: imgArray[index]
                }
                leadersArr.push({
                    name: item.name,
                    designation: item.designation,
                    description: item.description,
                    profile: file
                })
            }
            else{
                leadersArr.push({
                    name: item.name,
                    designation: item.designation,
                    description: item.description
                })
            }
            
        });
        imgArray = [];
        if (boardsProfile) {
            imgArray = await fileUploadController.Uploads(boardsProfile);
        }
        let boardArr = [];
        boardOfDirectors.map((item, index) => {
            let file = {}; 
            
            if(boardsProfile && boardsProfile[index]){
                file = {
                    filename: boardsProfile[index].originalname,
                    contentType: boardsProfile[index].mimetype,
                    imageBase64: imgArray[index]
                }
                boardArr.push({
                    name: item.name,
                    designation: item.designation,
                    description: item.description,
                    profile: file
                });
            }
            else{
                boardArr.push({
                    name: item.name,
                    designation: item.designation,
                    description: item.description
                });
            }

           
        });

        const teams = await teamsModel.create({
            header: req.body.header,
            bannerImg: banner,
            leaders: leadersArr,
            boardOfDirectors: boardArr
        });

        if(teams){
            return res.status(constants.OK).json({success: true, message: "teams saved successfully"});
        }
        res.status(constants.VALIDATION_ERROR);
        throw new Error('Something went wrong');

    }
    res.status(constants.VALIDATION_ERROR);
    throw new Error('Invalid request');
});

exports.updateTeams = asyncHandler(async (req, res) => {
    if (req.body) {
        const {leaders, boardOfDirectors} = req.body;
        const { bannerImg, leadersProfile, boardsProfile } = req.files;

        const dbTeam = await teamsModel.findById(req.body.id);

        let banner;
        if (bannerImg) {
            const base64 = await fileUploadController.SingleUpload(bannerImg[0]);

            banner = {
                filename: bannerImg[0].originalname,
                contentType: bannerImg[0].mimetype,
                imageBase64: base64
            }

        }

        let imgArray;
        if (leadersProfile) {
            imgArray = await fileUploadController.Uploads(leadersProfile);
        }
        let leadersArr = [];
        leaders.map((item, index) => {
            let file = {};
            if(leadersProfile && leadersProfile[index]){
                file = {
                    filename: leadersProfile[index].originalname,
                    contentType: leadersProfile[index].mimetype,
                    imageBase64: imgArray[index]
                }
                leadersArr.push({
                    name: item.name,
                    designation: item.designation,
                    description: item.description,
                    profile: file
                });
            }
            else{
                const file = dbTeam?.leaders.find(m => m._id.toString() == item.id);
                console.log(file)
                leadersArr.push({
                    name: item.name,
                    designation: item.designation,
                    description: item.description,
                    profile: file?.profile
                });
            }
        });
        
        imgArray = [];
        if (boardsProfile) {
            imgArray = await fileUploadController.Uploads(boardsProfile);
        }
        let boardArr = [];
        boardOfDirectors.map((item, index) => {
            let file = {}; 
            
            if(boardsProfile && boardsProfile[index]){
                file = {
                    filename: boardsProfile[index].originalname,
                    contentType: boardsProfile[index].mimetype,
                    imageBase64: imgArray[index]
                }
                boardArr.push({
                    name: item.name,
                    designation: item.designation,
                    description: item.description,
                    profile: file
                });
            }
            else{
                boardArr.push({
                    name: item.name,
                    designation: item.designation,
                    description: item.description
                });
            }

        });

        const param = {
            header: req.body.header,
            leaders: leadersArr,
            boardOfDirectors: boardArr
        }

        if(banner){
            param["bannerImg"] =  banner
        }

        // console.log(param)

        const teams = await teamsModel.updateOne({_id:req.body.id}, {$set:param});

        if(teams){
           return res.status(constants.OK).json({success: true, meesage: "teams saved successfully"});
        }
        res.status(constants.VALIDATION_ERROR);
        throw new Error('Something went wrong');

    }
    res.status(constants.VALIDATION_ERROR);
    throw new Error('Invalid request');
});