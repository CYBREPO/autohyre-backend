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
            }
        ],
    },
    {
        timestamps: true
    }
);

exports.page = mongoose.model('page',pagesSchema);