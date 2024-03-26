import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
  Album as AlbumDb,
  Artist as ArtistDb,
  Favs,
  PrismaPromise,
  Track as TrackDb,
} from '@prisma/client';
import { IFavoritesResponse } from './entities/fav.entity';
import { Album } from 'src/album/entities/album.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Track } from 'src/track/entities/track.entity';

const ALBUM = 'album';
const TRACK = 'track';
const ARTIST = 'artist';

type PrismaFavorableEntity = AlbumDb | ArtistDb | TrackDb;

interface iFavEntity {
  address: string;
  array: PrismaPromise<PrismaFavorableEntity[]>;
}

@Injectable()
export class FavsService {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  private favsEntities: iFavEntity[] = [
    {
      address: ALBUM,
      array: this.prisma.album.findMany({}),
    },
    { address: TRACK, array: this.prisma.track.findMany({}) },
    { address: ARTIST, array: this.prisma.artist.findMany({}) },
  ];

  async findAll(): Promise<IFavoritesResponse> {
    const favs = await this.prisma.favs.findFirst({
      include: { albums: true, artists: true, tracks: true },
    });

    const response: IFavoritesResponse = {
      albums: !favs?.albums
        ? []
        : favs.albums.map((album) => {
            album.favsId = undefined;
            return new Album(album).params;
          }),
      artists: !favs?.artists
        ? []
        : favs.artists.map((artist) => {
            artist.favsId = undefined;
            return new Artist(artist).params;
          }),
      tracks: !favs?.tracks
        ? []
        : favs.tracks.map((track) => {
            track.favsId = undefined;
            return new Track(track).params;
          }),
    };
    return response;
  }

  async addFavs(id: string, entityAddress: string) {
    const favEntity: iFavEntity | undefined = this.favsEntities.find(
      (value: iFavEntity) => value.address === entityAddress,
    );
    if (!favEntity)
      throw new BadRequestException(`route ${entityAddress} doesn't exist`);
    const arrayKey = `${entityAddress}s`;

    const entityArray: PrismaFavorableEntity[] = await this.prisma[
      entityAddress
    ].findMany({ include: {} });

    const entity = entityArray.find(
      (entity: PrismaFavorableEntity) => entity.id === id,
    );

    if (!entity) {
      throw new HttpException(
        `${entityAddress} with ${id} not found in ${arrayKey}' db`,
        422,
      );
    }

    const allFavs: Favs = await this.prisma.favs.findFirst({
      include: { albums: true, artists: true, tracks: true },
    });

    const alreadyInFavs: boolean = allFavs[arrayKey]
      .map((entity: PrismaFavorableEntity) => entity.id)
      .includes(id);
    if (alreadyInFavs)
      throw new HttpException(`This ${entityAddress} is already in favs`, 409);

    await this.prisma.favs.update({
      where: { id: allFavs.id },
      data: {
        [arrayKey]: {
          connect: {
            id,
          },
        },
      },
    });

    return `${entityAddress} added to the favs`;
  }

  async deleteFavs(id: string, entityAddress: string) {
    const favEntity: iFavEntity | undefined = this.favsEntities.find(
      (value: iFavEntity) => value.address === entityAddress,
    );
    if (!favEntity)
      throw new BadRequestException(`route ${entityAddress} doesn't exist`);

    const allFavs: Favs = await this.prisma.favs.findFirst({
      include: { albums: true, artists: true, tracks: true },
    });
    const arrayKey = `${entityAddress}s`;
    const entity = allFavs[arrayKey].find(
      (entity: PrismaFavorableEntity) => entity.id === id,
    );

    if (!entity) {
      throw new NotFoundException(
        `${entityAddress} with ${id} not found in favs`,
      );
    }

    await this.prisma.favs.update({
      where: { id: allFavs.id },
      data: {
        [arrayKey]: {
          disconnect: { id },
        },
      },
    });
  }
}
