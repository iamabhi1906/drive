import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const isMobileRequest = request.headers['x-requested-with'] as string;
    let token: string | undefined;
    if (isMobileRequest === 'mobile-app') {
      const authHeader = request.headers['authorization'];
      console.log(authHeader);
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      } else {
        throw new UnauthorizedException(
          'Authorization header with Bearer token is missing',
        );
      }
    } else {
      const cookies = request.cookies as Record<string, string | undefined>;
      token = cookies?.access_token;
    }
    if (!token) {
      throw new UnauthorizedException('Authentication required');
    }
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      request['user'] = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}
