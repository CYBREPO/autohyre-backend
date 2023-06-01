const { fileUpload } = require('../models/fileUpload');
const model = require('../models/vehicle');
const featureModel = require('../models/vehicle-features');
const basicModel = require('../models/vehicle-basic-dtls');
const constant = require('../constant/constant').constants;
const fileUploads = require('./fileUpload-contoller');
const { email } = require('./email');

let vehicleModel = model.vehicle;
let vehicleFeature = featureModel.vehicle_features;
let vehicleDetails = basicModel.vehicle_basic_dtls;

exports.getVehicleDetails = async (req, res) => {
    try {
        let id = req.query.id;
        if (id > 0) {
            let v = await vehicleModel.findOne({ id: id }).exec();
            return res.status(constant.OK).json(v);
        }

    }
    catch (ex) {
        return res.status(constant.VALIDATION_ERROR).json({ errorMessage: ex.message });
    }

}

exports.getFilteredVehicleDetails = async (req, res) => {
    try {
        let vehicles = vehicleModel.find();
        // (await vehicles).every
        if (req.body) {
            if (req.body.make) {
                vehicles.where('make').in(req.body.make.split(","))
            }

            if (req.body.category) {
                vehicles.where('type').in(req.body.category.split(","))
            }

        }

        let dbVehicle = await vehicles.exec();
        let ids = dbVehicle.map(m => m._id);
        let files = await fileUpload.find({ vehicleId: ids }).exec();

        let temp = [];
        dbVehicle.forEach(m => {
            temp.push({
                vehicle: m,
                images: files.filter(x => x.vehicleId.toString() == m._id.toString())
            })
        })

        return res.status(constant.OK).json(temp)



    }
    catch (ex) {
        return res.status(constant.VALIDATION_ERROR).json({ errorMessage: ex.message });
    }

}

exports.getAdditionDetails = async (req, res) => {
    try {
        if (req.query.id) {
            let basic = await vehicleDetails.findOne({ vehicleId: req.query.id });

            let features = await vehicleFeature.findOne({ vehicleId: req.query.id });

            return res.status(constant.OK).json({
                basicDetails: basic,
                features: features
            });
        }
        return res.status(constant.VALIDATION_ERROR).json({ errorMessage: "Bad request" });
    }
    catch (ex) {
        return res.status(constant.VALIDATION_ERROR).json({ errorMessage: ex.message });
    }
}

//save new Vehicle details
exports.setVehicleDetails = async (req, res) => {
    try {
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
                let uploadResult = await fileUploads.Uploads(req, result);
                let message = "Vehicle added save successfully and " + uploadResult.message;
                return res.status(constant.OK).json({ message: message, data: result });
            }
        }

    }
    catch (ex) {
        return res.status(constant.VALIDATION_ERROR).json({ errorMessage: ex.message });
    }
}

//update vehile details
exports.updateVehicleDetails = async (req, res) => {
    try {
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

    }
    catch (ex) {
        return res.status(constant.VALIDATION_ERROR).json({ errorMessage: ex.message });
    }
}

exports.sendMail = async (req, res) => {
    try {
        if (req.body.vehicleId) {
            let v = await vehicleModel.findOne({ _id: req.body.vehicleId }).exec();

            let info = await email({...v,mails:"chaitanyashirodkar010@gmail.com"});

            res.status(200).json({message: "success"});
        }
    }
    catch (ex) {

    }
}


