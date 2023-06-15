const asyncHandler = require('express-async-handler');
const constant = require('../constant/constant').constants;
const hostModel = require('../models/host').host;
const userModel = require('../models/user').user;

exports.createHost = asyncHandler(async (req,res )=>{

    if(!req.body){
        res.status(constant.VALIDATION_ERROR);
        throw new Error("Invalid Input Request");
    }

    const hostExist = await hostModel.findOne({mobile: req.body.mobile}).exec();

    if(hostExist){
        res.status(constant.VALIDATION_ERROR);
        throw new Error("Host already exist");
    }

    let {profile, carPhotos} = req.files;
   

    const host = await hostModel.create({
        car: req.body.car,
        mobile: req.body.mobile,
        carAvailability: req.body.carAvailability,
        carDetail: req.body.carDetail,
        safetyQuantity: req.body.safetyQuantity,
        listing: req.body.listing,
        drivingLicense: req.body.drivingLicense,
        goals: req.body.goals,
        payout: req.body.payout,
        profile: profile[0].path.split('uploads\\')[1],
        carPhotos: carPhotos.map(m => m.path.split('uploads\\')[1]),
        createdBy: req.user._id,
        status:"Pending"
    });

    if(host)
        return res.status(constant.CREATED).json({success: true, message: "Host saved successfully"});

    res.status(constant.VALIDATION_ERROR);
    throw new Error('Something went wrong')
});

exports.getHost = asyncHandler(async (req,res) => {
    
});

exports.getAllHost = asyncHandler(async (req,res) => {
    const hosts = await  hostModel.find({}).exec();

    const ids = hosts.map(m => m._id);
    const users = await userModel.find({_id: {$in: ids}});
    let data = [];
    hosts.forEach((m,index) => {
        const usr = users.find(x => x._id.toString() == m.createdBy.toString())
        data.push({...m._doc,userName: usr?.name??""});

    });
    res.status(constant.OK).json({success: true, data:data});
});

exports.updateHostStatus = asyncHandler(async (req,res) => {
    if(req.body){
        const hosts = await  hostModel.updateOne({_id: req.body.id}, {$set: {status: req.body.status}}).exec();
        return res.status(constant.OK).json({success: true, data: hosts, message: "Status updated successfully"}); 
    }
    res.status(constant.VALIDATION_ERROR);
    throw new Error('Invalid request');
});

