import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { albums } from 'src/db/in_memory_db';
import { v4 } from 'uuid';
import { Album } from './entities/album.entity';

@Injectable()
export class AlbumService {
  create(createAlbumDto: CreateAlbumDto) {
    const newAlbum: Album = new Album({
      id: v4(),
      artistId: null,
      ...createAlbumDto,
    });
    albums.push(newAlbum);
    return newAlbum;
  }

  findAll() {
    return albums;
  }

  findOne(id: string) {
    const album: Album = albums.find(
      (album: Album) => album?.params?.id === id,
    );
    if (!album) throw new NotFoundException('Album Not Found');
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    let album: Album = this.findOne(id);
    album.params = { ...album.params, ...updateAlbumDto };
    return album;
  }

  remove(id: string) {
    const index = albums.findIndex((album) => album?.params?.id === id);
    if (index < 0) throw new NotFoundException('Album Not Found');
    albums.splice(index, 1);
  }
}
