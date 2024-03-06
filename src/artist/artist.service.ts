import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { artists } from 'src/db/in_memory_db';
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
      (artist: Artist) => artist.params.id === id,
    );
    if (!artist) throw new NotFoundException('Artist Not Found');
    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    let artist: Artist = this.findOne(id);
    artist.params = Object.assign(artist.params, updateArtistDto);
    return artist;
  }

  remove(id: string) {
    const index = artists.findIndex((artist) => artist.params.id === id);
    delete artists[index];
  }
}
