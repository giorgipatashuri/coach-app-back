import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { authDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import { verify } from 'argon2';
import { registerDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: registerDto) {
    const oldUser = await this.userService.getUserByEmail(dto.email);

    if (oldUser) throw new BadRequestException('User already exists');

    const user = await this.userService.createUser(dto);

    const data = { id: user.id, role: user.role };

    const token = await this.jwt.sign(data, {
      expiresIn: '7d',
    });

    return {
      user: this.returnUserFields(user),
      token,
    };
  }
  async login(dto: authDto) {
    const user = await this.validateUser(dto);

    const data = { id: user.id, role: user.role };

    const token = await this.jwt.sign(data, {
      expiresIn: '7d',
    });

    return {
      user: this.returnUserFields(user),
      token,
    };
  }

  private async validateUser(dto: authDto) {
    const user = await this.userService.getUserByEmail(dto.email);

    if (!user) throw new NotFoundException('User not found');

    const isValid = await verify(user.password, dto.password);

    if (!isValid) throw new UnauthorizedException('Invalid password or email');

    return user;
  }

  private returnUserFields(user: User) {
    return {
      id: user.id,
      email: user.email,
    };
  }
}
