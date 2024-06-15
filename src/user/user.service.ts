import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { Role } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { hash } from 'argon2';
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async getUserByEmail(email: string) {
    return await this.prisma.user.findFirst({
      where: { email },
    });
  }
  async createUser(dto: CreateUserDto) {
    return await this.prisma.user.create({
      data: {
        ...dto,
        password: await hash(dto.password),
        photoUrl: faker.image.avatar(),
        role: Role.PLAYER,
      },
    });
  }
}
