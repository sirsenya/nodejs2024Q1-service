import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { favs, tracks } from 'db/in_memory_db';
import { v4 } from 'uuid';
import { Track } from './entities/track.entity';

@Injectable()
export class TrackService {
  create(createTrackDto: CreateTrackDto) {
    const newTrack: Track = new Track({
      id: v4(),
      albumId: null,
      artistId: null,
      ...createTrackDto,
    });
    tracks.push(newTrack);
    return newTrack;
  }

  findAll() {
    return tracks;
  }

  findOne(id: string) {
    const track: Track = tracks.find(
      (track: Track) => track?.params?.id === id,
    );
    if (!track) throw new NotFoundException('Track Not Found');
    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const track: Track = this.findOne(id);
    track.params = { ...track.params, ...updateTrackDto };
    return track;
  }

  remove(id: string) {
    const index: number = tracks.findIndex((track) => track?.params?.id === id);
    if (index < 0) throw new NotFoundException('Track Not Found');
    tracks.splice(index, 1);

    const favsArr: string[] = favs.params.tracks;
    const favsIndex = favsArr.findIndex((trackId) => trackId === id);
    if (favsIndex >= 0) {
      favsArr.splice(favsIndex, 1);
    }
  }
}
