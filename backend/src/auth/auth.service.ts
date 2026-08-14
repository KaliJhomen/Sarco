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
  private hasAccount(cliente: Cliente){
    if (!cliente) return false;
    const email= cliente.email?.trim()
    const clave= cliente.clave?.trim()
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');  
    const claveValida = Boolean(clave && clave.length >= 6);
    
    return claveValida && emailValido;
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
  const byEmail = await this.clienteService.findOneByEmail(email);
  if (byEmail) {
    if (this.hasAccount(byEmail)) {
      throw new BadRequestException('El email ya está registrado');
    }
    const adoptado = await this.clienteService.activateAccount(byEmail.idCliente, email, hashed);
    return { usuario: this.mapCliente(adoptado) };
  }

  if (registerDto.numeroDocumento) {
    const byDocument = await this.clienteService.findOneByNumeroDocumento(registerDto.numeroDocumento);
    if (byDocument) {
      if (this.hasAccount(byDocument)) {
        throw new BadRequestException('Ya existe una cuenta con este documento');
      }
      const adoptado = await this.clienteService.activateAccount(byDocument.idCliente, email, hashed);
      return { usuario: this.mapCliente(adoptado) };
    }
  }

  const nuevoCliente = await this.clienteService.create({
    nombre: registerDto.nombre,
    email:email,
    telefono: registerDto.telefono ?? null,
    idDocumento: registerDto.idDocumento ?? null,
    numeroDocumento: registerDto.numeroDocumento ?? null,
    clave: hashed,
  });

  return { usuario: this.mapCliente(nuevoCliente) };
}
}
