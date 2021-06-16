'use strict'

var path = require('path');   //librerias de node
var fs = require('fs');

var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');


/**
 * Clase para la gestión de los artistas
 *
 * @class ArtistController
 */
class ArtistController {

  /**
   * Guarda artista en la base de datos
   *
   * @param {*} req
   * @param {*} res
   * @memberof ArtistController
   */
  saveArtist(req, res) {
    var params = req.body;

    var artist = new Artist();
    
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err, artistStored) => {
      if (err) {
        res.status(500).send({message: 'Error al guardar el artista'});
      } else {
        if (!artistStored) {
          res.status(404).send({message: 'El artista no ha sido guardado'});
        } else {
          res.status(200).send({artist: artistStored});
        }
      }
    });
  }


  /**
   * Recupera artista según su id
   *
   * @param {*} req
   * @param {*} res
   * @memberof ArtistController
   */
  getArtist(req, res) {
    var artistId = req.params.id;

    Artist.findById(artistId, (err, artist) => {
      if (err) {
        res.status(500).send({message: 'Error en la petición.'});
      } else {
        if (!artist) {
          res.status(404).send({message: 'El artista no existe'});
        } else {
          res.status(200).send({artist});
        }
      }
    });
    
  }


  /**
   * Recupera todos los artistas de la base de datos
   *
   * @param {*} req
   * @param {*} res
   * @memberof ArtistController
   */
  getArtists(req, res) {
    if (req.params.page) {
      var page = req.params.page;
    } else {
      var page = 1;
    }
    
    var itemsPerPage = 4;

    Artist.find().sort('name').paginate(page, itemsPerPage, (err, artists, total) => {
      if (err) {
        res.status(500).send({message: 'Error en la petición.'});
      } else {
        if (!artists) {
          res.status(404).send({message: 'No hay artistas'});
        } else {
          return res.status(200).send({
            total_items: total,
            artists: artists
          });
        }
      }
    });
  }


  /**
   * Actualiza artista pasando id por parametro y nuevos datos por body
   *
   * @param {*} req
   * @param {*} res
   * @memberof ArtistController
   */
  updateArtist(req, res) {
    var artistId = req.params.id;
    var update = req.body;

    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
      if (err) {
        res.status(500).send({message: 'Error al actualizar el artista'});
      } else {
        if (!artistUpdated) {
          res.status(404).send({message: 'El artista no ha sido actualizado'});
        } else {
          res.status(200).send({artist: artistUpdated});
        }
      }
    });
  }


  /**
   * Borra un artista en cascada, con sus albums, y canciones asociadas
   *
   * @param {*} req
   * @param {*} res
   * @memberof ArtistController
   */
  deleteArtist(req, res) {
    var artistId = req.params.id;
    
    Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
      if (err) {
        res.status(500).send({message: 'Error al eliminar el artista'});
      } else {
        if (!artistRemoved) {
          res.status(404).send({message: 'El artista no ha sido eliminado'});
        } else {
          //res.status(200).send({artistRemoved});

          Album.find({artist: artistRemoved._id}).remove((err, albumRemoved) => {
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
                      res.status(200).send({ artist: artistRemoved});
                    }
                  }
                });
              }
            }
          });
        }
      }
    });
  }


  /**
   * Sube imagen de artista al servidor
   *
   * @param {*} req
   * @param {*} res
   * @memberof ArtistController
   */
  uploadImage(req, res) {
    var artistId = req.params.id;
    var file_name = 'No subido ...';

    if (req.files) {
      var file_path = req.files.image.path;    
      var file_split = file_path.split('\\');    
      var file_name = file_split[2];    
      
      var ext_split = file_name.split('\.');
      var file_ext = ext_split[1];
      
      if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
        //actualizar documento de usuario logueado
        Artist.findByIdAndUpdate(artistId, {image: file_name}, {new: true}, (err, artistUpdated) => {            
          if (!artistUpdated) {
            res.status(404).send({message: 'No se ha podido actualizar el usuario'});
          } else {
            res.status(200).send({artist: artistUpdated});
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
   * Obtiene imagen del servidor
   *
   * @param {*} req
   * @param {*} res
   * @memberof ArtistController
   */
  getImageFile(req, res) {
    var image_file = req.params.imageFile;
    var path_file = './uploads/artists/'+image_file;

    fs.exists(path_file, function(exists) {
      if (exists) {
        res.sendFile(path.resolve(path_file));
      } else {
        res.status(200).send({message: 'No existe la imagen...'});
      }
    });
  }


  /**
   * Hace una busqueda de artista por nombre o descripción
   *
   * @param {*} req
   * @param {*} res
   * @memberof ArtistController
   */
  search(req, res) {
    //sacar el string a buscar
    var searchString = req.params.search;

    //find or
    Artist.find({ "$or": [
      { "name": { "$regex": searchString, "$options": "i" } },
      { "description": { "$regex": searchString, "$options": "i" } }
    ]})
    .sort([['name', 'descending']]).exec((err, artists) => {

      if (err) {
        return res.status(500).send({message: 'Error en la peticion'});
      }
      
      if (!artists || artists.length<=0) {
        return res.status(404).send({message: 'No hay artistas que coincidan con la busqueda'});
      }

      return res.status(200).send({artists});

    });
  }
  
}


module.exports = new ArtistController();