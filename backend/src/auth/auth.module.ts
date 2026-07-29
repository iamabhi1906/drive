import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { TokenService } from './token.service';
import { CookieService } from './cookie.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { EmailVerificationModule } from '../email-verification/email-verification.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
      }),
    }),
    UsersModule,
    EmailVerificationModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, CookieService, JwtAuthGuard],
  exports: [JwtModule, JwtAuthGuard],
})
export class AuthModule {}
