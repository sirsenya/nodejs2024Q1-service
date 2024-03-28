import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { v4 } from 'uuid';
import { Album } from './entities/album.entity';
import { Album as AlbumDb } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AlbumService {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}
  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const newAlbum: Album = new Album({
      id: v4(),
      artistId: null,
      ...createAlbumDto,
    });
    await this.prisma.album.create({ data: newAlbum.params });
    return newAlbum;
  }

  async findAll(): Promise<Album[]> {
    const albumsDb: AlbumDb[] = await this.prisma.album.findMany({});
    const albums: Album[] = albumsDb.map((userDb) => new Album(userDb));
    return albums;
  }

  async findOne(id: string): Promise<Album> {
    const albumDb: AlbumDb | null = await this.prisma.album.findUnique({
      where: {
        id: id,
      },
    });
    if (!albumDb) throw new NotFoundException('Album Not Found');
    return new Album(albumDb);
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const album: Album = await this.findOne(id);
    album.params = { ...album.params, ...updateAlbumDto };
    await this.prisma.album.update({
      where: { id },
      data: album.params,
    });
    return album;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.album.delete({ where: { id } });
  }
}
