import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { albums, artists, favs, tracks } from 'src/db/in_memory_db';
import { FavorableEntity } from 'src/entity';

const ALBUM: string = 'album';
const TRACK: string = 'track';
const ARTIST: string = 'artist';

@Injectable()
export class FavsService {
  // create(createFavDto: CreateFavDto) {
  //   return 'This action adds a new fav';
  // }

  findAll() {
    return favs;
  }

  addFavs(id: string, entityAddress: string) {
    const favEntity: iFavEntity | undefined = favsEntities.find(
      (value: iFavEntity) => value.address === entityAddress,
    );
    if (!favEntity) throw new BadRequestException();
    const array: FavorableEntity[] = favEntity.array;
    const entityExists: boolean = array
      .map((entity) => entity.params.id)
      .includes(id);

    if (!entityExists) {
      throw new NotFoundException(
        `${entityAddress} with ${id} not found in ${entityAddress}s' db`,
      );
    }
    const arrayKey: string = `${entityAddress}s`;
    favs.params[arrayKey].push(id);
    return favs;
  }

  deleteFavs(id: string, entity: string) {}
}

const favsEntities: iFavEntity[] = [
  { address: ALBUM, array: albums },
  { address: TRACK, array: tracks },
  { address: ARTIST, array: artists },
];

interface iFavEntity {
  address: string;
  array: FavorableEntity[];
}
