const mongoose = require('mongoose');

const teamsMemberSchema = mongoose.Schema(
    {
        title: {
            type: String,
            require: true
        },
        name: {
            type: String,
            require: true
        },
        designation: {
            type: String,
            require: true
        },
        description: {
            type: String,
        },
        profile: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

exports.teamsMember = mongoose.model('teamsMember', teamsMemberSchema);