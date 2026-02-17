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
    const usuario: Usuario = Object.assign(new Usuario(), createUsuarioDto as any);
    if (createUsuarioDto.clave) {
      usuario.clave = await bcryptjs.hash(createUsuarioDto.clave, 10);
    }

    return await this.usuarioRepository.save(usuario);
  }

  findOneByLogin(login: string) {
    return this.usuarioRepository.findOne({
      where: { login },
      relations: ['idCargo2'],
    });
  }

  getFoto(imagen: string) {
    return this.usuarioRepository.findOne({
      where: { imagen },
    });
  }

  getUsuarios() {
    return this.usuarioRepository.find({
      relations: ['idCargo2', 'idTienda2'],
    });
  }

  findAll() {

    return this.getUsuarios();
  }

  async findOne(id: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario: id },
      relations: ['idCargo2', 'idTienda2'],
    });
    if (!usuario) throw new NotFoundException(`Usuario ${id} no encontrado`);
    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.usuarioRepository.findOne({ where: { idUsuario: id } });
    if (!usuario) throw new NotFoundException(`Usuario ${id} no encontrado`);

    const toSave = { ...usuario, ...updateUsuarioDto } as any;

    if (updateUsuarioDto.clave) {
      toSave.clave = await bcryptjs.hash(updateUsuarioDto.clave, 10);
    }

    await this.usuarioRepository.save(toSave);
    return this.findOne(id);
  }

  async remove(id: number) {
    const res = await this.usuarioRepository.delete({ idUsuario: id });
    if (res.affected === 0) throw new NotFoundException(`Usuario ${id} no encontrado`);
    return { success: true };
  }
}
