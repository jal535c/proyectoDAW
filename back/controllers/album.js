'use strict'

var path = require('path');
var fs = require('fs');

var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');


/**
 * Clase para gestionar los albums
 *
 * @class AlbumController
 */
class AlbumController {

  /**
   * Guarda un album
   *
   * @param {*} req
   * @param {*} res
   * @memberof AlbumController
   */
  saveAlbum(req, res) {
    var params = req.body;

    var album = new Album();  
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save((err, albumStored) => {
      if (err) {
        res.status(500).send({message: 'Error en el servidor'});
      } else {
        if (!albumStored) {
          res.status(404).send({message: 'No se ha guardado el album'});
        } else {
          res.status(200).send({album: albumStored});
        }
      }
    });
  }


  /**
   * Obtiene album según su id
   *
   * @param {*} req
   * @param {*} res
   * @memberof AlbumController
   */
  getAlbum(req, res) {
    var albumId = req.params.id;

    //populate para rellenar los datos del artista asociado
    Album.findById(albumId).populate({path: 'artist'}).exec((err, album) => {
      if (err) {
        res.status(500).send({message: 'Error en la petición.'});
      } else {
        if (!album) {
          res.status(404).send({message: 'El album no existe'});
        } else {
          res.status(200).send({album});
        }
      }
    });
    
  }


  /**
   * Obtiene todos los albums de un artista o todos los de la base de datos
   *
   * @param {*} req
   * @param {*} res
   * @memberof AlbumController
   */
  getAlbums(req, res) {
    var artistId = req.params.artist;

    if (!artistId) {    
      //sacar todos los albums de la bbdd    
      var find = Album.find({}).sort('title');;
    } else {
      //sacar todos los albums de un artista concreto (busqueda condicional)
      var find = Album.find({artist: artistId}).sort('year');;
    }
    
    find.populate({path: 'artist'}).exec((err, albums) => {
      if (err) {
        res.status(500).send({message: 'Error en la petición.'});
      } else {
        if (!albums) {
          res.status(404).send({message: 'No hay albums'});
        } else {
          res.status(200).send({albums});
        }
      }
    });
  }


  /**
   * Actualiza album
   *
   * @param {*} req
   * @param {*} res
   * @memberof AlbumController
   */
  updateAlbum(req, res) {
    var albumId = req.params.id;
    var update = req.body;
    
    Album.findByIdAndUpdate(albumId, update, {new: true}, (err, albumUpdated) => {
      if (err) {
        res.status(500).send({message: 'Error en el servidor'});
      } else {
        if (!albumUpdated) {
          res.status(404).send({message: 'No se ha actualizado el album'});
        } else {
          res.status(200).send({album: albumUpdated});
        }
      }
    });
  }


  /**
   * Borra en cascada album y canción
   *
   * @param {*} req
   * @param {*} res
   * @memberof AlbumController
   */
  deleteAlbum(req, res) {
    var albumId = req.params.id;

    Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
      if (err) {
        res.status(500).send({message: 'Error al eliminar el album'});
      } else {
        if (!albumRemoved) {
          res.status(404).send({message: 'El album no ha sido eliminado'});
        } else {
          //res.status(200).send({albumRemoved});

          Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
            if (err) {
              res.status(500).send({message: 'Error al eliminar la canción'});
            } else {
              if (!songRemoved) {
                res.status(404).send({message: 'La canción no ha sido eliminada'});
              } else {
                res.status(200).send({album: albumRemoved});
              }
            }
          });
        }
      }
    });
  }


  /**
   * Metodo para subir imagen al servidor
   *
   * @param {*} req
   * @param {*} res
   * @memberof AlbumController
   */
  uploadImage(req, res) {
    var albumId = req.params.id;
    var file_name = 'No subido ...';

    if (req.files) {
      var file_path = req.files.image.path;    
      var file_split = file_path.split('\\');    
      var file_name = file_split[2];    
      
      var ext_split = file_name.split('\.');   
      var file_ext = ext_split[1];
      
      if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
        //actualizar documento de usuario logueado
        Album.findByIdAndUpdate(albumId, {image: file_name}, {new: true}, (err, albumUpdated) => {            
          if (!albumUpdated) {
            res.status(404).send({message: 'No se ha podido actualizar el album'});
          } else {
            res.status(200).send({album: albumUpdated});
          }            
        });

      } else {      
        res.status(200).send({message: 'Extensión del archivo no válida'});
      }

    } else {
      res.status(200).send({message: 'No has subido ninguna imagen...'});
    } 
  }


  /**
   * Recupera imagen del servidor
   *
   * @param {*} req
   * @param {*} res
   * @memberof AlbumController
   */
  getImageFile(req, res) {
    var image_file = req.params.imageFile;
    var path_file = './uploads/albums/'+image_file;

    fs.exists(path_file, function(exists) {
      if (exists) {
        res.sendFile(path.resolve(path_file));
      } else {
        res.status(200).send({message: 'No existe la imagen...'});
      }
    });
  }

}


module.exports = new AlbumController();