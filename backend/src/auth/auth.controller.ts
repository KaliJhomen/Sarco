import { Controller, Get, Post, Body, UseGuards, Request, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './guard/auth.guard';
import type { Response } from 'express';
import express from 'express';
import { UserService } from 'src/user/user.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login usuario (tabla user)' })
  @ApiBody({ type: LoginDto })
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const { token, user } = await this.authService.login(body);

    // Obtener el usuario completo con relaciones
    const usuarioCompleto = await this.userService.findOne(user.id);

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
      maxAge: 60 * 1000 * 60,
    });

    // Devuelve el usuario completo
    return res.json({ user: usuarioCompleto });
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    });
    return res.json({ message: 'Logout successful' });
  }

  @Post('register')
  @ApiOperation({ summary: 'Registrar nuevo usuario (users table)' })
  @ApiBody({ type: RegisterDto })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Perfil del usuario (requiere auth)' })
  async profile(@Request() req) {
    const userId = req.user?.sub;
    if (!userId) return {};

    const usuario = await this.userService.findOne(userId);

    // Devuelve toda la información del usuario, incluyendo las relaciones completas
    const safe = {
      id: usuario.idUser,
      nombre: usuario.nombre,
      email: usuario.email,
      clave: usuario.clave,
      rol: usuario.rol,
      carrito: usuario.carrito,
      favoritos: usuario.favoritos,
      /*
      login: usuario.login,
      direccion: usuario.direccion,
      telefono: usuario.telefono,
      imagen: usuario.imagen,
      role: usuario.idCargo2?.nombre || null,
      cargo: usuario.idCargo2 
      tienda: usuario.idTienda2 || null, 
      */  
    };

    return safe;
  }
}
