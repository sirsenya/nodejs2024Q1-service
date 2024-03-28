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
import { IUser, User } from './entities/user.entity';
// import { Auth } from 'src/auth/decorators/auth.decorator';
// import { AuthType } from 'src/auth/enums/auth-type.enum';

// @Auth(AuthType.None)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Omit<IUser, 'password'>> {
    const user: User = await this.userService.create(createUserDto);
    return user.hidePassword();
  }

  @Get()
  async findAll(): Promise<Omit<IUser, 'password'>[]> {
    const users: User[] = await this.userService.findAll();
    return users.map((user) => user.hidePassword());
  }
  //sds

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Omit<IUser, 'password'>> {
    const user: User = await this.userService.findOne(id);
    return user.hidePassword();
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<Omit<IUser, 'password'>> {
    const user: User = await this.userService.update(id, updatePasswordDto);
    return user.hidePassword();
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.userService.remove(id);
  }
}
