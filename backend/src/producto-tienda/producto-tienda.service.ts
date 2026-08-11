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
        idTienda:  createProductoTiendaDto.idTienda ,
        cantidad: createProductoTiendaDto.cantidad ?? null,
      });
      return await this.productoTiendaRepository.save(entity);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY'){
         throw new  InternalServerErrorException("Producto ya existe");
      }
      console.error(error);
      throw new InternalServerErrorException('Ocurrió un error al crear la asociación producto-tienda');
    }
  }

  async findAll() {
    try {
      return await this.productoTiendaRepository.find({
        relations: ['producto', 'tienda'],
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Ocurrió un error al obtener las asociaciones producto-tienda');
    }
  }
  private async findByRelation(field: 'producto' | 'tienda', id: number, label: string) {
    const where = field === 'producto'
      ? { idProducto: id }
      : { idTienda: id };

    const entities = await this.productoTiendaRepository.find({
      where,
      relations: ['producto', 'tienda'],
    });

    if (!entities.length) {
      throw new NotFoundException(`No se encontró asociación para ${label} ID ${id}`);
    }
    return entities;
  }
  async findByProductId(idProducto: number) {
    try {
      return await this.findByRelation('producto', idProducto, 'Producto');
    } catch (error){
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Ocurrió un error al obtener asociaciones para el Producto ID ${idProducto}`,
      );
    }
  }

  async findByStoreId(idTienda: number) {
    try {
    return await this.findByRelation('tienda', idTienda, 'Tienda');  
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Ocurrió un error al obtener asociaciones para la tienda ID ${idTienda}`,
      );
    }
  }

  async update(idProductoTienda: number, updateProductoTiendaDto: UpdateProductoTiendaDto) {
    try {
      const entity = await this.productoTiendaRepository.preload({
        idProductoTienda,
        producto: updateProductoTiendaDto.idProducto
          ? { idProducto: updateProductoTiendaDto.idProducto }
          : undefined,
        tienda: updateProductoTiendaDto.idTienda
          ? { idTienda: updateProductoTiendaDto.idTienda }
          : undefined,
      });
      if (!entity) {
        throw new NotFoundException(`No se encontró el producto-tienda con ID ${idProductoTienda}`);
      }
      return await this.productoTiendaRepository.save(entity);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Ocurrió un error al actualizar el producto-tienda con ID ${idProductoTienda}`,
      );
    }
  }

  async remove(idProductoTienda: number)
{
    try {
      const entity = await this.productoTiendaRepository.findOne({ where: { idProductoTienda } });
      if (!entity) {
        throw new NotFoundException(`No se encontró el producto-tienda con ID ${idProductoTienda}`);
      }
      await this.productoTiendaRepository.remove(entity);
      return { message: `Producto-tienda con ID ${idProductoTienda} eliminado correctamente` };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Ocurrió un error al eliminar el producto-tienda con ID ${idProductoTienda}`,
      );
    }
  }
}