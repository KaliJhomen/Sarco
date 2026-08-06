import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import {UserService} from "../user/user.service";
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  private mapUser(user: any) {
    return {
      idUser: user.idUser,
      name: user.name,
      email: user.email,
    };
  }
  async login({ email, password }: { email: string; password: string }) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new UnauthorizedException('Correo o Contraseña Incorrectass');

    const isValid = await bcryptjs.compare(password, user.password || '');
    if (!isValid) throw new UnauthorizedException('Correo o Contraseña Incorrectas');

    const payload = { id: user.idUser, email: user.email };
    const token = await this.jwtService.signAsync(payload);
    return {
      token,
      user: this.mapUser(user),
    };
  }

  async register({ name, email, /*phone, document, */password }: { name?: string; email: string;/* phone?: string; document: string; */password: string }) {
    const existing = await this.userService.findOneByEmail(email);
    if (existing) {
      throw new BadRequestException('El email ya está registrado');
    }

    const hashed = await bcryptjs.hash(password, 10);

    const newUser = await this.userService.create({
      name,
      email,
      /*phone,
      document,
      */
      password: hashed,
    });
    return {
      user: this.mapUser(newUser),
    };
  }
}
