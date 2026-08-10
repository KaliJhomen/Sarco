import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateDetalleCreditoDto } from './dto/create-detalle-credito.dto';
import { UpdateDetalleCreditoDto } from './dto/update-detalle-credito.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetalleCredito } from './entities/detalle-credito.entity';
import { handleDBError } from 'src/common/execeptions/errors';

@Injectable()
export class DetalleCreditoService {
  constructor(
    @InjectRepository(DetalleCredito)
    private detalleCreditoRepository: Repository<DetalleCredito>,
  ) { }

  async create(dtoCreate: CreateDetalleCreditoDto) {
    try {
      if ((dtoCreate as any)?.idArticulo !== undefined) {
        throw new BadRequestException('Campo idArticulo no permitido. Use idProducto.');
      }
      if (dtoCreate?.idProducto === undefined || dtoCreate?.idProducto === null) {
        throw new BadRequestException('idProducto es requerido.');
      }
      const newDetalleCredito = this.detalleCreditoRepository.create(dtoCreate);
      return this.detalleCreditoRepository.save(newDetalleCredito);
    } catch (error) {
      handleDBError(error, 'Ocurrió un error al guardar el detalle de crédito');
    }
  }

  async findAll() {
    try {
      return await this.detalleCreditoRepository.find({
        relations: ['producto'],
        select: {
          producto: {
            idProducto: true,
            nombre: true
          }
        },
      });
    } catch (error) {
      handleDBError(error, 'Ocurrió un error al obtener los detalles de crédito');
    }
  }

  async findOne(idDetalleCredito: number) {
    try {
      const found = await this.detalleCreditoRepository.findOne({
        where: { idDetalleCredito },
        relations: ['producto'],
      });
      if (!found) {
        throw new NotFoundException('Detalle de crédito no encontrado');
      }
      return found;
    } catch (error) {
      handleDBError(error, 'Ocurrió un error al obtener el detalle de crédito');
    }
  }


  async update(id: number, updateDetalleCreditoDto: UpdateDetalleCreditoDto) {
    try {
      const found = await this.detalleCreditoRepository.findOneBy({ idDetalleCredito: id });
      if (!found) {
        throw new NotFoundException('Detalle de crédito no encontrado');
      }
      if ((updateDetalleCreditoDto as any)?.idArticulo !== undefined) {
        throw new BadRequestException('Campo idArticulo no permitido. Use idProducto.');
      }
      if ('idProducto' in (updateDetalleCreditoDto as any) && (updateDetalleCreditoDto as any).idProducto == null) {
        throw new BadRequestException('Si envía idProducto debe ser un valor válido.');
      }
      const updated = Object.assign(found, updateDetalleCreditoDto);
      return await this.detalleCreditoRepository.save(updated);
    } catch (error) {
      handleDBError(error, 'Ocurrió un error al actualizar el detalle de crédito');
    }
  }

  async remove(id: number) {
    try {
      const deleted = await this.detalleCreditoRepository.delete(id);
      if (deleted.affected === 0) {
        throw new NotFoundException('Detalle de crédito no encontrado');
      }
      return { message: 'Detalle de crédito eliminado correctamente' };
    } catch (error) {
      handleDBError(error, 'Ocurrió un error al eliminar el detalle de crédito');
    }
  }
}
