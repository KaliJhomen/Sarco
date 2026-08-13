import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './jwt-payload'
declare module 'express' {
  interface Request {
    cliente?: JwtPayload;
  }
}
@Injectable()
export class GuestGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const cookieToken = request.cookies?.['token'];
    const [type, headerToken] = request.headers.authorization?.split(' ') ?? [];
    const token = cookieToken ?? (type === 'Bearer' ? headerToken : undefined);

    const bypass = this.configService.get<boolean>('DEV_BYPASS_AUTH') === true;

    // Opción B: bypass solo si NO hay token (respeta login real)
    if (bypass && !token) {
      request.cliente = { id: 1, email: "dev@development.com", table: "cliente"};      
      return true;
    }

    // Invitado sin token: pasa, req.cliente queda undefined
    if (!token) return true;

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET')!,   
      });
      if (
        typeof payload !== 'object' ||
        typeof payload.id !== 'number' ||
        typeof payload.email !== 'string' ||
        typeof payload.table !== 'string'
      ) {
        throw new UnauthorizedException('Token con estructura inválida');
      }
      request.cliente = payload;
    } catch {
      // Token inválido en ruta guest: tratar como invitado, NO setear usuario
      request.cliente = undefined;
    }

    return true;
  }
}