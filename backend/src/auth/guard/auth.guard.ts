import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from '../constants/jwt.constants';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  id: number;
  email: string;
  role: string;
  table: string;
}
declare module 'express' {
  interface Request {
    usuario?: JwtPayload;
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (this.configService.get<boolean>('DEV_BYPASS_AUTH') === true) {
      request.usuario = { id: 1, email: 'dev@localhost', role: 'cliente', table: 'usuario' };
      return true;
    }
    const cookieToken = this.extractTokenFromCookie(request);
    const headerToken = this.extractTokenFromHeader(request);
    const token = cookieToken ?? headerToken;
    if (!token) {
      throw new UnauthorizedException("Token no proporcionado");
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
    if (typeof payload !== 'object' || typeof payload.id !== 'number' || typeof payload.email !== 'string') {
      throw new UnauthorizedException('Token con estructura inválida');
    }

    request.usuario = payload;
    } catch (err) {
      throw new UnauthorizedException("Token inválido o expirado");
    }

    return true;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    return request.cookies?.['token'];
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}