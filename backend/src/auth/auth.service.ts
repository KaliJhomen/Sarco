import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService, 
    private readonly jwtService: JwtService,
  ) {}

  async login({ login, clave }: { login: string; clave: string }) {
    // Buscar el usuario en la tabla user
    const user = await this.userService.findOneByEmail(login);
    if (!user) throw new UnauthorizedException('Login incorrecto');

    // Comparar la clave (si en DB están hasheadas, usar bcrypt.compare)
    const isValid = await bcryptjs.compare(clave, user.clave || '') || user.clave === clave;
    if (!isValid) throw new UnauthorizedException('Clave incorrecta');

    // Normalizar el rol (puedes ajustar esta lógica según tu implementación)
    const role = 'Usuario'; // Puedes cambiar esto si tienes roles en la tabla user

    // Crear el payload del token
    const payload = { sub: user.idUser, email: user.email, role };
    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      user: {
        id: user.idUser,
        nombre: user.nombre,
        email: user.email,
        role,
      },
    };
  }

  async register({ name, email, password }: { name?: string; email: string; password: string }) {
    // Verificar si el email ya está registrado
    const existing = await this.userService.findOneByEmail(email);
    if (existing) {
      throw new BadRequestException('El email ya está registrado');
    }

    // Hashear la contraseña
    const hashed = await bcryptjs.hash(password, 10);

    // Crear el nuevo usuario
    const newUser = await this.userService.create({
      name,
      email,
      password: hashed,
    } as any);

    // Opcional: no devolver la contraseña
    delete (newUser as any).password;
    return newUser;
  }
}
