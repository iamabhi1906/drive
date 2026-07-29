import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDTO } from './dto/signup.dto';
import { LoginDTO } from './dto/login.dto';
import { type Response, type Request } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';
import { type AuthenticatedRequest } from './interfaces/authenticated-request.interface';
import { CookieService } from './cookie.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDTO) {
    const user = await this.authService.signup(signupDto);
    return {
      status: 'success',
      message: 'User registered successfully',
      user,
    };
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() loginDto: LoginDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, tokens } = await this.authService.login(loginDto);
    this.cookieService.setAuthCookies(
      response,
      tokens.accessToken,
      tokens.refreshToken,
    );
    return {
      status: 'success',
      message: 'User logged in successfully',
      user,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() request: AuthenticatedRequest) {
    return this.authService.getMe(request.user.sub);
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const cookies = request.cookies as Record<string, unknown>;
    const refreshToken = cookies.refresh_token;
    if (typeof refreshToken !== 'string') {
      throw new UnauthorizedException('Refresh token required');
    }
    const token = await this.authService.refreshAccessToken(refreshToken);
    this.cookieService.setAccessToken(response, token.accessToken);
    return {
      message: 'Access token refreshed successfully',
    };
  }

  @Post('logout')
  @HttpCode(204)
  logout(@Res({ passthrough: true }) response: Response) {
    this.cookieService.clearAuthCookies(response);
    return {
      message: 'Logout successful',
    };
  }
}
