import { CreateProductoTiendaDto } from './dto/create-producto-tienda.dto';
import { UpdateProductoTiendaDto } from './dto/update-producto-tienda.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ProductoTienda } from './entities/producto-tienda.entity';

@Injectable()
export class ProductoTiendaService {
  constructor(
    @InjectRepository(ProductoTienda)
    private productoTiendaRepository: Repository<ProductoTienda>,
  ) {}

  async create(createProductoTiendaDto: CreateProductoTiendaDto) {
    try {
      const entity = this.productoTiendaRepository.create({
        idProducto: createProductoTiendaDto.idProducto,
        idTienda: createProductoTiendaDto.idTienda,
        cantidad: createProductoTiendaDto.cantidad ?? null,
      });
      return await this.productoTiendaRepository.save(entity);
    } catch (error) {
      if (
        // MySQL duplicate entry code OR message text
        error.code === 'ER_DUP_ENTRY' ||
        (error.message && error.message.includes('Duplicate entry'))
      ) {
        throw new InternalServerErrorException(
          'Este producto ya está asociado a esa tienda.'
        );
      }
      console.error(error);
      throw new InternalServerErrorException('Ocurrió un error al crear la asociación producto-tienda');
    }
  }

  async findAll() {
    try {
      return await this.productoTiendaRepository.find({
        relations: ['idProducto2', 'idTienda2'],
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Ocurrió un error al obtener las asociaciones producto-tienda');
    }
  }

  async findByProductId(idProducto: number) {
    try {
      const entities = await this.productoTiendaRepository.find({
        where: { idProducto: idProducto },
        relations: ['idProducto2', 'idTienda2'],
      });
      if (!entities || entities.length === 0) {
        throw new NotFoundException(`No se encontró asociación para el producto ID ${idProducto}`);
      }
      return entities;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Ocurrió un error al obtener asociaciones para el Producto ID ${idProducto}`,
      );
    }
  }
  async findByStoreId(idTienda: number) {
    try {
      const entities = await this.productoTiendaRepository.find({
        where: { idProducto: idTienda },
        relations: ['idTienda2', 'idProducto2'],
      });
      if (!entities || entities.length === 0) {
        throw new NotFoundException(`No se encontró asociación para la tienda ID ${idTienda}`);
      }
      return entities;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Ocurrió un error al obtener asociaciones para la tienda ID ${idTienda}`,
      );
    }
  }

  async update(id: number, updateProductoTiendaDto: UpdateProductoTiendaDto) {
    try {
      const entity = await this.productoTiendaRepository.preload({
        idProductoTienda: id,
        idProducto2: updateProductoTiendaDto.idProducto
          ? { idProducto: updateProductoTiendaDto.idProducto }
          : undefined,
        idTienda2: updateProductoTiendaDto.idTienda
          ? { idTienda: updateProductoTiendaDto.idTienda }
          : undefined,
      });
      if (!entity) {
        throw new NotFoundException(`No se encontró el producto-tienda con ID ${id}`);
      }
      return await this.productoTiendaRepository.save(entity);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Ocurrió un error al actualizar el producto-tienda con ID ${id}`,
      );
    }
  }

  async remove(id: number)
{
    try {
      const entity = await this.productoTiendaRepository.findOne({ where: { idProductoTienda: id } });
      if (!entity) {
        throw new NotFoundException(`No se encontró el producto-tienda con ID ${id}`);
      }
      await this.productoTiendaRepository.remove(entity);
      return { message: `Producto-tienda con ID ${id} eliminado correctamente` };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Ocurrió un error al eliminar el producto-tienda con ID ${id}`,
      );
    }
  }
}