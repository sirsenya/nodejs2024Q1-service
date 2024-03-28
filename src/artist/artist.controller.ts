import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  Put,
  HttpCode,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist, IArtist } from './entities/artist.entity';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  async create(@Body() createArtistDto: CreateArtistDto): Promise<IArtist> {
    const artist: Artist = await this.artistService.create(createArtistDto);
    return artist.params;
  }

  @Get()
  async findAll(): Promise<IArtist[]> {
    const artists: Artist[] = await this.artistService.findAll();
    return artists.map((artist) => artist.params);
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<IArtist> {
    const artist: Artist = await this.artistService.findOne(id);
    return artist.params;
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ): Promise<IArtist> {
    const artist: Artist = await this.artistService.update(id, updateArtistDto);
    return artist.params;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.artistService.remove(id);
  }
}
