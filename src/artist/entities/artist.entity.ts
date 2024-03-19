import { FavorableEntity } from 'src/entity';

export class Artist extends FavorableEntity {
  constructor(public params: IArtist) {
    super();
  }
}

export interface IArtist {
  id: string; // uuid v4
  name: string;
  grammy: boolean;
}
