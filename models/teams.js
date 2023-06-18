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
                type: String
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

exports.teams = mongoose.model('team', teamsSchema);