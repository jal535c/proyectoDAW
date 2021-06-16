'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AlbumSchema = Schema({
  title: String,
  description: String,
  year: Number,  
  image: String,
  artist: {type: Schema.ObjectId, ref: 'Artist'}
});

//exporta un modelo de mongoose, le paso nombre de entidad y schema
//cuando guarde un documento, le pone albums al crear la coleccion
module.exports = mongoose.model('Album', AlbumSchema);
