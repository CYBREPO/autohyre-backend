const mongoose = require('mongoose');

const teamsSchema = mongoose.Schema(
    {
        header: {
            type: String,
        },
        bannerImg: {
            type: String
        },
        leaders: [{ type: mongoose.Types.ObjectId, ref: 'teamsMember'}],
        boardOfDirectors: [{ type: mongoose.Types.ObjectId, ref: 'teamsMember'}],
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