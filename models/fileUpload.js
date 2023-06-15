const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema(
    {
        file: {
            type: String
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