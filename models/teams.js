const mongoose = require('mongoose');

const teamsSchema = mongoose.Schema(
    {
        header: {
            type: String,
        },
        bannerImg: {
            type: String
        },
        leaders: [
            {
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

            }
        ],
        boardOfDirectors: [{
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
            }

        }],
        isActive: {
            type: Boolean,
            default: true,
        }
    },
    {
        timestamps: true
    }
);

exports.teams = mongoose.model('team',teamsSchema);