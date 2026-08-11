import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import {UsuarioService} from "../usuario/usuario.service";
import { RegisterDto } from './dto/register.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usuarioService: UsuarioService
  ) {}

  private mapUsuario(usuario: any) {
    return {
      idUsuario: usuario.idUsuario,
      nombre: usuario.nombre,
      email: usuario.email,
    };
  } 
  async login({ email, clave }: { email: string; clave: string }) {
    const usuario = await this.usuarioService.findOneByEmail(email);
    if (!usuario) throw new UnauthorizedException('Correo o Contraseña Incorrectass');

    const isValid = await bcryptjs.compare(clave, usuario.clave || '');
    if (!isValid) throw new UnauthorizedException('Correo |o Contraseña| Incorrectas');

    const payload = { id: usuario.idUsuario, email: usuario.email };
    const token = await this.jwtService.signAsync(payload);
    return {
      token,
      usuario: this.mapUsuario(usuario),
    };
  }

  async register({nombre, email, telefono, documento, clave }: RegisterDto) {
    const existing = await this.usuarioService.findOneByEmail(email);
    if (existing) {
      throw new BadRequestException('El email ya está registrado');
    }

    const hashed = await bcryptjs.hash(clave, 10);

    const nuevoUsuario = await this.usuarioService.create({
      login: email,
      nombre,
      email,
      telefono,
      documento,
      clave: hashed,
    });
    return {
      usuario: this.mapUsuario(nuevoUsuario),
    };
  }
}
