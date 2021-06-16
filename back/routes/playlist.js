'use strict'

var express = require('express');
var PlaylistController = require('../controllers/playlist');

var api = express.Router();

var md_auth = require('../middlewares/authenticated');

api.post('/playlist', md_auth.ensureAuth, PlaylistController.savePlaylist);
api.get('/get-my-songs', md_auth.ensureAuth, PlaylistController.getMyPlaylist);
api.delete('/playlist/:id', md_auth.ensureAuth, PlaylistController.deletePlaylist);

module.exports = api;