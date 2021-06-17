# proyectoDAW
Proyecto Despliegue de Aplicaciones Web

-URL aplicación desplegada en remoto (MongoDB Atlas, Heroku, Github Pages):

https://jal535c.github.io/spotify/

-Usuario administrador:

email: admin@admin.com  
password: 1234


# Instrucciones de uso local en Windows:

## Base de datos:
-Instalar MongoDB

-Lanzar el servicio mongod.exe

-Restaurar la base de datos:   
 mongorestore -d spotify_db mongodb_files/spotify_db

## Backend:
-Instalar Node.js y npm

-Acceder a la carpeta back:  
 cd back

-Instalar dependencias:  
 npm install

-Lanzar el servidor en modo desarrollo:  
 npm run dev

## Frontend:
-Instalar angular cli de forma global:  
 npm install -g @angular/cli

-Acceder a la carpeta front:  
 cd front

-Instalar dependencias:  
 npm install

-Lanzar el servidor de desarrollo de angular:  
 ng serve

-Acceder a la aplicación desde el navegador en el puerto por defecto:  
 http://localhost:4200



