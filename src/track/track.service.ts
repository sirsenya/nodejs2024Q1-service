import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { v4 } from 'uuid';
import { Track } from './entities/track.entity';
import { Track as TrackDb } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class TrackService {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}
  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const newTrack: Track = new Track({
      id: v4(),
      albumId: null,
      artistId: null,
      ...createTrackDto,
    });
    await this.prisma.track.create({
      data: newTrack.params,
    });
    return newTrack;
  }

  async findAll(): Promise<Track[]> {
    const tracksDb: TrackDb[] = await this.prisma.track.findMany({});
    const tracks: Track[] = tracksDb.map((userDb) => new Track(userDb));
    return tracks;
  }

  async findOne(id: string): Promise<Track> {
    const trackDb: TrackDb | null = await this.prisma.track.findUnique({
      where: {
        id: id,
      },
    });
    if (!trackDb) throw new NotFoundException('Track not found');
    return new Track(trackDb);
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    const track: Track = await this.findOne(id);
    track.params = { ...track.params, ...updateTrackDto };
    await this.prisma.track.update({
      where: { id },
      data: track.params,
    });
    return track;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.track.delete({ where: { id } });
  }
}
