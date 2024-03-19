import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { FavsService } from './favs.service';

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Get()
  findAll() {
    return this.favsService.findAll();
  }
  @Post(':entity/:id')
  addFavs(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('entity') entity: string,
  ) {
    return this.favsService.addFavs(id, entity);
  }

  @Delete(':entity/:id')
  @HttpCode(204)
  deleteFavs(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('entity') entity: string,
  ) {
    return this.favsService.deleteFavs(id, entity);
  }
}
