import { Album } from 'src/album/entities/album.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Track } from 'src/track/entities/track.entity';

export class Fav {
  constructor(public params: IFavorites) {}
}

export interface IFavorites {
  artists: string[]; // favorite artists ids
  albums: string[]; // favorite albums ids
  tracks: string[]; // favorite tracks ids
}

export interface IFavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
