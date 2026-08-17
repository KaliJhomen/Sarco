import { Controller, Get, Post, Body, UseGuards, Request, Res, UnauthorizedException, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { JwtPayload } from './guard/jwt-payload';
import { AuthGuard } from './guard/auth.guard'
import { Throttle } from '@nestjs/throttler'
import type { Response } from 'express';

import { ClienteService } from '../cliente/cliente.service';
import { CarritoService } from '../carrito/carrito.service';
import { FavoritosService } from '../favoritos/favoritos.service';
import { ConfigService } from '@nestjs/config'

import { DataSource } from 'typeorm';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly clienteService: ClienteService,
    private readonly carritoService: CarritoService,
    private readonly favoritosService: FavoritosService,
    private readonly configService: ConfigService, 
    private readonly dataSource: DataSource,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiBody({ type: LoginDto })
  @Throttle({ default: { limit: 5, ttl: 60000 } }) 
  async login(@Body() body: LoginDto, @Res({passthrough: true}) res: Response) {
    const { token, cliente } = await this.authService.login(body);
    if (body.sessionToken) {
        const sessionToken: string =body.sessionToken;
        await this.carritoService.mergeGuestCart(cliente.id, sessionToken);
        await this.favoritosService.mergeGuestFavorites(cliente.id, sessionToken);
      };
    
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
      path: '/',
      maxAge: 30 * 60 * 1000,
    });
    return{ 
      token,
      cliente
    };
  }

  @Post('refresh')
  async refresh(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const cookieToken = req.cookies?.['token'];
    const headerToken = req.headers.authorization?.split(' ')[1];
    const token = cookieToken ?? headerToken; 
    if (!token) throw new UnauthorizedException();
    
    const payload = await this.authService.verifyToken(token, {ignoreExpiration: true});
    const newToken = await this.authService.signToken(payload);
    res.cookie('token', newToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      path: '/',
      maxAge: 30 * 60 * 1000,
    });    
    return {token: newToken, cliente: payload}; 
  }
  @Post('logout')
  async logout(@Res() res: Response) {
  const isProduction = this.configService.get<string>('NODE_ENV') === 'production';    
  res.clearCookie('token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
    });
    return res.json({ message: 'Sesión cerrada' });
  }

  @Post('register')
  @ApiOperation({ summary: 'Registrar nuevo cliente' })
  @ApiBody({ type: RegisterDto })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Perfil del cliente' })
  async profile(@Request() req: { cliente?: JwtPayload }) {
    const { id, table } = req.cliente ?? {};
    if (!id) {
      return { cliente: null };
    }
    const u = await this.clienteService.findOne(id);
    return { cliente: { id: u.idCliente, name: u.nombre, email: u.email, table: 'cliente' } };
  }
}