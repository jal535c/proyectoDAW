'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');

var secret = 'mi_clave_secreta';

exports.createToken = function(user) {    //le paso el objeto a codificar
  var payload = {
    sub: user._id,    //en jwt al id se le llama sub
    name: user.name,
    surname: user.surname,    
    email: user.email,    //la clave solo la uso para login, aqui no, una vez logueado el token me deja pasar o no
    role: user.role,
    image: user.image,
    iat: moment().unix(),   //fecha de creacion, timestamp
    exp: moment().add(30, 'days').unix  //fecha de expiracion, la compruebo en el middleware
  };

  return jwt.encode(payload, secret);   
}