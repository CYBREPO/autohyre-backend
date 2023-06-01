const mongoose = require("mongoose");

const VehicleBasicDetailsSchema = new mongoose.Schema(
    {
        "averageFuelEconomy": Number,
        "averageFuelEconomyWithLabel": String,
        "cityFuelEconomy": Number,
        "fuelGrade": String,
        "fuelType": {
            "label": String,
            "value": String
        },
        "fuelTypeAndGradeLabel": String,
        "fuelUnit": String,
        "fuelUnitLabel": String,
        "highwayFuelEconomy": Number,
        "numberOfDoors": Number,
        "numberOfDoorsLabel": String,
        "numberOfSeats": Number,
        "numberOfSeatsLabel": String,
        "description": String,
        "vehicleId":  mongoose.Types.ObjectId
    }
);

exports.vehicle_basic_dtls = mongoose.model("vehicle_basic_dtls", VehicleBasicDetailsSchema);