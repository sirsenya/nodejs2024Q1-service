import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { v4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/database/prisma.service';
import { User as UserDb } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const now = Date.now();
    const newUser: User = new User({
      id: v4(),
      ...createUserDto,
      updatedAt: now,
      createdAt: now,
      version: 1,
    });
    await this.prisma.user.create({
      data: {
        ...newUser.params,
        updatedAt: BigInt(newUser.params.updatedAt),
        createdAt: BigInt(newUser.params.createdAt),
      },
    });
    return newUser;
  }

  async findAll(): Promise<User[]> {
    const usersDb: UserDb[] = await this.prisma.user.findMany({});
    const users: User[] = usersDb.map(
      (userDb) =>
        new User({
          ...userDb,
          updatedAt: Number(userDb.updatedAt),
          createdAt: Number(userDb.createdAt),
        }),
    );
    return users;
  }

  async findOne(id: string): Promise<User> {
    const userDb: UserDb | null = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!userDb) throw new NotFoundException('User not found');
    return new User({
      ...userDb,
      updatedAt: Number(userDb.updatedAt),
      createdAt: Number(userDb.createdAt),
    });
  }

  async update(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    const user: User = await this.findOne(id);
    if (user.params.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Wrong password');
    }
    user.params.password = updatePasswordDto.newPassword;
    user.params.version++;
    user.params.updatedAt = Date.now();
    await this.prisma.user.update({
      where: { id },
      data: {
        ...user.params,
        updatedAt: BigInt(user.params.updatedAt),
        createdAt: BigInt(user.params.createdAt),
      },
    });
    return user;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.user.delete({ where: { id } });
  }
}
