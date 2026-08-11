import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(ctx: ExecutionContext) {
    const required = this.reflector.get<string[]>('roles', ctx.getHandler());
    if (!required) return true;
    const req = ctx.switchToHttp().getRequest();
    const user = req.usuario || {};
    const userRole = (user.role || '').toString().toLowerCase();
    const requiredNormalized = required.map(r => r.toLowerCase());
    return !!user && requiredNormalized.includes(userRole);
  }
}