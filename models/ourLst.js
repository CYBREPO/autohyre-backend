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
            type: String
        },
        mainImg: {
            type: String
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