import {
  Controller,
  Post,
  Get,
  Body,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body.email, body.password);
  }

  @Post('login')
  async login(@Body() body: any) {
    return this.authService.login(body.email, body.password);
  }

  @Post('logout')
  async logout(@Body() body: { userId: string }) {
    return this.authService.logout(body.userId);
  }

  @Get('validate')
  async validate(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid Authorization header',
      );
    }

    const token = authHeader.split(' ')[1];
    return this.authService.validate(token);
  }

  @Get('me')
  async getMe(@Headers('authorization') authHeader: string) {
    const validation = await this.validate(authHeader);

    return this.authService.getProfile(validation.user.sub);
  }

  @Post('topup')
  async topUpBalance(
    @Body() body: { amount: number },
    @Headers('authorization') authHeader: string
  ) {
    // 1. Reuse your existing validation to get the user ID!
    const validation = await this.validate(authHeader);
    const userId = validation.user.sub; // Assuming 'sub' holds the user ID in your JWT payload

    // 2. Delegate the database work to the AuthService
    return this.authService.topUp(userId, body.amount);
  }
}
