const mongoose = require('mongoose');

const pagesSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true
        },
        description: {
            type: String,
            require: true
        },
        images: [
            {
                type: String
            }
        ],
    },
    {
        timestamps: true
    }
);

exports.page = mongoose.model('page',pagesSchema);