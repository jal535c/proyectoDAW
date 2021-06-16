'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3000;

mongoose.Promise = global.Promise;    //elimina el aviso de la consola

//uri para desarrollo en local
var URIlocal = 'mongodb://localhost:27017/spotify_db';

//uri remota en mongodb atlas
const uri = "mongodb+srv://juan_atlas:1234_cloud@cluster0.qetqb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(URIlocal, { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
  if (err) {
    throw err;
  } else {
    console.log("Conexión con éxito a la base de datos...");

    app.listen(port, function() {
      console.log("Servidor del api rest en puerto "+port);
    });
  }
});