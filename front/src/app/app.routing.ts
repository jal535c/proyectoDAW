import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { ArtistListComponent } from './components/artist-list/artist-list.component';
import { ArtistAddComponent } from './components/artist-add/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail/artist-detail.component';
import { AlbumAddComponent } from './components/album-add/album-add.component';
import { AlbumEditComponent } from './components/album-edit/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail/album-detail.component';
import { SongAddComponent } from './components/song-add/song-add.component';
import { SongEditComponent } from './components/song-edit/song-edit.component';
import { AlbumListComponent } from './components/album-list/album-list.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { SearchComponent } from './components/search/search.component';
import { SearchListComponent } from './components/search-list/search-list.component';

//Servicios
import { UserGuard } from './services/user.guard';


const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'mis-datos', component: UserEditComponent, canActivate:[UserGuard]},
	{path: 'artistas/:page', component: ArtistListComponent, canActivate:[UserGuard]},
	{path: 'crear-artista', component: ArtistAddComponent, canActivate:[UserGuard]},
	{path: 'editar-artista/:id', component: ArtistEditComponent, canActivate:[UserGuard]},
	{path: 'artista/:id', component: ArtistDetailComponent, canActivate:[UserGuard]},
	{path: 'albums', component: AlbumListComponent, canActivate:[UserGuard]},
	{path: 'crear-album/:artist', component: AlbumAddComponent, canActivate:[UserGuard]},
	{path: 'editar-album/:id', component: AlbumEditComponent, canActivate:[UserGuard]},
	{path: 'album/:id', component: AlbumDetailComponent, canActivate:[UserGuard]},
	{path: 'crear-tema/:album', component: SongAddComponent, canActivate:[UserGuard]},
	{path: 'editar-tema/:id', component: SongEditComponent, canActivate:[UserGuard]},
  {path: 'mis-canciones', component: PlaylistComponent},
  {path: 'buscar', component: SearchComponent},
  {path: 'busqueda/:search', component: SearchListComponent},	
	{path: '**', component: HomeComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);