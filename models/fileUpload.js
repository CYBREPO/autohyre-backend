const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema(
    {
        filename: {
            type: String,
            // unique : true,
            required: true
        },
        contentType: {
            type: String,
            required: true
        },
        imageBase64: {
            type: String,
            required: true
        },
        id: Number,
        vehicleId: mongoose.Types.ObjectId,
        'createdBy': mongoose.Types.ObjectId,
        'modifiedBy': mongoose.Types.ObjectId,
    },
    {
        timestamps: true

    })

exports.fileUpload = mongoose.model('uploads', uploadSchema);