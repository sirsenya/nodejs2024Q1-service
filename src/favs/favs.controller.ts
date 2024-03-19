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
  async findAll() {
    return await this.favsService.findAll();
  }
  @Post(':entity/:id')
  async addFavs(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('entity') entity: string,
  ) {
    return await this.favsService.addFavs(id, entity);
  }

  @Delete(':entity/:id')
  @HttpCode(204)
  async deleteFavs(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('entity') entity: string,
  ) {
    return await this.favsService.deleteFavs(id, entity);
  }
}
