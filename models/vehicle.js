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
        "images": [{
            type: String
        }],
        'createdBy': mongoose.Types.ObjectId,
        'modifiedBy': mongoose.Types.ObjectId,
    },
    {
        timestamps: true

    }
);

VehicleSchema.index({"make": 'text',"model": 'text',"year": 'text'});
exports.vehicle = mongoose.model("vehicle", VehicleSchema);