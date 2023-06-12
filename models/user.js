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
        // required: true
      },
      contentType: {
        type: String,
        // required: true
      },
      imageBase64: {
        type: String,
        // required: true
      }
    },
    "isAdmin": {
      type: Boolean,
      required: true
    },
    "isActive": {
      type: Boolean,
      require: true,
      default: true
    },
    "lastLogin": {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

UserSchema.index({ "name": "text", "email": "text" });
exports.user = mongoose.model("user", UserSchema);