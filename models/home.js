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
            filename: {
                type: String,
                // unique : true,
                // required: true
            },
            contentType: {
                type: String,
                // required: true
            },
            imageBase64: {
                type: String,
                // required: true
            }
        }],
        mainImg: {
            filename: {
                type: String,
                // unique : true,
                // required: true
            },
            contentType: {
                type: String,
                // required: true
            },
            imageBase64: {
                type: String,
                // required: true
            }
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