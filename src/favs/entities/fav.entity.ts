import { IAlbum } from 'src/album/entities/album.entity';
import { IArtist } from 'src/artist/entities/artist.entity';
import { ITrack } from 'src/track/entities/track.entity';

export class Fav {
  constructor(public params: IFavorites) {}
}

export interface IFavorites {
  artists: string[]; // favorite artists ids
  albums: string[]; // favorite albums ids
  tracks: string[]; // favorite tracks ids
}

export interface IFavoritesResponse {
  artists: IArtist[];
  albums: IAlbum[];
  tracks: ITrack[];
}
