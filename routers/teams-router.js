const express = require('express');
const teamsController = require('../controller/teams-controller');
const store = require('../middleware/multer');

const router = express.Router();

exports.router = router.post('/saveLeaders',store.store.single("profile"),teamsController.saveLeaders)
                        .get('/getAllLeaders',teamsController.getAllLeaders);