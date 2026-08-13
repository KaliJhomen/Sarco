import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './jwt-payload';
declare module 'express' {
  interface Request {
    cliente?: JwtPayload;
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
    const cookieToken = this.extractTokenFromCookie(request);
    const headerToken = this.extractTokenFromHeader(request);
    const token = cookieToken ?? headerToken;
    const bypass = this.configService.get<boolean>('DEV_BYPASS_AUTH') === true;

    // Opción B: bypass solo si NO hay token 
    if (bypass && !token) {
      request.cliente = { id: 1, email: "dev@development.com", table: "cliente"};
      return true;
    }
    if (!token) throw new UnauthorizedException("Token no proporcionado");

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET')!,      
      });
    if (typeof payload !== 'object' || typeof payload.id !== 'number' || typeof payload.email !== 'string' || payload.table !== 'cliente') {
      throw new UnauthorizedException('Token con estructura inválida');
    }

    request.cliente = payload;
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