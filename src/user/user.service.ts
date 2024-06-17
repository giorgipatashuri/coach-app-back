import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Role } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { hash } from 'argon2';
import { registerDto } from 'src/auth/dto/register.dto';
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(id: number) {
    return await this.prisma.user.findFirst({ where: { id } });
  }

  async getUserByEmail(email: string) {
    return await this.prisma.user.findFirst({
      where: { email },
    });
  }
  async createUser(dto: registerDto) {
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
