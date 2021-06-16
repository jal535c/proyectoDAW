import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Album } from '../../models/album';
import { Song } from '../../models/song';

import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';
import { AlbumService } from '../../services/album.service';
import { SongService } from '../../services/song.service';

import { PlaylistService } from '../../services/playlist.service';


@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  providers: [UserService, AlbumService, SongService, PlaylistService]
})

export class PlaylistComponent implements OnInit {
  public album: Album;
  public songs: Song[];
  public identity;
  public token;
  public url: string;
  public alertMessage;
  public alertPlaylist: boolean = false;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _albumService: AlbumService,
    private _songService: SongService,
    private _playlistService: PlaylistService
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    console.log('album-detail.component.ts cargado');

    // Sacar album de la bbdd
    //this.getAlbum();
    this.getSongs();
  }

  getSongs() {
    this._playlistService.getSongs(this.token).subscribe(      
      response => {
        if (!response.songs) {
          this.alertPlaylist = true;
          this.alertMessage = 'No tiene canciones en la playlist';
        } else {
          this.alertPlaylist = false;
          this.songs = response.songs;
          console.log(this.songs);
        }
      },
      error => {
        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = JSON.parse(error._body);
          //this.alertMessage = body.message;
          console.log(error);
        }
      });
  }

  getAlbum() {
    this._route.params.forEach((params: Params) => {
      let id = params['id'];

      this._albumService.getAlbum(this.token, id).subscribe(
        response => {
          if (!response.album) {
            this._router.navigate(['/']);
          } else {
            this.album = response.album;

            // Sacar las canciones
            this._songService.getSongs(this.token, response.album._id).subscribe(
              response => {
                if (!response.songs) {
                  this.alertMessage = 'Este album no tiene canciones';
                } else {
                  this.songs = response.songs;
                }
              },
              error => {
                var errorMessage = <any>error;

                if (errorMessage != null) {
                  var body = JSON.parse(error._body);
                  //this.alertMessage = body.message;

                  console.log(error);
                }
              });
          }
        },
        error => {
          var errorMessage = <any>error;

          if (errorMessage != null) {
            var body = JSON.parse(error._body);
            //this.alertMessage = body.message;

            console.log(error);
          }
        }
      );
    });
  }

  startPlayer(song) {
    let song_player = JSON.stringify(song);
    let file_path = this.url + 'get-song-file/' + song.file;
    let image_path = this.url + 'get-image-album/' + song.album.image;

    localStorage.setItem('sound_song', song_player);

    document.getElementById("mp3-source").setAttribute("src", file_path);
    (document.getElementById("player") as any).load();
    (document.getElementById("player") as any).play();

    document.getElementById('play-song-title').innerHTML = song.name;
    document.getElementById('play-song-artist').innerHTML = song.album.artist.name;
    document.getElementById('play-image-album').setAttribute('src', image_path);

  }

  deleteFavorite(id) {
    this._playlistService.deleteSong(this.token, id).subscribe(
      response => {
        if (!response) {
          this.alertMessage = 'Error en el servidor';
        } else {
          //this.alertMessage = 'Borrado de favorito';  
          this.getSongs();        
        }
      },
      error => {
        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = JSON.parse(error._body);
          this.alertMessage = body.message;
          console.log(error);
        }
      }
    );
  }
}