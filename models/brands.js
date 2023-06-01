const mongoose = require("mongoose");

const VehicleBrandSchema = new mongoose.Schema(
  {
    "name": String,
    "id": Number,
    "image": {
      filename: {
        type: String,
        unique: true,
        required: true
      },
      contentType: {
        type: String,
        required: true
      },
      imageBase64: {
        type: String,
        required: true
      }
    },
  }
);

exports.vehicle_brand = mongoose.model("vehicle_brand", VehicleBrandSchema);