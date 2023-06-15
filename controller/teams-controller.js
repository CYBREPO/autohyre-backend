const asyncHandler = require('express-async-handler');
const { constants } = require('../constant/constant');
const { leader } = require('../models/leaders');
const teamsModel = require('../models/teams').teams;

exports.saveLeaders = asyncHandler(async (req, res) => {
    if (req.body) {
        let profile = {}
        if (req.file) {
            // const base64 = await fileUploadController.SingleUpload(req.file);
            // profile = {
            //     filename: req.file.originalname,
            //     contentType: req.file.mimetype,
            //     imageBase64: base64
            // }
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
        return res.status(constants.OK).json({success: true, data: teams});
    }
    res.status(constants.VALIDATION_ERROR);
    throw new Error("Not Found");
});

exports.saveTeams = asyncHandler(async (req, res) => {
    if (req.body) {
        const {leaders, boardOfDirectors} = req.body;
        const { bannerImg, leadersProfile, boardsProfile } = req.files;

  
        let leadersArr = [];
        leaders.map((item, index) => {
            // let file = {};
            if(leadersProfile && leadersProfile[index]){
                // file = {
                //     filename: leadersProfile[index].originalname,
                //     contentType: leadersProfile[index].mimetype,
                //     imageBase64: imgArray[index]
                // }
                leadersArr.push({
                    name: item.name,
                    designation: item.designation,
                    description: item.description,
                    profile: leadersProfile[index].path.split('uploads\\')[1]
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
        let boardArr = [];
        boardOfDirectors.map((item, index) => {
            // let file = {}; 
            
            if(boardsProfile && boardsProfile[index]){
                // file = {
                //     filename: boardsProfile[index].originalname,
                //     contentType: boardsProfile[index].mimetype,
                //     imageBase64: imgArray[index]
                // }
                boardArr.push({
                    name: item.name,
                    designation: item.designation,
                    description: item.description,
                    profile: boardsProfile[index].path.split('uploads\\')[1]
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
            bannerImg: bannerImg[0].path.split('uploads\\')[1],
            leaders: leadersArr,
            boardOfDirectors: boardArr
        });

        if(teams){
            return res.status(constants.OK).json({success: true, message: "Teams saved successfully"});
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


        let leadersArr = [];
        leaders.map((item, index) => {
            if(leadersProfile && leadersProfile[index]){
                leadersArr.push({
                    name: item.name,
                    designation: item.designation,
                    description: item.description,
                    profile: leadersProfile[index].path.split('uploads\\')[1]
                });
            }
            else{
                const file = dbTeam?.leaders.find(m => m._id.toString() == item.id);
                leadersArr.push({
                    name: item.name,
                    designation: item.designation,
                    description: item.description,
                    profile: file?.profile
                });
            }
        });
        
        let boardArr = [];
        boardOfDirectors.map((item, index) => {
            
            if(boardsProfile && boardsProfile[index]){

                boardArr.push({
                    name: item.name,
                    designation: item.designation,
                    description: item.description,
                    profile: boardsProfile[index].path.split('uploads\\')[1]
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

        if(bannerImg){
            param["bannerImg"] =  bannerImg[0].path.split('uploads\\')[1];
        }

        // console.log(param)

        const teams = await teamsModel.updateOne({_id:req.body.id}, {$set:param});

        if(teams){
           return res.status(constants.OK).json({success: true, message: "Teams saved successfully"});
        }
        res.status(constants.VALIDATION_ERROR);
        throw new Error('Something went wrong');

    }
    res.status(constants.VALIDATION_ERROR);
    throw new Error('Invalid request');
});