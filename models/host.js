const mongoose = require('mongoose');

const HostSchema = new mongoose.Schema(
    {
        "car": {
            type: String,
            required: [true, "Name is required"]
        },
        "profile": {
            type: String
        },
        "mobile": {
            type: String,
            // required: [true, "Email is required"]
        },
        "drivingLicense": {
            type: String,
            // required: [true, "Password is required"]
        },
        "goals": {
            type: String,
        },
        "carAvailability": {
            type: String,
        },
        "carDetail": {
            type: String,
        },
        "carPhotos": [
            {
                type: String
            }

        ],
        "payout": {
            type: String,
        },
        "safetyQuantity": {
            type: String,
        },
        "listing": {
            type: String,
        },
        "status": {
            type: String,
            default: "Pending"
        },
        'createdBy': mongoose.Types.ObjectId,
        'modifiedBy': mongoose.Types.ObjectId,
    },
    {
        timestamps: true
    }
);

exports.host = mongoose.model('host', HostSchema);