import { Controller, Get, Post, Body, UseGuards, Request, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './guard/auth.guard';
import {Throttle} from '@nestjs/throttler'
import type { Response } from 'express';

import { UsuarioService } from '../usuario/usuario.service';

import { CarritoService } from '../carrito/carrito.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usuarioService: UsuarioService,
    private readonly carritoService: CarritoService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiBody({ type: LoginDto })
  @Throttle({ default: { limit: 5, ttl: 60000 } }) 
  async login(@Body() body: LoginDto, @Res({passthrough: true}) res: Response) {
    const { token, usuario } = await this.authService.login(body);
    if (body.sessionToken) {
      await this.carritoService.mergeGuestCart(usuario.idUsuario, body.sessionToken);
    }
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
      path: '/',
      maxAge: 30 * 60 * 1000,
    });
    return {
      token,
      user: {
        id: usuario.idUsuario,
        name: usuario.nombre,
        email: usuario.email,
      },
    };
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie('token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
    });
    return res.json({ message: 'Sesión cerrada' });
  }

  @Post('register')
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiBody({ type: RegisterDto })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Perfil del usuario' })
  async profile(@Request() req: { usuario?: { id: number } }) {
    const idUsuario = req.usuario?.id;
    if (!idUsuario) {
      return { user: null };
    }

    const usuario = await this.usuarioService.findOne(idUsuario);
    return {
      user: {
        id: usuario.idUsuario,
        name: usuario.nombre,
        email: usuario.email,
      },
    };
  }
}
