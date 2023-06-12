const mongoose = require('mongoose');

const mainSchema = mongoose.Schema(
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
            }
        },
        mainImg: {
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
            }
        },
        features: [
            {
                title: {type: String},
                description: {type: String}
            }
        ],
        isActive: {
            type: Boolean,
            default: true,
        }
    },
    {
        timestamps: true
    }
);

exports.ourLists = mongoose.model('ourList',mainSchema);