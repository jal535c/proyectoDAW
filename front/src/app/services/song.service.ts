import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GLOBAL } from './global';
import { Song } from '../models/song';


@Injectable()
export class SongService{
	public url: string;

	constructor(private _http: HttpClient){
		this.url = GLOBAL.url;
	}

	getSongs(token, albumId = null):Observable<any> {		
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    
		if (albumId == null) {
			return this._http.get(this.url+'songs', {headers});				 
		} else {
			return this._http.get(this.url+'songs/'+albumId, {headers});				 
		}
	}

	getSong(token, id: string):Observable<any> {		
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    
		return this._http.get(this.url+'song/'+id, {headers});		
	}

	addSong(token, song: Song):Observable<any> {
		let params = JSON.stringify(song);
		
		let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    
    return this._http.post(this.url+'song', params, {headers: headers});		
	}

	editSong(token, id:string, song: Song):Observable<any> {
		let params = JSON.stringify(song);
		
		let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    
    return this._http.put(this.url+'song/'+id, params, {headers: headers});		
	}

	deleteSong(token, id: string):Observable<any> {		
		let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    
    return this._http.delete(this.url+'song/'+id, {headers});		
	}

}