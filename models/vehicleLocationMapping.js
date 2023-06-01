const mongoose = require("mongoose");

const LocationMappingSchema = new mongoose.Schema(
    {
        "locationId":  mongoose.Types.ObjectId,
        "vehicleId": mongoose.Types.ObjectId,
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
      }
);

exports.location_mapping = mongoose.model("location_mapping", LocationMappingSchema);