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
      const newUser: Usuario = Object.assign(new Usuario(), createUsuarioDto as any);
    if (createUsuarioDto.password) {
      newUser.password = await bcryptjs.hash(createUsuarioDto.password, 10);
    }
    return await this.usuarioRepository.save(newUser);
  }
  async findOne(idUser: number) {
    const user = await this.usuarioRepository.findOne({
      where: { idUser: idUser },
      relations: ['idCargo2', 'idTienda2'],
    });
    if (!user) throw new NotFoundException(`Usuario ${idUser} no encontrado`);
    return user;
  }
  
  findAll() {
    return this.usuarioRepository.find({
      relations: ['idCargo2', 'idTienda2'],
    });
  }
  findOneByLogin(login: string) {
    return this.usuarioRepository.findOne({
      where: { login },
      relations: ['idCargo2'],
    });
  }

  async findOneByEmail(email: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOneBy({ email });
  }

  findByImagen(image: string) {
    return this.usuarioRepository.findOne({
      where: { image },
    });
  }




  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.usuarioRepository.findOne({ where: { idUser: id } });
    if (!usuario) throw new NotFoundException(`Usuario ${id} no encontrado`);

    const toSave = { ...usuario, ...updateUsuarioDto } as any;

    if (updateUsuarioDto.password) {
      toSave.password = await bcryptjs.hash(updateUsuarioDto.password, 10);
    }

    await this.usuarioRepository.save(toSave);
    return this.findOne(id);
  }

  async remove(id: number) {
    const res = await this.usuarioRepository.delete({ idUser: id });
    if (res.affected === 0) throw new NotFoundException(`Usuario ${id} no encontrado`);
    return { success: true };
  }
}
