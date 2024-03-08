import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { albums, artists, favs, tracks } from 'src/db/in_memory_db';
import { Artist } from './entities/artist.entity';
import { v4 } from 'uuid';

@Injectable()
export class ArtistService {
  create(createArtistDto: CreateArtistDto) {
    const newArtist: Artist = new Artist({
      id: v4(),
      ...createArtistDto,
    });
    artists.push(newArtist);
    return newArtist;
  }

  findAll() {
    return artists;
  }

  findOne(id: string) {
    const artist: Artist = artists.find(
      (artist: Artist) => artist?.params?.id === id,
    );
    if (!artist) throw new NotFoundException('Artist Not Found');
    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist: Artist = this.findOne(id);
    artist.params = { ...artist.params, ...updateArtistDto };
    return artist;
  }

  remove(id: string) {
    const index = artists.findIndex((artist) => artist?.params?.id === id);
    if (index < 0) throw new NotFoundException('Artist Not Found');
    artists.splice(index, 1);

    const favsArr: string[] = favs.params.artists;
    const favsIndex = favsArr.findIndex((artistId) => artistId === id);
    if (favsIndex >= 0) {
      favsArr.splice(favsIndex, 1);
    }

    tracks.forEach((track) => {
      if (track.params.artistId === id) {
        track.params.artistId = null;
      }
    });

    albums.forEach((album) => {
      if (album.params.artistId === id) {
        album.params.artistId = null;
      }
    });
  }
}
