const model = require('../models/locationMaster');
const locationMapping = require('../models/vehicleLocationMapping');
const vehileModel = require('../models/vehicle');
const constant = require('../constant/constant').constants;
const { fileUpload } = require('../models/fileUpload');

let locationModel = model.location_master;
let locMapping = locationMapping.location_mapping;

exports.getAllLOcation = async (req, res) => {
    try {

        let v = await locationModel.find({}).exec();
        return res.status(constant.OK).json(v);

    }
    catch (ex) {
        return res.status(constant.VALIDATION_ERROR).json({ errorMessage: ex.message });
    }

}

exports.setLocation = async (req, res) => {
    try {
        if (req.body) {
            let loc = new locationModel(req.body);
            let result = await loc.save();

            return res.status(constant.OK).json({ message: 'success' });
        }

    }
    catch (ex) {
        return res.status(constant.VALIDATION_ERROR).json({ errorMessage: ex.message });
    }

}

exports.setLocationMapping = async (req, res) => {
    try {
        if (req.body) {
            let loc = new locMapping(req.body);
            let result = await loc.save();

            return res.status(constant.OK).json({ message: 'success' });
        }

    }
    catch (ex) {
        return res.status(constant.VALIDATION_ERROR).json({ errorMessage: ex.message });
    }

}

exports.getLocationVechile = async (req, res) => {
    try {
        if (req.query.address) {
            let loc = await locationModel.findOne({ address: req.query.address }).exec();
            if (loc) {
                let locmap = await locMapping.find({ locationId: loc._id }).exec();

                let dbVehicle = await vehileModel.vehicle.find({ _id: locmap.map(x => x.vehicleId) }).exec();

                // let dbVehicle = await vehicles.exec();
                let ids = dbVehicle.map(m => m._id);
                let files = await fileUpload.find({ vehicleId: ids }).exec();

                let temp = [];
                dbVehicle.forEach(m => {
                    temp.push({
                        vehicle: m,
                        location: loc,
                        images: files.filter(x => x.vehicleId.toString() == m._id.toString())
                    })
                })

                return res.status(constant.OK).json(temp)

                // return res.status(constant.OK).json(veh);
            }
        }
        return res.status(constant.VALIDATION_ERROR).json({ errorMessage: "Error" })

    }
    catch (ex) {
        return res.status(constant.VALIDATION_ERROR).json({ errorMessage: ex.message });
    }

}