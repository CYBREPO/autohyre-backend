const mongoose = require('mongoose');

const quotationRequestSchema = mongoose.Schema(
    {
        userDetails: {
            id: {
                type: mongoose.Types.ObjectId
            },
            name: {
               type: String, 
            },
            email: {
               type: String, 
            }
            
        },
        vehicleDetails: {
            "make": {
               type: String, 
            },
            "model": {
               type: String, 
            },
            "name": {
               type: String, 
            },
            "type": {
               type: String, 
            },
            "vin": {
               type: String, 
            },
            "year": {
                type: Number, 
             },
        },
        pickupLocation: {
            "address": String,
            "addressLines": [String],
            "city": String,
            "country": String,
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
        dropLocation: {
            "address": String,
            "addressLines": [String],
            "city": String,
            "country": String,
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
        pickupDate: {
            type:  String
        },
        dropDate: {
            type:  String
        },
        additionalInfo: {
            type: String
        }
    },
    {
        timestamps: true
    }
);
quotationRequestSchema.index({ "userDetails.name": 'text', "vehicleDetails.model": 'text', "vehicleDetails.year": 'text', "vehicleDetails.make": "text"});
exports.quotationRequest = mongoose.model('quotationRequest', quotationRequestSchema);