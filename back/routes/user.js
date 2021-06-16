'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();   //mi router, tiene los verbos http

var md_auth = require('../middlewares/authenticated');    //protejo un metodo mediante middleware de autenticacion, para usar la ruta debo pasarle el token

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'});    //le paso el directorio donde guardara las imagenes

api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);


module.exports = api;