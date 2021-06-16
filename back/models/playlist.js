'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlaylistSchema = Schema({
	user: { type: Schema.ObjectId, ref: 'User'},	
	song: { type: Schema.ObjectId, ref: 'Song'}
});

module.exports = mongoose.model('Playlist', PlaylistSchema);