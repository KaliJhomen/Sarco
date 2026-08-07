import { Controller, Get, Post, Body, UseGuards, Request, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './guard/auth.guard';
import type { Response } from 'express';

import { UsuarioService } from '../usuario/usuario.service';

import { CarritoService } from '../carrito/carrito.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsuarioService,
    private readonly carritoService: CarritoService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiBody({ type: LoginDto })
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const { token, user } = await this.authService.login(body);
    const userDB = await this.userService.findOne(user.idUsuario);
    
    if (body.sessionToken) {
      await this.carritoService.mergeGuestCart(user.idUsuario, body.sessionToken);
    }

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
      maxAge: 60 * 1000 * 60,
    });

    return res.json({
      token,
      user: {
        id: userDB.idUsuario,
        name: userDB.nombre,
        email: userDB.email,
      },
    });
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
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
  async profile(@Request() req: any) {
    const userId = req.user?.id;
    if (!userId) return {};

    const user = await this.userService.findOne(userId);
    return {
      user: {
        id: user.idUsuario,
        name: user.nombre,
        email: user.email,
      },
    };
  }
}
