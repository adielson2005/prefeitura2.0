import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

class LoginDto {
  username: string;
  password: string;
  loginType?: 'encarregado' | 'funcionario' | 'direto';
}

class ForgotPasswordDto {
  email: string;
}

class VerifyCodeDto {
  email: string;
  code: string;
}

class ResetPasswordDto {
  email: string;
  code: string;
  newPassword: string;
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

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.requestPasswordReset(forgotPasswordDto.email);
  }

  @Post('verify-code')
  @HttpCode(HttpStatus.OK)
  async verifyCode(@Body() verifyCodeDto: VerifyCodeDto) {
    return this.authService.verifyResetCode(
      verifyCodeDto.email,
      verifyCodeDto.code,
    );
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.email,
      resetPasswordDto.code,
      resetPasswordDto.newPassword,
    );
  }
}
