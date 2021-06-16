import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GLOBAL } from './global';
import { Playlist } from '../models/playlist';


@Injectable()
export class PlaylistService{
	public url: string;


	constructor(private _http: HttpClient){
		this.url = GLOBAL.url;
	}


	getSongs(token):Observable<any> {
		let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
		
		return this._http.get(this.url+'get-my-songs', {headers});		
	}
	

	addSong(token, playlist: Playlist):Observable<any> {
		let params = JSON.stringify(playlist);
				
		let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
		return this._http.post(this.url+'playlist', params, {headers: headers});						 
	}

	
	deleteSong(token, id: string):Observable<any> {		
		let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

		return this._http.delete(this.url+'playlist/'+id, {headers});		
	}

}