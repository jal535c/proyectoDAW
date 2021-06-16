'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SongSchema = Schema({
  number: String,
  name: String,
  duration: String,
  file: String,
  album: {type: Schema.ObjectId, ref: 'Album'}  
});

//exporta un modelo de mongoose, le paso nombre de entidad y schema
//cuando guarde un documento, le pone songs al crear la coleccion
module.exports = mongoose.model('Song', SongSchema);