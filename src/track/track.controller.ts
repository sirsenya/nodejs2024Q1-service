import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ITrack, Track } from './entities/track.entity';
import { ActiveUser } from 'src/auth/decorators/auth.decorator';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  async create(@Body() createTrackDto: CreateTrackDto): Promise<ITrack> {
    const track: Track = await this.trackService.create(createTrackDto);
    return track.params;
  }

  @Get()
  async findAll(@ActiveUser() user: ActiveUserData): Promise<ITrack[]> {
    const tracks: Track[] = await this.trackService.findAll();
    return tracks.map((track) => track.params);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<ITrack> {
    const track: Track = await this.trackService.findOne(id);
    return track.params;
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ): Promise<ITrack> {
    const track: Track = await this.trackService.update(id, updateTrackDto);
    return track.params;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.trackService.remove(id);
  }
}
