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
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album, IAlbum } from './entities/album.entity';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  async create(@Body() createAlbumDto: CreateAlbumDto): Promise<IAlbum> {
    const album: Album = await this.albumService.create(createAlbumDto);
    return album.params;
  }

  @Get()
  async findAll(): Promise<IAlbum[]> {
    const albums: Album[] = await this.albumService.findAll();
    return albums.map((album) => album.params);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<IAlbum> {
    const album: Album = await this.albumService.findOne(id);
    return album.params;
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ): Promise<IAlbum> {
    const album: Album = await this.albumService.update(id, updateAlbumDto);
    return album.params;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.albumService.remove(id);
  }
}
