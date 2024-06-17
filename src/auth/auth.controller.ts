import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { authDto } from './dto/auth.dto';
import { registerDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('register')
  register(@Body() dto: registerDto) {
    return this.authService.register(dto);
  }
  @HttpCode(200)
  @Post('login')
  login(@Body() dto: authDto) {
    return this.authService.login(dto);
  }
}
