export class Album {
  constructor(public params: IAlbum) {}
}

interface IAlbum {
  id: string; // uuid v4
  name: string;
  year: number;
  artistId: string | null; // refers to Artist
}
