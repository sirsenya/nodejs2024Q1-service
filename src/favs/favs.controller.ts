import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FavsService } from './favs.service';
import { CreateFavDto } from './dto/create-fav.dto';
import { UpdateFavDto } from './dto/update-fav.dto';

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Get()
  findAll() {
    return this.favsService.findAll();
  }

  // @Post('album/:id')
  // addAlbum(@Param('id', new ParseUUIDPipe()) id: string) {
  //   return this.favsService.addAlbum(id);
  // }
  // @Post('artist/:id')
  // addArtist(@Param('id', new ParseUUIDPipe()) id: string) {
  //   return this.favsService.addArtist(id);
  // }
  @Post(':entity/:id')
  addFavs(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('entity') entity: string,
  ) {
    return this.favsService.addFavs(id, entity);
  }

  // @Delete('album/:id')
  // deleteAlbum(@Param('id', new ParseUUIDPipe()) id: string) {
  //   return this.favsService.deleteAlbum(id);
  // }
  // @Delete('artist/:id')
  // deleteArtist(@Param('id', new ParseUUIDPipe()) id: string) {
  //   return this.favsService.deleteArtist(id);
  // }
  @Delete(':entity/:id')
  deleteFavs(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('entity') entity: string,
  ) {
    return this.favsService.deleteFavs(id, entity);
  }
}
