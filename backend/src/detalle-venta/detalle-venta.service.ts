import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateDetalleVentaDto } from './dto/create-detalle-venta.dto';
import { UpdateDetalleVentaDto } from './dto/update-detalle-venta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetalleVenta } from './entities/detalle-venta.entity';
import { handleDBError } from '../common/exceptions/errors';

@Injectable()
export class DetalleVentaService {
  constructor(
    @InjectRepository(DetalleVenta)
    private detalleVentaRepository: Repository<DetalleVenta>,
  ) { }

  async create(createDetalleVentaDto: CreateDetalleVentaDto) {
    try {
      if ((createDetalleVentaDto as any)?.idArticulo !== undefined) {
        throw new BadRequestException('Campo idArticulo no permitido. Use idProducto.');
      }
      if (createDetalleVentaDto?.idProducto === undefined || createDetalleVentaDto?.idProducto === null) {
        throw new BadRequestException('idProducto es requerido.');
      }
      const newDetalleVenta = this.detalleVentaRepository.create(createDetalleVentaDto);
      return this.detalleVentaRepository.save(newDetalleVenta);
    } catch (error) {
      handleDBError(error, 'Ocurrió un error al guardar el detalle de venta');
    }
  }

  async findAll() {
    try {
      return await this.detalleVentaRepository.find({
        relations: ['idProducto'],
      });
    } catch (error) {
      handleDBError(error, 'Ocurrió un error al obtener los detalles de venta');
    }
  }

  async findOne(idDetalleVenta: number) {
    try {
      const found = await this.detalleVentaRepository.findOne({
        where: { idDetalleVenta },
        relations: ['idProducto'],
      });
      if (!found) {
        throw new NotFoundException('Detalle de venta no encontrado');
      }
      return found;
    } catch (error) {
      handleDBError(error, 'Ocurrió un error al obtener el detalle de venta');
    }
  }


  async update(id: number, updateDetalleVentaDto: UpdateDetalleVentaDto) {
    try {
      const found = await this.detalleVentaRepository.findOneBy({ idDetalleVenta: id });
      if (!found) {
        throw new NotFoundException('Detalle de venta no encontrado');
      }
      if ((updateDetalleVentaDto as any)?.idArticulo !== undefined) {
        throw new BadRequestException('Campo idArticulo no permitido. Use idProducto.');
      }
      if ('idProducto' in (updateDetalleVentaDto as any) && (updateDetalleVentaDto as any).idProducto == null) {
        throw new BadRequestException('Si envía idProducto debe ser un valor válido.');
      }
      const updated = Object.assign(found, updateDetalleVentaDto);
      return await this.detalleVentaRepository.save(updated);
    } catch (error) {
      handleDBError(error, 'Ocurrió un error al actualizar el detalle de venta');
    }
  }

  async remove(id: number) {
    try {
      const deleted = await this.detalleVentaRepository.delete(id);
      if (deleted.affected === 0) {
        throw new NotFoundException('Detalle de venta no encontrado');
      }
      return { message: 'Detalle de venta eliminado correctamente' };
    } catch (error) {
      handleDBError(error, 'Ocurrió un error al eliminar el detalle de venta');
    }
  }
}
