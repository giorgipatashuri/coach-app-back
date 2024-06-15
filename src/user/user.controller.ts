import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('create')
  async createUser(@Body() dto: CreateUserDto) {
    let userExists = await this.userService.getUserByEmail(dto.email);
    if (userExists)
      throw new HttpException(
        'User with this email/username already exists',
        HttpStatus.CONFLICT,
      );
    return this.userService.createUser(dto)
  }
}
