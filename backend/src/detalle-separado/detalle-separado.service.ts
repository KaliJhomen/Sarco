import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateDetalleSeparadoDto } from './dto/create-detalle-separado.dto';
import { UpdateDetalleSeparadoDto } from './dto/update-detalle-separado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetalleSeparado } from './entities/detalle-separado.entity';
import { handleDBError } from 'src/common/execeptions/errors';

@Injectable()
export class DetalleSeparadoService {
  constructor(
    @InjectRepository(DetalleSeparado)
    private detalleSeparadoRepository: Repository<DetalleSeparado>,
  ) { }

  async create(dtoCreate: CreateDetalleSeparadoDto) {
    try {
      if ((dtoCreate as any)?.idArticulo !== undefined) {
        throw new BadRequestException('Campo idArticulo no permitido. Use idProducto.');
      }
      if (dtoCreate?.idProducto === undefined || dtoCreate?.idProducto === null) {
        throw new BadRequestException('idProducto es requerido.');
      }
      const newDetalleSeparado = this.detalleSeparadoRepository.create(dtoCreate);
      return this.detalleSeparadoRepository.save(newDetalleSeparado);
    } catch (error) {
      handleDBError(error, 'Ocurrió un error al guardar el detalle de separado');
    }
  }

  async findAll() {
    try {
      return await this.detalleSeparadoRepository.find({
        relations: ['idProducto'],
        select: {
          producto: {
            idProducto: true,
            nombre: true
          }
        },
      });
    } catch (error) {
      handleDBError(error, 'Ocurrió un error al obtener los detalles de separado');
    }
  }

  async findOne(id: number) {
    try {
      const found = await this.detalleSeparadoRepository.findOne({
        where: { idDetalleSeparado: id },
        relations: ['idProducto'],
      });
      if (!found) {
        throw new NotFoundException('Detalle de separado no encontrado');
      }
      return found;
    } catch (error) {
      handleDBError(error, 'Ocurrió un error al obtener el detalle de separado');
    }
  }


  async update(id: number, dtoUpdate: UpdateDetalleSeparadoDto) {
    try {
      const found = await this.detalleSeparadoRepository.findOneBy({ idDetalleSeparado: id });
      if (!found) {
        throw new NotFoundException('Detalle de separado no encontrado');
      }
      if ((dtoUpdate as any)?.idArticulo !== undefined) {
        throw new BadRequestException('Campo idArticulo no permitido. Use idProducto.');
      }
      if ('idProducto' in (dtoUpdate as any) && (dtoUpdate as any).idProducto == null) {
        throw new BadRequestException('Si envía idProducto debe ser un valor válido.');
      }
      const updated = Object.assign(found, dtoUpdate);
      return await this.detalleSeparadoRepository.save(updated);
    } catch (error) {
      handleDBError(error, 'Ocurrió un error al actualizar el detalle de separado');
    }
  }

  async remove(idDetalleSeparado: number) {
    try {
      const deleted = await this.detalleSeparadoRepository.delete(idDetalleSeparado);
      if (deleted.affected === 0) {
        throw new NotFoundException('Detalle de separado no encontrado');
      }
      return { message: 'Detalle de separado eliminado correctamente' };
    } catch (error) {
      handleDBError(error, 'Ocurrió un error al eliminar el detalle de separado');
    }
  }
}
