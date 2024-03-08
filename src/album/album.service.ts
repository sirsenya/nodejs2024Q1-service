import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { albums, favs, tracks } from 'src/db/in_memory_db';
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
    const album: Album = this.findOne(id);
    album.params = { ...album.params, ...updateAlbumDto };
    return album;
  }

  remove(id: string) {
    const index = albums.findIndex((album) => album?.params?.id === id);
    if (index < 0) throw new NotFoundException('Album Not Found');
    albums.splice(index, 1);

    const favsArr: string[] = favs.params.albums;
    const favsIndex = favsArr.findIndex((albumId) => albumId === id);
    if (favsIndex >= 0) {
      favsArr.splice(favsIndex, 1);
    }

    tracks.forEach((track) => {
      if (track.params.albumId === id) {
        track.params.albumId = null;
      }
    });
  }
}
