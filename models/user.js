const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    "name": {
        type: String,
        required: [true,"Name is required"]
    },
    "mobile": {
        type: String,
    },
    "email":{
        type: String,
        required: [true,"Email is required"]
    },
    "password":{
        type: String,
        required: [true, "Password is required"]
    },
    "profile": {
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
  },
  {
    timestamps: true
  }
);

exports.user = mongoose.model("user", UserSchema);