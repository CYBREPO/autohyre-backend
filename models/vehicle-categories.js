const mongoose = require("mongoose");

const VehicleCategoriesSchema = new mongoose.Schema(
    {
        "description": String,
        "imageUrl": String,
        "key": String,
        "seoImageUrl": String,
        "title": String,
    }
);

exports.vehicle_categories = mongoose.model("vehicle_categories", VehicleCategoriesSchema);