# proyectoDAW
Proyecto Despliegue de Aplicaciones Web.
Gestión de contenido musical, similar a Spotify.

## Tecnologías utilizadas
* MongoDB
* Node.js
* Angular

## Despliegue
Plataformas utilizadas para desplegar las distintas partes del proyecto:
* MongoDB Atlas
* Heroku
* Github Pages

URL aplicación desplegada  
https://jal535c.github.io/spotify/

Usuario administrador  
email: admin@admin.com  
password: 1234


## Instalación en local (S.O. Windows):

### Base de datos:
* Instalar MongoDB
* Lanzar el servicio `mongod.exe`
* Clonar el proyecto:
```bash
git clone https://github.com/jal535c/proyectoDAW.git
```
* Restaurar la base de datos:   
```bash
mongorestore -d spotify_db mongodb_files/spotify_db
```

## Backend:
* Instalar Node.js y npm
* Acceder a la carpeta back:  
```bash
cd back
```
* Instalar dependencias:  
```bash
npm install
```
* Lanzar el servidor en modo desarrollo:  
```bash
npm run dev
```

### Frontend:
* Instalar angular cli de forma global:  
```bash 
npm install -g @angular/cli
```
* Acceder a la carpeta front:  
```bash 
cd front
```
* Instalar dependencias:  
```bash
npm install
```
* Lanzar el servidor de desarrollo de angular:  
```bash
ng serve
```
* Acceder a la aplicación desde el navegador en el puerto por defecto:  

http://localhost:4200



