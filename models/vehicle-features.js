const mongoose = require("mongoose");

const VehicleFeatureSchema = new mongoose.Schema(
    {
        "ageBook": Boolean,
        "automaticTransmission": Boolean,
        "AllWheelDrive": Boolean,
        "appleCarPlay": Boolean,
        "androidAuto": Boolean,
        "auxInput": Boolean,
        "backupCamera": Boolean,
        "bluetooth": Boolean,
        "childSeat": Boolean,
        "heatedSeats": Boolean,
        "keylessEntry": Boolean,
        "sunRoof": Boolean,
        "tollPass": Boolean,
        "usbCharger": Boolean,
        "usbInput": Boolean,
        "vehicleId": mongoose.Types.ObjectId,
        'createdBy': mongoose.Types.ObjectId,
        'modifiedBy': mongoose.Types.ObjectId,
    },
    {
        timestamps: true

    }
);

exports.vehicle_features = mongoose.model("vehicle_features", VehicleFeatureSchema);