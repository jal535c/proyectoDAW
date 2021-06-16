import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Album } from '../../models/album';
import { Song } from '../../models/song';
import { Playlist } from '../../models/playlist';

import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';
import { AlbumService } from '../../services/album.service';
import { SongService } from '../../services/song.service';
import { PlaylistService } from '../../services/playlist.service';


@Component({
	selector: 'album-detail',
	templateUrl: './album-detail.component.html',
	providers: [UserService, AlbumService, SongService, PlaylistService]
})
export class AlbumDetailComponent implements OnInit{
	public album: Album;
	public songs: Song[];
	public identity;
	public token;
	public url: string;
	public alertMessage;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _albumService: AlbumService,
    private _songService: SongService,
    private _playlistService: PlaylistService
	){
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
	}

	ngOnInit(){
		console.log('album-detail.component.ts cargado');

		// Sacar album de la bbdd
		this.getAlbum();
	}

	getAlbum(){		
		this._route.params.forEach((params: Params) => {
			let id = params['id'];

			this._albumService.getAlbum(this.token, id).subscribe(
				response => {
					if (!response.album) {
						this._router.navigate(['/']);
					}else{
						this.album = response.album;						
						// Sacar las canciones
						this._songService.getSongs(this.token, response.album._id).subscribe(
						response => {
							if (!response.songs) {
								this.alertMessage = 'Este album no tiene canciones';
							}else{
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

	public confirmado;
	onDeleteConfirm(id) {
		this.confirmado = id;
	}

	onCancelSong() {
		this.confirmado = null;
	}

	onDeleteSong(id) {
		this._songService.deleteSong(this.token, id).subscribe(
			response => {
				if (!response.song) {
					alert('Error en el servidor');
				}
				this.getAlbum();
			},
			error => {
				var errorMessage = <any>error;

		    if(errorMessage != null) {
		      var body = JSON.parse(error._body);
		      //this.alertMessage = body.message;
		      console.log(error);
		    }
			}	
		);
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
  
  addFavorite(id) {
    let playlist = new Playlist('', id);
    this._playlistService.addSong(this.token, playlist).subscribe(
      response => {
        if (!response) {
          this.alertMessage = 'Error en el servidor';
        } else {
          //this.alertMessage = 'Añadido a favorito';          
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