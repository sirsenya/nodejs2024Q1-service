import { FavorableEntity } from 'src/entity';

export class Track extends FavorableEntity {
  constructor(public params: ITrack) {
    super();
  }
}

interface ITrack {
  id: string; // uuid v4
  name: string;
  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
  duration: number; // integer number
}
