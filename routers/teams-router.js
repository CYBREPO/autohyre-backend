const express = require('express');
const teamsController = require('../controller/teams-controller');
const store = require('../middleware/multer');

const router = express.Router();
const hostUpload = store.store.fields([{ name: 'bannerImg', maxCount: 1 }]);

exports.router = router.get('/getTeams',teamsController.getTeams)
                        .post('/updateTeams',store.store.single('bannerImg'),teamsController.updateTeams)
                        .post('/addUpdateTeamMember',store.store.single('profile'),teamsController.addUpdateTeamMember)
                        .get('/deleteTeamMember',teamsController.deleteTeamMember)
                        .post('/saveTeams',hostUpload,teamsController.saveTeams);