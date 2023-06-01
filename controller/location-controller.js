const model = require('../models/locationMaster');
const locationMapping = require('../models/vehicleLocationMapping');
const vehileModel = require('../models/vehicle');
const constant = require('../constant/constant').constants;

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

exports.getLocationVechile = async (req, res) => {
    try {
        if (req.query.city) {
            let loc = await locationModel.findOne({ city: req.query.city }).exec();
            if (loc) {
                let locmap = await locMapping.find({ locationId: loc._id }).exec();

                let veh = await vehileModel.vehicle.find({ _id: locmap.map(x => x.vehicleId).toString() });

                return res.status(constant.OK).json(veh);
            }
        }

    }
    catch (ex) {
        return res.status(constant.VALIDATION_ERROR).json({ errorMessage: ex.message });
    }

}