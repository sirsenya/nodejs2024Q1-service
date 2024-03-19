import { FavorableEntity } from 'src/entity';

export class Album extends FavorableEntity {
  constructor(public params: IAlbum) {
    super();
  }
}

export interface IAlbum {
  id: string; // uuid v4
  name: string;
  year: number;
  artistId: string | null; // refers to Artist
}
