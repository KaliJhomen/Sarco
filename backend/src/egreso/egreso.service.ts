import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEgresoDto } from './dto/create-egreso.dto';
import { UpdateEgresoDto } from './dto/update-egreso.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Egreso } from './entities/egreso.entity';
import { handleDBError } from 'src/common/execeptions/errors';

@Injectable()
export class EgresoService {
  constructor(
    @InjectRepository(Egreso)
    private readonly egresoRepository: Repository<Egreso>,
  ) { }
  async create(dtoCreate: CreateEgresoDto) {
    try {
      const newEgreso = this.egresoRepository.create(dtoCreate);
      return this.egresoRepository.save(newEgreso);
    } catch (error) {
      handleDBError(error, 'Ocurrió un error al guardar el Egreso');
    }
  }

  async findAll() {
    try {
      return await this.egresoRepository.find({
        relations: ['idUsuario'],
      });
    } catch (error) {
      handleDBError(error, 'Ocurrió un error al obtener los detalles de separado');
    }
  }

  async findOne(idEgreso: number) {
    try {
      const found = await this.egresoRepository.findOne({
        where: { idEgreso },
        relations: ['idUsuario'],
      });
      if (!found) {
        throw new NotFoundException('Egreso no encontrado');
      }
      return found;
    } catch (error) {
      handleDBError(error, 'Ocurrió un error al obtener el Egreso');
    }
  }


  async update(id: number, updateEgresoDto: UpdateEgresoDto) {
    try {
      const found = await this.egresoRepository.findOneBy({ idEgreso: id });
      if (!found) {
        throw new NotFoundException('Egreso no encontrado');
      }
      const updated = Object.assign(found, updateEgresoDto);
      return await this.egresoRepository.save(updated);
    } catch (error) {
      handleDBError(error, 'Ocurrió un error al actualizar el Egreso');
    }
  }

  async remove(id: number) {
    try {
      const deleted = await this.egresoRepository.delete(id);
      if (deleted.affected === 0) {
        throw new NotFoundException('Egreso no encontrado');
      }
      return { message: 'Egreso eliminado correctamente' };
    } catch (error) {
      handleDBError(error, 'Ocurrió un error al eliminar el Egreso');
    }
  }
}
