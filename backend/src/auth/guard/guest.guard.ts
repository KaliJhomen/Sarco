import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, GuestPayload, IdentityPayload } from './jwt-payload'
declare module 'express' {
  interface Request {
    cliente?: IdentityPayload;
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
    const headerToken = request.headers.authorization?.split(' ') [1];
    const token = cookieToken ?? headerToken;

    const bypass = this.configService.get<boolean>('DEV_BYPASS_AUTH') === true;

    // BYPASS DEVELOPMENT
    if (bypass && !token) {
      request.cliente = { id: 1, email: "dev@development.com", table: "cliente"};      
      return true;
    }

    // Invitado sin token: pasa, req.cliente queda undefined
    if (token) {
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get<string>('JWT_SECRET')!,
        });
        if (this.isValidPayload(payload)) {
          request.cliente = { 
            id: payload.id, 
            email: payload.email, 
            table: 'cliente'  // forzar table
          };
        } else {
          request.cliente = undefined;
        }
      } catch {
        request.cliente = undefined;
      }
      return true;
    }
    const sessionToken = request.query?.sessionToken;
    if (sessionToken && typeof sessionToken === 'string') {
      request.cliente = { sessionToken };
    } else {
      request.cliente = undefined;
    }

    return true;
  }
  private isValidPayload(payload: any): payload is JwtPayload {
    return (
      typeof payload === 'object' &&
      typeof payload.id === 'number' &&
      typeof payload.email === 'string' &&
      typeof payload.table === 'string'
    );
  }
}