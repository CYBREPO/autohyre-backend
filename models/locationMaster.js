const mongoose = require("mongoose");

const LocationMasterSchema = new mongoose.Schema(
  {
    "address": String,
    "addressLines": [String],
    "city": String,
    "country": String,
    "id": Number,
    "latitude": Number,
    "locationSource": String,
    "longitude": Number,
    "precision": {
      "accuracy": Number,
      "level": String
    },
    "state": String,
    "timeZone": String
  },
  {
    timestamps: true

  }
);

exports.location_master = mongoose.model("location_master", LocationMasterSchema);