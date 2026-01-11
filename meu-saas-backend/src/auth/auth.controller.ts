import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

class LoginDto {
  username: string;
  password: string;
  loginType?: 'encarregado' | 'funcionario' | 'direto';
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(
      loginDto.username,
      loginDto.password,
      loginDto.loginType,
    );
  }

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  async validateUser(@Body('userId') userId: string) {
    return this.authService.validateUser(userId);
  }
}
