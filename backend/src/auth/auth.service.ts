/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { SignupDTO } from './dto/signup.dto';
import { User } from '../users/entities/user.entity';
import { LoginDTO } from './dto/login.dto';
import { TokenService } from './token.service';
import bcrypt from 'bcrypt';
import { EmailVerificationService } from '../email-verification/email-verification.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  async signup(signupDto: SignupDTO): Promise<User> {
    const { email } = signupDto;
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const hashedPassword = await bcrypt.hash(signupDto.password, 10);
    const newUser = await this.usersService.create({
      ...signupDto,
      password: hashedPassword,
    });
    await this.emailVerificationService.sendVerificationOtp({
      email: newUser.email,
    });
    return newUser;
  }

  async login(loginDto: LoginDTO) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    if (!user.isVerified) {
      throw new ForbiddenException('Email not verified');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const tokens = await this.tokenService.generateTokens(user.id);
    return {
      user,
      tokens,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload =
        await this.jwtService.verifyAsync<JwtPayload>(refreshToken);
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User no longer exists');
      }
      const token = this.tokenService.generateTokens(user.id);
      return token;
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async getMe(userId: string): Promise<User> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
