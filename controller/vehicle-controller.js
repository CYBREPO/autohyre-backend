const { fileUpload } = require('../models/fileUpload');
const model = require('../models/vehicle');
const featureModel = require('../models/vehicle-features');
const basicModel = require('../models/vehicle-basic-dtls');
const constant = require('../constant/constant').constants;
const fileUploads = require('./fileUpload-controller');
const { email } = require('./email');
const asyncHandler = require('express-async-handler');
const userModel = require('../models/user').user;
const quotReqModel = require('../models/quotationRequest').quotationRequest;

let vehicleModel = model.vehicle;
let vehicleFeature = featureModel.vehicle_features;
let vehicleDetails = basicModel.vehicle_basic_dtls;

exports.getVehicleDetails = asyncHandler(async (req, res) => {

    let id = req.query.id;
    if (id > 0) {
        let v = await vehicleModel.findOne({ id: id }).exec();
        return res.status(constant.OK).json(v);
    }

});

exports.getFilteredVehicleDetails = asyncHandler(async (req, res) => {

    // let vehicles = vehicleModel.find();
    let update = {}
    if (req.body) {
        if (req.body.make && req.body.make != "") {
            update["make"] = { $in: req.body.make.split(",") };
        }

        if (req.body.category && req.body.category != "") {
            update["type"] = { $in: req.body.category.split(",") };
        }
        if (req.body.price && req.body.price != "") {
            update["price"] = { $lt: req.body.price };
        }
        if (req.body.id && req.body.id != "") {
            update["_id"] = { $eq: req.body.id };
        }
        if (req.body.location ) {
            if(req.body.location?.state && req.body.location?.state != "")
                update["location.state"] = { $eq: req.body.location.state };

            if(req.body.loaction?.city && req.body.loaction?.city != "")
                update["location.city"] = { $eq: req.body.location.city };
        }

    }

    let dbVehicle;
    switch (req.body.priceSort && req.body.priceSort != "") {
        case "low-to-high-0": dbVehicle = await vehicleModel.find(update).sort({ price: -1 }).exec();
            break;
        case "high-to-low-1": dbVehicle = await vehicleModel.find(update).sort({ price: 1 }).exec();
            break;
        case "relevance": dbVehicle = await vehicleModel.find(update).exec();
            break;
        default: dbVehicle = await vehicleModel.find(update).exec();
            break;
    }

    return res.status(constant.OK).json({ success: true, data: dbVehicle });


});

exports.getAdditionDetails = asyncHandler(async (req, res) => {
    if (req.query.id) {
        let basic = await vehicleDetails.findOne({ vehicleId: req.query.id });

        let features = await vehicleFeature.findOne({ vehicleId: req.query.id });

        return res.status(constant.OK).json({
            success: true,
            data: {
                basicDetails: basic,
                features: features
            }

        });
    }
    return res.status(constant.VALIDATION_ERROR).json({ errorMessage: "Bad request" });

});

//save new Vehicle details
exports.setVehicleDetails = asyncHandler(async (req, res) => {
    // try {
    if (req.body != null) {

        let param = req.body;
        param['location'] = JSON.parse(req.body.location);

        if (req.files) {
            param['images'] = req.files.map(m => m.path.replace('\\','/').split('uploads/')[1])
        }
        
        let result = await vehicleModel.create(param);

        if (result) {
            //save basic details
            let basicparams = {
                "averageFuelEconomy": req.body.averageFuelEconomy,
                "averageFuelEconomyWithLabel": req.body.averageFuelEconomy + " " + req.body.fuelUnitLabel,
                "cityFuelEconomy": req.body.cityFuelEconomy,
                "fuelGrade": req.body.fuelGrade,
                "fuelType": req.body.fuelType,
                "fuelTypeAndGradeLabel": (req.body.fuelType.label + " (" + req.body.fuelGrade + ")"),
                "fuelUnit": req.body.fuelUnit,
                "fuelUnitLabel": req.body.fuelUnitLabel,
                "highwayFuelEconomy": req.body.highwayFuelEconomy,
                "numberOfDoors": req.body.numberOfDoors,
                "numberOfDoorsLabel": (req.body.numberOfDoors + " Doors"),
                "numberOfSeats": req.body.numberOfSeats,
                "numberOfSeatsLabel": (req.body.numberOfSeats + " Seats"),
                "description": req.body.description,
                "vehicleId": result._id,
            }

            let requestBody = req.body;
            requestBody["vehicleId"] = result._id;
            const features = new vehicleFeature(requestBody);
            features.save();
            const basic = new vehicleDetails(basicparams);
            basic.save();

            let message = "Vehicle added save successfully";
            return res.status(constant.OK).json({ success: true, message: message, data: result });
        }
    }

});

exports.deleteVehicle = asyncHandler(async (req, res) => {
    if (req.query.id) {
        let veh = await vehicleModel.findByIdAndDelete(req.query.id);
        if (veh) {
            await vehicleDetails.findOne({ vehicleId: req.query.id });
            await vehicleFeature.findOne({ vehicleId: req.query.id });
            await fileUpload.find({ vehicleId: req.query.id });
            fileUploads.removeFiles(veh.images);

            return res.status(constant.OK).json({ success: true, message: "Deleted successfully" });
        }
        res.status(constant.VALIDATION_ERROR);
        throw new Error('Something went wrong');
    }
    res.status(constant.VALIDATION_ERROR);
    throw new Error('Invalid request');
});

//update vehile details
exports.updateVehicleDetails = asyncHandler(async (req, res) => {
    if (req.body != null) {
        let param = req.body;
        // console.log(param)
        param['location'] = JSON.parse(req.body.location);

        if (req.files) {
            param['images'] = req.files.map(m => m.path.replace('\\','/').split('uploads/')[1])
        }
        
        let result = await vehicleModel.findByIdAndUpdate({_id: req.body.id},param);

        if (result) {
            //save basic details
            let basicparams = {
                "averageFuelEconomy": req.body.averageFuelEconomy,
                "averageFuelEconomyWithLabel": req.body.averageFuelEconomy + " " + req.body.fuelUnitLabel,
                "cityFuelEconomy": req.body.cityFuelEconomy,
                "fuelGrade": req.body.fuelGrade,
                "fuelType": req.body.fuelType,
                "fuelTypeAndGradeLabel": (req.body.fuelType.label + " (" + req.body.fuelGrade + ")"),
                "fuelUnit": req.body.fuelUnit,
                "fuelUnitLabel": req.body.fuelUnitLabel,
                "highwayFuelEconomy": req.body.highwayFuelEconomy,
                "numberOfDoors": req.body.numberOfDoors,
                "numberOfDoorsLabel": (req.body.numberOfDoors + " Doors"),
                "numberOfSeats": req.body.numberOfSeats,
                "numberOfSeatsLabel": (req.body.numberOfSeats + " Seats"),
                "description": req.body.description,
                "vehicleId": result._id,
            }

            let requestBody = req.body;
            requestBody["vehicleId"] = result._id;
            const features = await vehicleFeature.findByIdAndUpdate({_id: req.body.featureId},requestBody);
            const basic = await vehicleDetails.findByIdAndUpdate({_id: req.body.vehicleDetailsId},basicparams);
            let message = "Vehicle updated save successfully";
            return res.status(constant.OK).json({success: true, message: message, data: result });
        }
        res.status(constant.VALIDATION_ERROR);
        throw new Error('Something went wrong');
    }
    res.status(constant.VALIDATION_ERROR);
    throw new Error('Invalid request');
});

exports.getVehicles = asyncHandler(async (req, res) => {
    let { pageSize, pageIndex, searchText } = req.body;
    let query = {};
    if (searchText && searchText != "") {
        query['$text'] = { $search: searchText };
    }
    const totalCount = await vehicleModel.countDocuments(query);
    if (totalCount > pageSize) {
        const result = await vehicleModel.find(query).skip((pageIndex - 1) * pageSize).limit(pageSize).exec();
        return res.status().json({ success: true, data: result, count: totalCount });
    }
    const result = await vehicleModel.find(query).exec();
    return res.status(constant.OK).json({ success: true, data: result, count: totalCount });
});

exports.sendMail = asyncHandler(async (req, res) => {
    if (req.body.vehicleId) {
        let veh = await vehicleModel.findOne({ _id: req.body.vehicleId }).exec();
        let admin = await userModel.find({ isAdmin: true }).exec();

        //save quotation request

        let rst = await quotReqModel.create({
            userDetails: {
                name: req.user?.name ?? "",
                email: req.user?.email ?? "",
                id: req.user?._id
            },
            vehicleDetails: {
                make: req.body.make,
                model: req.body.model,
                type: req.body.type,
                year: req.body.year,
            },
            pickupLocation: req.body.pickupLocation,
            dropLocation: req.body.dropLocation,
            pickupDate:  req.body.pickupDate,
            dropDate:  req.body.dropDate,
            additionalInfo: req.body.information
        });
        if(rst){
            let emailBody = {
            body: {
                name: 'User',
                intro: '',
                table: {
                    data: [{
                        name: req.user?.name ?? "",
                        email: req.user?.email ?? "",
                        make: req.body.make,
                        model: req.body.model,
                        type: req.body.type,
                        year: req.body.year,
                        pickup: req.body.pickupLocation?.address,
                        pickupDate: req.body.pickupDate,
                        drop: req.body.dropLocation?.address,
                        dropDate: req.body.dropDate,
                        information: req.body.information

                    }]
                },
                outro: ''
            }
        };

        const mails = admin.map(m => m.email).toString() + "," + req.user?.email;

        let info = await email({ ...veh, mails: mails, email: emailBody });

        res.status(200).json({success: true, message: "mail has been triggered successfully" });
        }
        
    }
});

exports.geAllQuotationRequests = asyncHandler(async (req, res) => {
    let { pageSize, pageIndex, searchText } = req.body;
    let query = {};
    if (searchText && searchText != "") {
        query['$text'] = { $search: searchText };
    }
    const totalCount = await quotReqModel.countDocuments(query);
    if (totalCount > pageSize) {
        const result = await quotReqModel.find(query).skip((pageIndex - 1) * pageSize).limit(pageSize).exec();
        return res.status().json({ success: true, data: result, count: totalCount });
    }
    const result = await quotReqModel.find(query).exec();
    return res.status(constant.OK).json({ success: true, data: result, count: totalCount });
});


