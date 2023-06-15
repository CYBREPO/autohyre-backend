const mongoose = require("mongoose");

const VehicleBrandSchema = new mongoose.Schema(
  {
    "name": String,
    "id": Number,
    "image": {
      type: String
    },
    "models": [{ type: mongoose.Types.ObjectId, ref: 'carModel' }],
    'createdBy': mongoose.Types.ObjectId,
    'modifiedBy': mongoose.Types.ObjectId,
  },
  {
    timestamps: true

  }
);

VehicleBrandSchema.index({ "name": 'text' });
exports.vehicle_brand = mongoose.model("vehicle_brand", VehicleBrandSchema);