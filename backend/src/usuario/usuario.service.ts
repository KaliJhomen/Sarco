import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
      const nuevoUsuario: Usuario = Object.assign(new Usuario(), createUsuarioDto as any);
    return await this.usuarioRepository.save(nuevoUsuario);
  }
  async findOne(idUsuario: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario},
      relations: ['carrito', 'favoritos'],
    });
    if (!usuario) throw new NotFoundException(`Usuario ${idUsuario} no encontrado`);
    return usuario;
  }
  
  findAll() {
    return this.usuarioRepository.find({
      select: ['idUsuario', 'login', 'email', 'nombre', 'numeroDocumento', 'telefono', 'ciudad', 'direccion', 'imagen', 'fondo'],
      relations: ['carrito', 'favoritos']
    });
  }

  findOneByLogin(login: string) {   
    return this.usuarioRepository.findOne({
      where: { login },
    });
  }

  async findOneByEmail(email: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOneBy({ email });
  }
/*
  findByImagen(imagen: string) {
    return this.usuarioRepository.findOne({
      where: { imagen },
    });
  }
*/
  async update(idUsuario: number, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.usuarioRepository.findOne({ where: { idUsuario} });
    if (!usuario) throw new NotFoundException(`Usuario ${idUsuario} no encontrado`);

    const toSave = { ...usuario, ...updateUsuarioDto } as any;

    if (updateUsuarioDto.clave) {
      toSave.clave = await bcryptjs.hash(updateUsuarioDto.clave, 10);
    }

    await this.usuarioRepository.save(toSave);
    return await this.findOne(idUsuario);
  }

  async remove(idUsuario: number) {
    const res = await this.usuarioRepository.delete({ idUsuario });
    if (res.affected === 0) throw new NotFoundException(`Usuario ${idUsuario} no encontrado`);
    return { success: true };
  }
}
