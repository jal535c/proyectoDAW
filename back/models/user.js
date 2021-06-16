'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;     //formato de los campos

var UserSchema = Schema({
  name: String,
  surname: String,
  email: String,
  password: String,
  role: String,
  image: String
});

//exporta un modelo de mongoose, le paso nombre de entidad (clase User) y schema
//cuando guarde un documento, le pone users (minuscula y plurar) al crear la coleccion
module.exports = mongoose.model('User', UserSchema);

