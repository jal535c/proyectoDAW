import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Album } from '../models/album';
import { GLOBAL } from './global';


@Injectable()
export class AlbumService{
	public url: string;

	constructor(private _http: HttpClient){
		this.url = GLOBAL.url;
	}

	getAlbums(token, artistId = null):Observable<any> {		
		let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    
    if (artistId == null) {
			return this._http.get(this.url+'albums', {headers});		
		} else {
			return this._http.get(this.url+'albums/'+artistId, {headers});		
		}
	}

	getAlbum(token, id: string):Observable<any> {		
		let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    
    return this._http.get(this.url+'album/'+id, {headers});		
	}

	addAlbum(token, album: Album):Observable<any> {
		let params = JSON.stringify(album);
		
		let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    
    return this._http.post(this.url+'album', params, {headers: headers});		
	}

	editAlbum(token, id:string, album: Album):Observable<any> {
		let params = JSON.stringify(album);
		
		let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    
    return this._http.put(this.url+'album/'+id, params, {headers: headers});		
	}

	deleteAlbum(token, id: string):Observable<any> {		
		let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    
    return this._http.delete(this.url+'album/'+id, {headers});
	}

}