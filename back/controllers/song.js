'use strict'

var path = require('path');
var fs = require('fs');

var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');


/**
 * Clase para gestionar las canciones
 *
 * @class SongController
 */
class SongController {

  /**
   * Guarda la informacion de una cancion en la base de datos
   *
   * @param {*} req
   * @param {*} res
   * @memberof SongController
   */
  saveSong(req, res) {
    var params = req.body;

    var song = new Song();
    
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;

    song.save((err, songStored) => {
      if (err) {
        res.status(500).send({message: 'Error en el servidor'});
      } else {
        if (!songStored) {
          res.status(404).send({message: 'No se ha guardado la canción'});
        } else {
          res.status(200).send({song: songStored});
        }
      }
    });
  }


  /**
   * Obtiene una cancion según el id
   *
   * @param {*} req
   * @param {*} res
   * @memberof SongController
   */
  getSong(req, res) {
    var songId = req.params.id;

    //populate para rellenar los datos del album asociado
    Song.findById(songId).populate({path: 'album'}).exec((err, song) => {
      if (err) {
        res.status(500).send({message: 'Error en la petición.'});
      } else {
        if (!song) {
          res.status(404).send({message: 'La canción no existe'});
        } else {
          res.status(200).send({song});
        }
      }
    });
    
  }


  /**
   * Obtiene todas las canciones de un album
   *
   * @param {*} req
   * @param {*} res
   * @memberof SongController
   */
  getSongs(req, res) {
    var albumId = req.params.album;

    if (!albumId) {    
      //busca todas
      var find = Song.find({}).sort('number');;
    } else {    
      //busca todas las canciones de un album
      var find = Song.find({album: albumId}).sort('number');;
    }

    //path indica el campo donde se rellena, en cascada
    find.populate({
      path: 'album',
      populate: {
        path: 'artist',
        model: 'Artist'
      }
    }).exec((err, songs) => {
      if (err) {
        res.status(500).send({message: 'Error en la petición.'});
      } else {
        if (!songs) {
          res.status(404).send({message: 'No hay canciones'});
        } else {
          res.status(200).send({songs});
        }
      }
    });
  }


  /**
   * Actualiza una canción
   *
   * @param {*} req
   * @param {*} res
   * @memberof SongController
   */
  updateSong(req, res) {
    var songId = req.params.id;
    var update = req.body;
    
    Song.findByIdAndUpdate(songId, update, {new: true}, (err, songUpdated) => {
      if (err) {
        res.status(500).send({message: 'Error en el servidor'});
      } else {
        if (!songUpdated) {
          res.status(404).send({message: 'No se ha actualizado la canción'});
        } else {
          res.status(200).send({song: songUpdated});
        }
      }
    });
  }


  /**
   * Elimina una canción
   *
   * @param {*} req
   * @param {*} res
   * @memberof SongController
   */
  deleteSong(req, res) {
    var songId = req.params.id;

    Song.findByIdAndRemove(songId, (err, songRemoved) => {
      if (err) {
        res.status(500).send({message: 'Error en el servidor'});
      } else {
        if (!songRemoved) {
          res.status(404).send({message: 'No se ha borrado la canción'});
        } else {
          res.status(200).send({song: songRemoved});        
        }
      }
    });
  }

  
  /**
   * Sube el fichero de una canción al servidor
   *
   * @param {*} req
   * @param {*} res
   * @memberof SongController
   */
  uploadFile(req, res) {
    var songId = req.params.id;
    var file_name = 'No subido ...';

    //files es una variable super global de connect-multiparty
    if (req.files) {
      var file_path = req.files.file.path;    //pongo file en el form-data del body
      var file_split = file_path.split('\\');    
      var file_name = file_split[2];    //en la posicion 2 tengo el nombre: uploads/songs/nombre

      //necesito sacar la extension, para subir solo ficheros de musica
      var ext_split = file_name.split('\.');   
      var file_ext = ext_split[1];
      
      if (file_ext == 'mp3' || file_ext == 'ogg') {
        
        Song.findByIdAndUpdate(songId, {file: file_name}, {new: true}, (err, songUpdated) => {            
          if (!songUpdated) {
            res.status(404).send({message: 'No se ha podido actualizar la canción'});
          } else {
            res.status(200).send({song: songUpdated});
          }            
        });

      } else {      
        res.status(200).send({message: 'Extensión del archivo no válida'});
      }
    } else {
      res.status(200).send({message: 'No has subido el fichero de audio...'});
    } 
  }


  /**
   * Recupera el fichero de audio del servidor
   *
   * @param {*} req
   * @param {*} res
   * @memberof SongController
   */
  getSongFile(req, res) {
    var song_file = req.params.songFile;
    var path_file = './uploads/songs/'+song_file;

    fs.exists(path_file, function(exists) {
      if (exists) {
        res.sendFile(path.resolve(path_file));
      } else {
        res.status(200).send({message: 'No existe fichero de audio...'});
      }
    });
  }

}


module.exports = new SongController();