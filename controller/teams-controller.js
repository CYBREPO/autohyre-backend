const asyncHandler = require('express-async-handler');
const { constants } = require('../constant/constant');
const teamsModel = require('../models/teams').teams;
const teamsMemberModel = require('../models/teamsMembers').teamsMember;
const fileUploadController = require('./fileUpload-controller');


exports.getTeams = asyncHandler(async (req, res) => {
    const teams = await teamsModel.findOne({})
                                  .populate('leaders')
                                  .populate('boardOfDirectors')
                                  .exec();
    if (teams) {
        return res.status(constants.OK).json({ success: true, data: teams });
    }
    res.status(constants.VALIDATION_ERROR);
    throw new Error("Not Found");
});

exports.saveTeams = asyncHandler(async (req, res) => {
    if (req.body) {
        const { leaders, boardOfDirectors } = req.body;
        const { bannerImg, leadersProfile, boardsProfile } = req.files;


        // let leadersArr = [];
        // leaders.map((item, index) => {
        //     if (leadersProfile && leadersProfile[index]) {
        //         leadersArr.push({
        //             name: item.name,
        //             designation: item.designation,
        //             description: item.description,
        //             profile: leadersProfile[index].path.replace('\\','/').split('uploads/')[1]
        //         })
        //     }
        //     else {
        //         leadersArr.push({
        //             name: item.name,
        //             designation: item.designation,
        //             description: item.description
        //         })
        //     }

        // });
        // let boardArr = [];
        // boardOfDirectors.map((item, index) => {

        //     if (boardsProfile && boardsProfile[index]) {
        //         boardArr.push({
        //             name: item.name,
        //             designation: item.designation,
        //             description: item.description,
        //             profile: boardsProfile[index].path.replace('\\','/').split('uploads/')[1]
        //         });
        //     }
        //     else {
        //         boardArr.push({
        //             name: item.name,
        //             designation: item.designation,
        //             description: item.description
        //         });
        //     }


        // });

        const teams = await teamsModel.create({
            header: req.body.header,
            bannerImg: bannerImg[0].path.replace('\\','/').split('uploads/')[1],
            leaders: [],
            boardOfDirectors: []
        });

        if (teams) {
            return res.status(constants.OK).json({ success: true, message: "Teams saved successfully" });
        }
        res.status(constants.VALIDATION_ERROR);
        throw new Error('Something went wrong');

    }
    res.status(constants.VALIDATION_ERROR);
    throw new Error('Invalid request');
});

exports.updateTeams = asyncHandler(async (req, res) => {
    if (req.body) {
        const { leaders, boardOfDirectors } = req.body;
//         const { bannerImg, leadersProfile, boardsProfile } = req.files;
// console.log(bannerImg)
        const dbTeam = await teamsModel.findById(req.body.id);


        // let leadersArr = [];
        // leaders.map((item, index) => {
        //     if (leadersProfile && leadersProfile[index]) {
        //         leadersArr.push({
        //             name: item.name,
        //             designation: item.designation,
        //             description: item.description,
        //             profile: leadersProfile[index].path.replace('\\','/').split('uploads/')[1]
        //         });
        //     }
        //     else {
        //         const file = dbTeam?.leaders.find(m => m._id.toString() == item.id);
        //         leadersArr.push({
        //             name: item.name,
        //             designation: item.designation,
        //             description: item.description,
        //             profile: file?.profile
        //         });
        //     }
        // });

        // let boardArr = [];
        // boardOfDirectors.map((item, index) => {

        //     if (boardsProfile && boardsProfile[index]) {

        //         boardArr.push({
        //             name: item.name,
        //             designation: item.designation,
        //             description: item.description,
        //             profile: boardsProfile[index].path.replace('\\','/').split('uploads/')[1]
        //         });
        //     }
        //     else {
        //         boardArr.push({
        //             name: item.name,
        //             designation: item.designation,
        //             description: item.description
        //         });
        //     }

        // });

        const param = {
            header: req.body.header,
            // leaders: leadersArr,
            // boardOfDirectors: boardArr
        }

        if (req.file) {
            param["bannerImg"] = req.file.path.replace('\\','/').split('uploads/')[1];
        }

        const teams = await teamsModel.updateOne({ _id: req.body.id }, { $set: param });

        if (teams) {
            // let imgs = [];
            if (teams.bannerImg && bannerImg)
                fileUploadController.removeFiles(teams.bannerImg);

            // if (teams.boardOfDirectors && teams.boardOfDirectors[0].profile)
            //     imgs.push(result.mainImg);

            // if (imgs && imgs.length > 0)
            //     fileUploadController.removeFiles(imgs);
            return res.status(constants.OK).json({ success: true, message: "Teams saved successfully" });
        }
        res.status(constants.VALIDATION_ERROR);
        throw new Error('Something went wrong');

    }
    res.status(constants.VALIDATION_ERROR);
    throw new Error('Invalid request');
});

exports.addUpdateTeamMember = asyncHandler(async (req, res) => {
    if (req.body) {
        let param = {};
        if (req.file) {
            param['profile'] = req.file.path.replace('\\','/').split('uploads/')[1];
        }

        param['name'] = req.body.name;
        param['title'] = req.body.title;
        param['designation'] = req.body.designation;
        param['description'] = req.body.description;

        if (req.body.id) { // Update existing
            let result = await teamsMemberModel.findByIdAndUpdate({ _id: req.body.id }, param).exec();

            if (result) {
                //Remove previous file
                if(result.profile && req.file)
                    fileUploadController.removeFiles([result.profile]);
                 
                //update teams   
                let update = {}
                if (req.body.title == 'leaders') {
                    update['leaders'] = result._id;
                }
                else {
                    update['boardOfDirectors'] = result._id;
                }

                let rst = await teamsModel.findOneAndUpdate({}, { $push: update });

                if (rst)
                    return res.status(constants.OK).json({ success: true, message: "Member Updated successfully",data: result});

            }
            res.status(constants.VALIDATION_ERROR);
            throw new Error('Something went wrong');
        }
        else { //Add new

            let result = await teamsMemberModel.create(param);
            if (result) {
                //update teams
                let update = {}
                if (req.body.title == 'leaders') {
                    update['leaders'] = result._id;
                }
                else {
                    update['boardOfDirectors'] = result._id;
                }

                let rst = await teamsModel.findOneAndUpdate({}, { $push: update });

                if (rst)
                    return res.status(constants.OK).json({ success: true, message: "Member Saved successfully", data: result});

            }
            res.status(constants.VALIDATION_ERROR);
            throw new Error('Something went wrong');
        }

    }
    res.status(constants.VALIDATION_ERROR);
    throw new Error('Invalid request');
});

exports.deleteTeamMember = asyncHandler(async (req,res) => {
    if(req.query.id){
        let del = await teamsMemberModel.findByIdAndDelete({_id: req.query.id});

        if(del){
            fileUploadController.removeFiles([del.profile]);
            let itemDel = {}
            console.log(del)
            if(del.title == "leaders"){
                itemDel['leaders'] = del._id;
            }
            else{
                itemDel['boardOfDirectors'] = del._id;
            }
            let delTeam =  await teamsModel.findByIdAndUpdate({_id: req.query.teamId},{$pull: itemDel});

            if(delTeam)
                return res.status(constants.OK).json({success: true, message: "Member Removed Successfully"});
        }
        res.status(constants.VALIDATION_ERROR);
        throw new Error('Something went wrong');

    }
    res.status(constants.VALIDATION_ERROR);
    throw new Error('Invalid request');
})