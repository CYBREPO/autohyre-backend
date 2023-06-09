const mongoose = require("mongoose");

const CarModelSchema = new mongoose.Schema(
  {
    "name": {
        type: String,
        unique : true,
        required: true
    },
    'createdBy': mongoose.Types.ObjectId,
    'modifiedBy': mongoose.Types.ObjectId,
  },
  {
      timestamps: true

  }
);

CarModelSchema.index({"name": "text"})
exports.carModel = mongoose.model("carModel", CarModelSchema);