import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GLOBAL } from './global';


@Injectable()
export class UserService{
	public identity;    //objeto del usuario identificado
	public token;       //para autenticarnos en el api
	public url: string;

	constructor(private _http: HttpClient){
		this.url = GLOBAL.url;
	}

	signup(user_to_login, gethash = null):Observable<any> {
		if (gethash != null) {
			user_to_login.gethash = gethash;    //añado parametro al objeto, para usar token
		}
		let json = JSON.stringify(user_to_login);   //pasa objeto a string en formato json
		let params = json;
		
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.post(this.url+'login', params, {headers: headers});						 
	}

	register(user_to_register):Observable<any> {
		let params = JSON.stringify(user_to_register);
		
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.post(this.url+'register', params, {headers: headers});		
	}

	updateUser(user_to_update):Observable<any>{
		let params = JSON.stringify(user_to_update);
		
		let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.getToken());

		return this._http.put(this.url+'update-user/'+user_to_update._id, params, {headers: headers});		
	}

	getIdentity(){
		let identity = JSON.parse(localStorage.getItem('identity'));    //pasa string en formato json a objeto js

		if(identity != "undefined"){
			this.identity = identity;
		}else{
			this.identity = null;
		}

		return this.identity;
	}

	getToken(){
		let token = localStorage.getItem('token');    //el token ya es un string

		if(token != "undefined"){
			this.token = token;
		}else{
			this.token = null;
		}

		return this.token;
	}

}