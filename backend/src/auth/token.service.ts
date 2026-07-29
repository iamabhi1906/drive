import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateTokens(userId: number) {
    const payload = { sub: userId };

    const accessExpiresIn = this.configService.getOrThrow<
      JwtSignOptions['expiresIn']
    >('JWT_ACCESS_EXPIRES_IN');

    const refreshExpiresIn = this.configService.getOrThrow<
      JwtSignOptions['expiresIn']
    >('JWT_REFRESH_EXPIRES_IN');

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: accessExpiresIn,
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: refreshExpiresIn,
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
