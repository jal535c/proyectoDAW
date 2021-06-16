'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');
var Playlist = require('../models/playlist');

/**
 * Clase para gestionar la playlist de favoritos
 *
 * @class PlaylistController
 */
class PlaylistController {

  /**
   * Guarda una canción en la playlist del usuario logueado
   *
   * @param {*} req
   * @param {*} res
   * @memberof PlaylistController
   */
  savePlaylist(req, res) {
    var params = req.body;

    var playlist = new Playlist();
    playlist.user = req.user.sub;   
    playlist.song = params.song;

    playlist.save((err, playlistStored) => {
      if (err) return res.status(500).send({message: 'Error al guardar favorito'});

      if (!playlistStored) return res.status(404).send({message: 'La playlist no se ha guardado'});

      return res.status(200).send({playlist: playlistStored});
    });
  }


  /**
   * Recupera las canciones favoritas del usuario logueado
   *
   * @param {*} req
   * @param {*} res
   * @memberof PlaylistController
   */
  getMyPlaylist(req, res) {
    var userId = req.user.sub;

    var find = Playlist.find({user: userId});
    
    find.populate('song').exec((err, songs) => {
      if (err) return res.status(500).send({message: 'Error en el servidor'});

      if (!songs) return res.status(404).send({message: 'No tienes canciones en el playlist'});

      return res.status(200).send({songs});
    });
  }


  /**
   * Borra una cancion de la playlist del usuario logueado
   *
   * @param {*} req
   * @param {*} res
   * @memberof PlaylistController
   */
  deletePlaylist(req, res) {
    var userId = req.user.sub;
    var songId = req.params.id;

    Playlist.find({'user': userId, 'song': songId}).remove(err => {
      if (err) return res.status(500).send({message: 'Error al sacar de la playlist'});

      return res.status(200).send({message: 'Cancion sacada de la playlist!!!'});
    });
  }

}


module.exports = new PlaylistController();