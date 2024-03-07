import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { users } from 'src/db/in_memory_db';
import { User } from './entities/user.entity';
import { v4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto) {
    const now = Date.now();
    const newUser: User = new User({
      id: v4(),
      ...createUserDto,
      updatedAt: now,
      createdAt: now,
      version: 1,
    });
    users.push(newUser);
    return newUser;
  }

  findAll(): User[] {
    return users;
  }

  findOne(id: string): User {
    const user: User = users.find((user: User) => user?.params?.id === id);
    if (!user) throw new NotFoundException('User Not Found');
    return user;
  }

  update(id: string, updatePasswordDto: UpdatePasswordDto): User {
    const user: User = this.findOne(id);
    if (user.params.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Wrong password');
    }
    user.params.password = updatePasswordDto.newPassword;
    user.params.version++;
    user.params.updatedAt = Date.now();
    return user;
  }

  remove(id: string) {
    const index = users.findIndex((user) => user?.params?.id === id);
    if (index < 0) throw new NotFoundException('User Not Found');
    users.splice(index, 1);
  }
}
