'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArtistSchema = Schema({
  name: String,
  description: String,
  image: String
});

//exporta un modelo de mongoose, le paso nombre de entidad y schema
//cuando guarde un documento, le pone artists al crear la coleccion
module.exports = mongoose.model('Artist', ArtistSchema);

