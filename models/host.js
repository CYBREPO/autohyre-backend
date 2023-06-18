const mongoose = require('mongoose');

const HostSchema = new mongoose.Schema(
    {
        "make": {
            type: String,
            required: [true, "Make is required"]
        },
        "model": {
            type: String,
            required: [true, "Model is required"]
        },
        "year": {
            type: String,
            required: [true, "Year is required"]
        },
        "vin": {
            type: String,
            required: [true, "VIN is required"]
        },
        "ownerName": {

        },
        "ownerProfile": {
            type: String
        },
        "ownerMobile": {
            type: String,
            // required: [true, "Email is required"]
        },
        // "isSameAsOnwer":{
        //     type: Boolean
        // },
        "dirverDetails": {
            "drivingLicense": {
                type: String,
            },
            "driverName": {
                type: String,
            },
            "driverMobile": {
                type: String,
            },
            "driverProfile": {
                type: String,
            }
        },
        "goals": {
            type: String,
        },
        "carAvailability": {
            type: String,
        },
        "carPhotos": [
            {
                type: String
            }

        ],
        "payout": {
            "bankName": {
                type: String
            },
            "accountName": {
                type: String
            },
            "accountNumber": {
                type: String
            }
        },
        "airBags": {
            type: Boolean
        },
        "fireExtinguisher": {
            type: Boolean
        },
        "cCaution": {
            type: Boolean
        },
        "umbrella": {
            type: Boolean
        },
        "safetyQuantity": {
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