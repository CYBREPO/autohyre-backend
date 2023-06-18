const express = require('express');
const teamsController = require('../controller/teams-controller');
const store = require('../middleware/multer');

const router = express.Router();
const hostUpload = store.store.fields([{ name: 'bannerImg', maxCount: 1 }, { name: 'leadersProfile', maxCount: 500 },{ name: 'boardsProfile', maxCount: 500 }]);

exports.router = router.get('/getTeams',teamsController.getTeams)
                        .post('/updateTeams',hostUpload,teamsController.updateTeams)
                        .post('/saveTeams',hostUpload,teamsController.saveTeams);