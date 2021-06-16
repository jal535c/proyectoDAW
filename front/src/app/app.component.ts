import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { User } from './models/user';
import { UserService } from './services/user.service';
import { GLOBAL } from './services/global';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit {
  public title = 'Spotify';
  public user: User;    //para el login
  public user_register: User;   //para el register, llevado al componente user-register
  public identity;
  public token;
  public errorMessage;
  public alertRegister;
  public url: string;
  public isReg:boolean;
  public isLanding:boolean;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService:UserService
  ){
  	this.user = new User('','','','','','ROLE_USER','');
    this.user_register = new User('','','','','','ROLE_USER','');
    this.url = GLOBAL.url;

    this.isReg=false;
    this.isLanding=true;
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();

    console.log(this.identity);
    console.log(this.token);
  }

  public onSubmit(){
  	console.log(this.user);

    // Conseguir los datos del usuario identificado
    this._userService.signup(this.user).subscribe(
      response => {
        let identity = response.user;
        this.identity = identity;
        console.log(this.identity);
        if (!this.identity._id) {
          //alert("El usuario no está correctamente identificado");
          this.errorMessage="El usuario no está correctamente identificado";
        } else {
          // Crear elemento en el localstorage para tener al usuario sesión
          localStorage.setItem('identity', JSON.stringify(identity));
          // Conseguir el token para enviarselo a cada petición http
          this._userService.signup(this.user, 'true').subscribe(
            response => {
              let token = response.token;
              this.token = token;
              if (this.token.length <= 0) {
                alert("El token no se ha generado correctamente");
              } else {
                // Crear elemento en el localstorage para tener token disponible, limpiar campo
                localStorage.setItem('token', token);
                this.user = new User('','','','','','ROLE_USER','');
              }
            },
            error => {
              var errorMessage = <any>error;
              if (errorMessage != null) {
                var body = JSON.parse(error._body);
                this.errorMessage = body.message;
                console.log(error);
              }
            }
          );
        }
      },
      error => {
        var errorMessage = <any>error;
        this.errorMessage ="error al identificarse";
        if (errorMessage != null) {
          var body = JSON.parse(error._body);
          this.errorMessage = body.message;
          console.log(error);
        }
      }
    );

  }

  logout(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();

    this.identity = null;
    this.token = null;
    this.isLanding = true;
    this._router.navigate(['/']);
  }

  onRegister() {
    this.isReg = !this.isReg;
  }

  clickInput(){
    this.errorMessage = null;
  }

  onCapture(event) {
    this.isLanding = event.isLanding;
    this.isReg = event.isReg;
  }
  
}
