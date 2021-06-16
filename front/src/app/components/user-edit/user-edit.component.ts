import { Component, OnInit } from '@angular/core';

import { User } from '../../models/user';

import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',  
  providers: [UserService]
})
export class UserEditComponent implements OnInit {
  public titulo: string;
  public user: User;
  public identity;
  public token;
  public alertMessage;
  public url: string;

  constructor(
    private _userService: UserService
  ) {
    this.titulo = 'Actualizar mis datos';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.user = this.identity;
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    console.log('user-edit component cargado');
  }

  onSubmit() {
    this._userService.updateUser(this.user).subscribe(
      response => {
        if (!response.user) {
          this.alertMessage = 'El usuario no se ha actualizado';
        } else {
          //this.user = response.user;    //el api devuelve el antiguo
          localStorage.setItem('identity', JSON.stringify(this.user));
          document.getElementById("identity_name").innerHTML = this.user.name;    //en el sidebar

          if (!this.filesToUpload) {
            // Redireccion
          } else {
            this.makeFileRequest(this.url+'upload-image-user/'+this.user._id, [], this.filesToUpload).then(
              (result: any) => {
                this.user.image = result.image;
                localStorage.setItem('identity', JSON.stringify(this.user));

                let image_path = this.url + 'get-image-user/' + this.user.image;
                document.getElementById('image-logged').setAttribute('src', image_path);  //en el sidebar
              }
            );
          }

          this.alertMessage = 'Datos actualizados correctamente';
          //redirige al home
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

  public filesToUpload: Array<File>;
  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;   //archivos recogidos en el input
  }

  makeFileRequest(url: string, params: Array<string>, files: Array<File>) {   //peticion http con promesas
    var token = this.token;     //el metodo para subir requiere token

    return new Promise(function (resolve, reject) {
      var formData: any = new FormData();   //como un formulario
      var xhr = new XMLHttpRequest();

      for (var i=0; i<files.length; i++) {    //recorre el array, aunque solo subo uno
        formData.append('image', files[i], files[i].name);
      }

      xhr.onreadystatechange = function () {  //se llama cada vez k readyState cambia
        if (xhr.readyState == 4) {      //si operacion completada, y me llega ok, resuelve
          if (xhr.status == 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      }

      xhr.open('POST', url, true);    //inicia el pedido
      xhr.setRequestHeader('Authorization', token);
      xhr.send(formData);
    });

  }

}
