const asyncHandler = require('express-async-handler');
const constant = require('../constant/constant').constants;
const hostModel = require('../models/host').host;
const userModel = require('../models/user').user;

exports.createHost = asyncHandler(async (req, res) => {

    if (!req.body) {
        res.status(constant.VALIDATION_ERROR);
        throw new Error("Invalid Input Request");
    }

    const hostExist = await hostModel.findOne({ mobile: req.body.mobile }).exec();

    if (hostExist) {
        res.status(constant.VALIDATION_ERROR);
        throw new Error("Host already exist");
    }

    let { profile, carPhotos } = req.files;


    const host = await hostModel.create({
        make: req.body.make,
        model: req.body.model,
        year: req.body.year,
        vin: req.body.vin,
        ownerMobile: req.body.mobile,
        carAvailability: req.body.carAvailability,
        carDetail: req.body.carDetail,
        safetyQuantity: req.body.safetyQuantity,
        drivingLicense: req.body.drivingLicense,
        goals: req.body.goals,
        payout: req.body.payout,
        ownerName: req.body.ownerName,
        airBags: req.body.airBags,
        fireExtinguisher: req.body.fireExtinguisher,
        cCaution: req.body.cCaution,
        umbrella: req.body.umbrella,
        dirverDetails: req.body.dirverDetails,
        ownerProfile: profile[0].path.split('uploads\\')[1],
        carPhotos: carPhotos.map(m => m.path.split('uploads\\')[1]),
        createdBy: req.user._id,
        status: "Pending"
    });

    if (host) {
        let emailBody = {
            body: {
                name: 'User',
                intro: 'New Host Request',
                table: {
                    data: [{
                        ownerName: req.body.ownerName ?? "",
                        make: req.body.make,
                        model: req.body.model,
                        year: req.body.year
                    }]
                },
                outro: ''
            }
        };
        sendMail(req.user?.email,emailBody);
        return res.status(constant.CREATED).json({ success: true, message: "Host saved successfully" });
    }

    res.status(constant.VALIDATION_ERROR);
    throw new Error('Something went wrong')
});

exports.getHost = asyncHandler(async (req, res) => {

});

exports.getAllHost = asyncHandler(async (req, res) => {
    const hosts = await hostModel.find({}).exec();

    const ids = hosts.map(m => m._id);
    const users = await userModel.find({ _id: { $in: ids } });
    let data = [];
    hosts.forEach((m, index) => {
        const usr = users.find(x => x._id.toString() == m.createdBy.toString())
        data.push({ ...m._doc, userName: usr?.name ?? "" });

    });
    res.status(constant.OK).json({ success: true, data: data });
});

exports.updateHostStatus = asyncHandler(async (req, res) => {
    if (req.body) {
        const hosts = await hostModel.findOneAndUpdate({ _id: req.body.id }, { $set: { status: req.body.status } },{ new : true }).exec();

        let hostDetails = await userModel.findOne({_id: hosts.createdBy.toString()}).exec();
        let emailBody = {
            body: {
                name: 'User',
                intro: 'Host Request Has' + hosts.status,
                outro: ''
            }
        };
        sendMail(hostDetails.email,emailBody);
        return res.status(constant.OK).json({ success: true, data: hosts, message: "Status updated successfully" });
    }
    res.status(constant.VALIDATION_ERROR);
    throw new Error('Invalid request');
});

async function sendMail(emailAddr, emailBody) {
    try {
        let admin = await userModel.find({ isAdmin: true }).exec();
        

        const mails = admin.map(m => m.email).toString() + "," + emailAddr;

        let info = await email({ ...v, mails: mails, email: emailBody });
    }
    catch (ex) {
        console.log(ex)
    }

}

