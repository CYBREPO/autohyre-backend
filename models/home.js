const mongoose = require('mongoose');

const homeSchema = mongoose.Schema(
    {
        header: {
            type: String,
        },
        bannerContent: {
            type: String,
        },
        body: {
            type: String,
        },
        footer: {
            type: String,
        },
        bannerImages: [{
            type: String
        }],
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

exports.home = mongoose.model('home',homeSchema);