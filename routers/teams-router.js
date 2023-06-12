const express = require('express');
const teamsController = require('../controller/teams-controller');
const store = require('../middleware/multer');

const router = express.Router();
const hostUpload = store.store.fields([{ name: 'bannerImg', maxCount: 1 }, { name: 'leadersProfile', maxCount: 1 },{ name: 'boardProfile', maxCount: 1 }]);

exports.router = router.post('/saveLeaders',store.store.single("profile"),teamsController.saveLeaders)
                        .get('/getAllLeaders',teamsController.getAllLeaders)
                        .post('/saveTeams',hostUpload,teamsController.saveTeams);