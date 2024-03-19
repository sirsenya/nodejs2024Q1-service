import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { albums, artists, favs, tracks } from 'db/in_memory_db';
import { FavorableEntity } from 'src/entity';
import { IFavorites, IFavoritesResponse } from './entities/fav.entity';

const ALBUM = 'album';
const TRACK = 'track';
const ARTIST = 'artist';

const favsEntities: iFavEntity[] = [
  { address: ALBUM, array: albums },
  { address: TRACK, array: tracks },
  { address: ARTIST, array: artists },
];

interface iFavEntity {
  address: string;
  array: FavorableEntity[];
}

@Injectable()
export class FavsService {
  findAll() {
    const favsClone: IFavorites = Object.assign({}, favs.params);
    const response: IFavoritesResponse = {
      artists: [],
      albums: [],
      tracks: [],
    };

    for (let i = 0; i < favsEntities.length; i++) {
      const favEntity: iFavEntity = favsEntities[i];
      const objectKey = `${favEntity.address}s`;
      const value: string[] = favsClone[objectKey];
      response[objectKey] = value.map(
        (id: string) =>
          favEntity.array.find(
            (entity: FavorableEntity) => entity.params.id === id,
          ).params,
      );
    }
    return response;
  }

  addFavs(id: string, entityAddress: string) {
    const favEntity: iFavEntity | undefined = favsEntities.find(
      (value: iFavEntity) => value.address === entityAddress,
    );
    if (!favEntity)
      throw new BadRequestException(`route ${entityAddress} doesn't exist`);
    const entityArray: FavorableEntity[] = favEntity.array;
    const entity: FavorableEntity = entityArray.find(
      (entity) => entity.params.id === id,
    );

    if (!entity) {
      throw new HttpException(
        `${entityAddress} with ${id} not found in ${entityAddress}s' db`,
        422,
      );
    }
    const arrayKey = `${entityAddress}s`;
    const favArray: string[] = favs.params[arrayKey];
    const alreadyInFavs: boolean = favArray.includes(id);
    if (alreadyInFavs)
      throw new HttpException(`This ${entityAddress} is already in favs`, 409);

    favs.params[arrayKey].push(id);
    return `${entityAddress} added to the favs`;
  }

  deleteFavs(id: string, entityAddress: string) {
    const favEntity: iFavEntity | undefined = favsEntities.find(
      (value: iFavEntity) => value.address === entityAddress,
    );
    if (!favEntity)
      throw new BadRequestException(`route ${entityAddress} doesn't exist`);

    const favArray: string[] = favs.params[`${entityAddress}s`];

    const index: number = favArray.findIndex(
      (entityId: string) => entityId === id,
    );

    if (index < 0) {
      throw new NotFoundException(
        `${entityAddress} with ${id} not found in favs`,
      );
    }
    favArray.splice(index, 1);
  }
}
