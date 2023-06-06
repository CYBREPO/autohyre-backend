const mongoose = require('mongoose');

const HostSchema = new mongoose.Schema({
    "car": {
        type: String,
        required: [true, "Name is required"]
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
    }
},
    {
        timestamps: true
    }
);

exports.host = mongoose.model('host',HostSchema);