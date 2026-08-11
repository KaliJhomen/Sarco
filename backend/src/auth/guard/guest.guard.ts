import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from '../constants/jwt.constants';

@Injectable()
export class GuestGuard implements CanActivate {

  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request = context.switchToHttp().getRequest<Request>();

    const cookieToken = request.cookies?.['token'];
    const [type, headerToken] = request.headers.authorization?.split(' ') ?? [];

    const token = cookieToken ?? (type === 'Bearer' ? headerToken : undefined);

    if (!token) {
      return true;
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      request.usuario = payload;

    } catch {
    }

    return true;
  }
}