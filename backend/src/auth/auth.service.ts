import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../usuario/usuario.service';
import { RegisterDto } from './dto/register.dto';
import { Usuario } from '../usuario/entities/usuario.entity';

import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usuarioService: UsuarioService,
    private readonly userService: UserService,
  ) {}

  private mapUsuario(usuario: Usuario) {
    return {
      idUsuario: usuario.idUsuario,
      nombre: usuario.nombre,
      email: usuario.email,
    };
  }

  private mapUser(entity: Usuario | User, table: 'usuario' | 'user') {
    if (table === 'usuario') {
      const u = entity as Usuario;
      return { id: u.idUsuario, email: u.email, role: 'cliente', table };
    }
    const u = entity as User;
    return { id: u.idUser, email: u.email, role: u.rol, table };
  }


  async login({ email, clave }: { email: string; clave: string }) {
  let usuario = await this.usuarioService.findOneByEmail(email);
  if (usuario) {
    const isValid = await bcryptjs.compare(clave, usuario.clave || '');
    if (isValid) {
      const payload = { id: usuario.idUsuario, email: usuario.email, role: 'cliente', table: 'usuario' };
      const token = await this.jwtService.signAsync(payload); 
      return { token, user: payload };
    }
  }
  // 2. Intentar tabla user (admins)
  const user = await this.userService.findOneByEmail(email);
  if (user) {
    const isValid = await bcryptjs.compare(clave, user.clave || '');
    if (isValid){
      const payload = { id: user.idUser, email: user.email, role:user.rol, table: 'user'};
      const token = await this.jwtService.signAsync(payload); 
      return { token, user: payload };
  }
}
  throw new UnauthorizedException('Credenciales incorrectas');
}

  async register( registerDto: RegisterDto) {
    const existsInUsuario = await this.usuarioService.findOneByEmail(registerDto.email);
    const existsInUser = await this.userService.findOneByEmail(registerDto.email);
    if (existsInUsuario || existsInUser) {
      throw new BadRequestException('El email ya está registrado');
    }

    const hashed = await bcryptjs.hash(registerDto.clave, 10);

    const nuevoUsuario = await this.usuarioService.create({
      login: registerDto.email,
      nombre: registerDto.nombre,
      email: registerDto.email,
      telefono: registerDto.telefono,
      idDocumento: registerDto.idDocumento || null,
      numeroDocumento: registerDto.documento || null,
      clave: hashed,
    });
    return {
      usuario: this.mapUsuario(nuevoUsuario),
    };
  }
}
