const asyncHandler = require('express-async-handler');
const constant = require('../constant/constant').constants;
const hostModel = require('../models/host').host;
const fileUploadController = require('./fileUpload-controller');

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

    let profileBase = {};
    let {profile, carPhotos} = req.files;
    if(profile){
        const base64 = await fileUploadController.SingleUpload(profile[0]);

        profileBase =  {
            filename: profile[0].originalname,
            contentType: profile[0].mimetype,
            imageBase64: base64,
        }
    }

    let carPhotoBase = []
    if(carPhotos){
        const imgArray = await fileUploadController.Uploads(carPhotos);
        let uploadImage = imgArray.map(async (src, index) => {

            // create object to store data in the collection
            carPhotoBase.push({
                filename: carPhotos[index].originalname,
                contentType: carPhotos[index].mimetype,
                imageBase64: src,
            });
        });
    }

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
        profile: profileBase,
        carPhotos: carPhotoBase,
    });

    res.status(constant.CREATED).json({message: "success"});
});

exports.getHost = asyncHandler(async (req,res) => {
    
});

exports.getAllHost = asyncHandler(async (req,res) => {
    const hosts = await  hostModel.find({}).exec();
    res.status(constant.OK).json(hosts);
});