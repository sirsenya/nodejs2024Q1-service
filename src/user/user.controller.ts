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
import { UserService } from './user.service';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto).hidePassword();
  }

  @Get()
  findAll() {
    return this.userService.findAll().map((user) => user.hidePassword());
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.findOne(id).hidePassword();
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.userService.update(id, updatePasswordDto).hidePassword();
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.remove(id);
  }
}
