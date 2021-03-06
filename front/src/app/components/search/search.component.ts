import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Artist } from '../../models/artist';
import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';
import { ArtistService } from '../../services/artist.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  providers: [UserService, ArtistService]
})
export class SearchComponent implements OnInit {
  public titulo: string;
  public artist: Artist;
  public identity;
  public token;
  public url: string;
  public alertMessage;
  public searchString:string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _artistService: ArtistService
  ) {
    this.titulo = 'Buscar artista';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    
  }

  ngOnInit() {
    console.log('search.component.ts cargado');
  }
/*
  onSubmit() {
    console.log(this.artist);
    this._artistService.addArtist(this.token, this.artist).subscribe(
      response => {
        if (!response.artist) {
          this.alertMessage = 'Error en el servidor';
        } else {
          this.alertMessage = '¡El artista se ha creado correctamente!';
          this.artist = response.artist;
          this._router.navigate(['/editar-artista', response.artist._id]);
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
*/

  onSubmit() {
    console.log(this.searchString);
    this._router.navigate(['/busqueda', this.searchString]);
  }
}