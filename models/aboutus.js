const mongoose = require('mongoose');

const aboutusSchema = mongoose.Schema(
    {
        header: {
            type: String,
        },
        body: {
            type: String,
        },
        footer: {
            type: String,
        },
        bannerImg: {
            type: String
        },
        mainImg: {
            type: String
        },
        isActive: {
            type: Boolean,
            default: true,
        }
    },
    {
        timestamps: true
    }
);

exports.aboutus = mongoose.model('aboutus',aboutusSchema);