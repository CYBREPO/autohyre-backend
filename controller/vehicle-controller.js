const { fileUpload } = require('../models/fileUpload');
const model = require('../models/vehicle');
const featureModel = require('../models/vehicle-features');
const basicModel = require('../models/vehicle-basic-dtls');
const constant = require('../constant/constant').constants;
const fileUploads = require('./fileUpload-controller');
const { email } = require('./email');
const asyncHandler = require('express-async-handler');

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
            update["make"] = {$in: req.body.make.split(",")}
        }

        if (req.body.category && req.body.category != "") {
            update["type"] = {$in: req.body.category.split(",")}
        }
        if (req.body.price && req.body.price != "") {
            update["price"] = {$lt: req.body.price}
        }

    }

    let dbVehicle;
    switch (req.body.priceSort && req.body.priceSort != "") {
        case "low-to-high-0": dbVehicle = await vehicleModel.find(update).sort({price: -1}).exec();
            break;
        case "high-to-low-1": dbVehicle = await vehicleModel.find(update).sort({price: 1}).exec();
            break;
        case "relevance": dbVehicle = await vehicleModel.find(update).exec();
            break;
        default: dbVehicle = await vehicleModel.find(update).exec();
            break;
    }

    let ids = dbVehicle.map(m => m._id);
    let files = await fileUpload.find({ vehicleId: ids }).exec();

    let temp = [];
    dbVehicle.forEach(m => {
        temp.push({
            vehicle: m,
            images: files.filter(x => x.vehicleId.toString() == m._id.toString())
        })
    });

    return res.status(constant.OK).json(temp)


});

exports.getAdditionDetails = asyncHandler(async (req, res) => {
    // try {
    if (req.query.id) {
        let basic = await vehicleDetails.findOne({ vehicleId: req.query.id });

        let features = await vehicleFeature.findOne({ vehicleId: req.query.id });

        return res.status(constant.OK).json({
            basicDetails: basic,
            features: features
        });
    }
    return res.status(constant.VALIDATION_ERROR).json({ errorMessage: "Bad request" });

});

//save new Vehicle details
exports.setVehicleDetails = asyncHandler(async (req, res) => {
    // try {
    if (req.body != null) {
        const vehicle = new vehicleModel(req.body);

        let result;
        result = await vehicle.save();

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
            const files = req.files
            let imgArray = await fileUploads.Uploads(files);
            let uploadResult = imgArray.map(async (src, index) => {

                // create object to store data in the collection
                let finalImg = {
                    filename: files[index].originalname,
                    contentType: files[index].mimetype,
                    imageBase64: src,
                    vehicleId: result._id,
                }

                let newUpload = new fileUpload.fileUpload(finalImg);

                let result;
                result = await newUpload.save();

            });

            let message = "Vehicle added save successfully";
            return res.status(constant.OK).json({ message: message, data: result });
        }
    }

});

//update vehile details
exports.updateVehicleDetails = asyncHandler(async (req, res) => {
    if (req.body != null) {
        const vehicle = new vehicleModel(req.body);
        vehicle.save((err, doc) => {
            if (err) {
                return res.status(constant.VALIDATION_ERROR).json({ errorMessage: err.message });
            }
            let message = "Vehicle added save successfully";
            return res.status(constant.OK).json({ message: message, data: doc });
        });
    }
});

exports.getVehicles = asyncHandler(async (req, res) => {
    let { pageSize, pageIndex } = req.body;
    const totalCount = await vehicleModel.countDocuments();
    if (totalCount > pageSize) {
        const result = await vehicleModel.find().skip((pageIndex - 1) * pageSize).limit(pageSize).exec();
        return res.status().json({ success: true, data: result, count: totalCount });
    }
    const result = await vehicleModel.find().exec();
    return res.status(constant.OK).json({ success: true, data: result, count: totalCount });
});

exports.sendMail = asyncHandler(async (req, res) => {
    if (req.body.vehicleId) {
        let v = await vehicleModel.findOne({ _id: req.body.vehicleId }).exec();
        let emailBody = {
            body: {
                name: 'User',
                intro: '',
                table: {
                    data: [{
                        name: "dummy",
                        email: "dummy",
                        make: data._doc.make,
                        model: data._doc.model,
                        type: data._doc.type,
                        year: data._doc.year,

                    }]
                },
                outro: ''
            }
        };

        let info = await email({ ...v, mails: "chaitanyashirodkar010@gmail.com", email: emailBody });

        res.status(200).json({ message: "success" });
    }
});


