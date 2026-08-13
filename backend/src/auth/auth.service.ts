import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { Cliente } from '../cliente/entities/cliente.entity';
import { ClienteService } from '../cliente/cliente.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly clienteService: ClienteService,
  ) {}

  private mapCliente(cliente: Cliente) {
    return {
      idCliente: cliente.idCliente,
      nombre: cliente.nombre,
      email: cliente.email,
    };
  }
  private hasAccount(cliente: Cliente): boolean {
  return !!cliente.clave && cliente.clave !== '' && !!cliente.login && cliente.login !== '';
  }

  async login({ email, clave }: { email: string; clave: string }) {
  const cliente = await this.clienteService.findOneByEmail(email);
  if (!cliente) throw new UnauthorizedException("Credenciales incorrectas");
  const isValid = await bcryptjs.compare(clave, cliente.clave || '');
  if (!isValid) throw new UnauthorizedException("Credenciales incorrectas")
  const payload = { id: cliente.idCliente, email:cliente.email, table: 'cliente'};
  const token = await this.jwtService.signAsync(payload); 
  return { token, cliente: payload };
  }
  async register( registerDto: RegisterDto) {
  const email = registerDto.email.trim().toLowerCase();
  const hashed = await bcryptjs.hash(registerDto.clave, 10);

  const porEmail = await this.clienteService.findOneByEmail(email);
  if (porEmail) {
    if (this.hasAccount(porEmail)) {
      throw new BadRequestException('El email ya está registrado');
    }
    const adoptado = await this.clienteService.activateAccount(porEmail.idCliente, email, email, hashed);
    return { usuario: this.mapCliente(adoptado) };
  }

  if (registerDto.numeroDocumento) {
    const porDoc = await this.clienteService.findOneByNumeroDocumento(registerDto.numeroDocumento);
    if (porDoc) {
      if (this.hasAccount(porDoc)) {
        throw new BadRequestException('Ya existe una cuenta con este documento');
      }
      const adoptado = await this.clienteService.activateAccount(porDoc.idCliente, email, email, hashed);
      return { usuario: this.mapCliente(adoptado) };
    }
  }

  const nuevoCliente = await this.clienteService.create({
    login: email,
    nombre: registerDto.nombre,
    email,
    telefono: registerDto.telefono ?? null,
    numeroDocumento: registerDto.numeroDocumento ?? null,
    clave: hashed,
  });

  return { usuario: this.mapCliente(nuevoCliente) };
}
}
