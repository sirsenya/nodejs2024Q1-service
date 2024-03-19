import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { v4 } from 'uuid';
import { PrismaService } from 'src/database/prisma.service';
import { Artist as ArtistDb } from '@prisma/client';

@Injectable()
export class ArtistService {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}
  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const newArtist: Artist = new Artist({
      id: v4(),
      ...createArtistDto,
    });
    await this.prisma.artist.create({ data: newArtist.params });
    return newArtist;
  }

  async findAll(): Promise<Artist[]> {
    const artistsDb: ArtistDb[] = await this.prisma.artist.findMany({});
    const artists: Artist[] = artistsDb.map((artistDb) => new Artist(artistDb));
    return artists;
  }

  async findOne(id: string): Promise<Artist> {
    const artistDb: ArtistDb | null = await this.prisma.artist.findUnique({
      where: { id },
    });
    if (!artistDb) throw new NotFoundException('Artist Not Found');
    return new Artist(artistDb);
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const artist: Artist = await this.findOne(id);
    artist.params = { ...artist.params, ...updateArtistDto };
    await this.prisma.artist.update({
      where: { id },
      data: artist.params,
    });
    return artist;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.artist.delete({ where: { id } });
  }
}
