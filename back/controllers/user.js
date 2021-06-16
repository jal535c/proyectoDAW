'use strict'

var bcrypt = require('bcrypt-nodejs');    //para cifrar contraseñas
//var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');   //libreria de node para el file system (usada en el metodo getImageFile)
var path = require('path');   //libreria para trabajar con rutas del SO (usada en el metodo getImageFile)

var User = require('../models/user');
var jwt = require('../services/jwt');


/**
 * Clase para la gestión de los usuarios
 *
 * @class UserController
 */
class UserController {

  /**
   * Guarda usuarios, comprueba que no hay ninguno registrado con el mismo email
   *
   * @param {*} req - objeto que trae los valores pasados por el body en la peticion
   * @param {*} res - objeto respuesta
   * @memberof UserController
   */
  saveUser(req, res) {
    var params = req.body;    //recoge el body que me llega
    
    var user = new User();
    
    if (params.name && params.surname && params.email && params.password) {
      user.name = params.name;
      user.surname = params.surname;    
      user.email = params.email;    
      user.role = 'ROLE_USER';    //por defecto el rol es user, antes creo un ROLE_ADMIN a mano
      user.image = 'null';
      
      //comprobar que el email sea unico
      User.find({email: user.email.toLowerCase()}).exec((err, users) => {
        
        if (err) return res.status(500).send({message: 'Error en la peticion de usuarios'});
        
        if (users && users.length>=1) {
          return res.status(200).send({message: 'El usuario que intenta registrar ya existe!!!'});
        } else {
          //cifra la password y guarda los datos
          bcrypt.hash(params.password, null, null, function(err, hash) {
            user.password = hash;        
            
            user.save((err, userStored) => {
              if (err) return res.status(500).send({message: 'Error al guardar el usuario'});
            
              if (userStored) {
                res.status(200).send({user: userStored});
              } else {
                res.status(404).send({message: 'No se ha registrado el usuario'});
              }
            });
          });    
        }
      });

    } else {
      res.status(200).send({
        message: 'Envia todos los campos necesarios!!'
      });
    }    
  }


  /**
   * Identifica usuario pasando email y password, para permitir el uso por token pasar tercer parametro gethash a true
   *
   * @param {*} req
   * @param {*} res
   * @memberof UserController
   */
  loginUser(req, res) {
    var params = req.body;    //email y password vienen por el body (y gethash tambien para usar token)

    var email = params.email;
    var password = params.password;

    //buscar por email
    User.findOne({email: email.toLowerCase()}, (err, user) => {
      if (err) {
        res.status(500).send({message: 'Error en la petición'});
      } else {
        if (!user) {  
          res.status(404).send({message: 'El usuario no existe'});
        } else {
          //comprobar la contraseña
          bcrypt.compare(password, user.password, function(err, check) {
            if (check) {

              if (params.gethash) {   //pasar por body el parametro gethash a true para activar el uso por token              
                res.status(200).send({token: jwt.createToken(user)});   //devolver los datos del usuario logueado codificados en un token, despues se enviara en cada peticion
              } else {
                user.password = undefined;    //por seguridad no mostrar informacion de la clave
                res.status(200).send({user});
              }       
              
            } else {
              return res.status(404).send({message: 'El usuario no ha podido loguearse'});
            }
          });
        }
      }
          
    });
  }


  /**
   * Actualiza usuario con los nuevos valores pasados en una petición por body
   *
   * @param {*} req
   * @param {*} res
   * @return {*} 
   * @memberof UserController
   */
  updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    if (userId != req.user.sub) {   //solo puede editar el usuario que esta logueado (el k esta en el token)
      return res.status(500).send({message: 'No tienes permiso para actualizar este usuario'});
    }
      
    User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated) => {   //con new a true devuelve el nuevo objeto ya actualizado
      if (err) {
        res.status(500).send({message: 'Error al actualizar el usuario'});
      } else {
        if (!userUpdated) {
          res.status(404).send({message: 'No se ha podido actualizar el usuario'});
        } else {
          res.status(200).send({user: userUpdated});
        }
      }            
    });    
  }


  /**
   * Metodo para subir imagen al servidor
   *
   * @param {*} req
   * @param {*} res
   * @memberof UserController
   */
  uploadImage(req, res) {
    var userId = req.params.id;
    var file_name = 'No subido ...';

    //files es una variable super global de connect-multiparty  
    //el campo del fichero es image (lo que pongo en el form-data del body)
    if (req.files) {
      var file_path = req.files.image.path;    
      var file_split = file_path.split('\\');    //separo por la barra
      var file_name = file_split[2];    //en la posicion 2 tengo el nombre: uploads/users/nombre

      //saco la extension para subir solo imagenes, no otros ficheros
      var ext_split = file_name.split('\.');    //separo por el punto
      var file_ext = ext_split[1];
      
      if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
        //actualizar documento del usuario logueado
        User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) => {           
          if (!userUpdated) {
            res.status(404).send({message: 'No se ha podido actualizar el usuario'});
          } else {
            res.status(200).send({image: file_name, user: userUpdated});
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
   * Metodo para obtener imagen del servidor, no necesita autenticación
   *
   * @param {*} req
   * @param {*} res
   * @memberof UserController
   */
  getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/'+imageFile;

    fs.exists(path_file, function(exists) {
      if (exists) {
        res.sendFile(path.resolve(path_file));    //en vez res.send uso res.sendFile, y la libreria de node path
      } else {
        res.status(200).send({message: 'No existe la imagen...'});
      }
    });
  }
}


module.exports = new UserController();