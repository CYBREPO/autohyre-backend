const mongoose = require('mongoose');

const LeardersSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    designation: {
        type: String,
        require: true,
    },
    bio: {
        type: String,
        require: true,
    },
    profile: {
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
    }
},
    {
        timestamps: true

    }
);

exports.leader = mongoose.model('leader', LeardersSchema);