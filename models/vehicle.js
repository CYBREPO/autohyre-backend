const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema(
    {
        "automaticTransmission": Boolean,
        "id": Number,
        "make": String,
        "marketAreaId": String,
        "marketCountry": String,
        "model": String,
        "name": String,
        "registration": String,
        "trim": String,
        "type": String,
        "url": String,
        "vin": String,
        "price": Number,
        "year": Number,
    }
);

exports.vehicle = mongoose.model("vehicle", VehicleSchema);