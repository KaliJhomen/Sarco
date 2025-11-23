import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductoTipoProductoDto } from './dto/create-producto-tipo-producto.dto';
import { UpdateProductoTipoProductoDto } from './dto/update-producto-tipo-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductoTipoProducto } from './entities/producto-tipo-producto.entity';

@Injectable()
export class ProductoTipoProductoService {
  constructor(
    @InjectRepository(ProductoTipoProducto)
    private productoTipoProductoRepository: Repository<ProductoTipoProducto>,
  ) { }
  async create(createProductoTipoProductoDto: CreateProductoTipoProductoDto) {
    try {
      const entity = this.productoTipoProductoRepository.create({
        idProducto: { idProducto: createProductoTipoProductoDto.idProducto },
        idTipoProducto: { idTipoProducto: createProductoTipoProductoDto.idTipoProducto },
      });
      return await this.productoTipoProductoRepository.save(entity);
    } catch (error) {
      if (
        error.code === 'ER_DUP_ENTRY' ||
        (error.message && error.message.includes('Duplicate entry'))
      ) {
        throw new InternalServerErrorException(
          'Este producto ya está asociado a ese tipo de producto.'
        );
      }
      console.error(error);
      throw new InternalServerErrorException('Ocurrió un error al crear el producto-tipo-producto');
    }
  }

  async findAll() {
    try {
      return await this.productoTipoProductoRepository.find({
        relations:['idProducto', 'idTipoProducto']
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Ocurrió un error al obtener las categorías',
      );
    }
  }
  async findByProductId(idProducto: number) {
    try {
      const entity = await this.productoTipoProductoRepository.find({ where: { idProducto: { idProducto: idProducto } } });
      if (!entity) {
        throw new NotFoundException(`No se encontró el producto-tipo-producto con ID ${idProducto}`);
      }
      return entity;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Ocurrió un error al obtener el producto-tipo-producto con Producto ID ${idProducto}`,
      );
    }
  }
  async findOne(id: number) {
    try {
      const entity = await this.productoTipoProductoRepository.findOne({ where: { idProductoTipoProducto: id } });
      if (!entity) {
        throw new NotFoundException(`No se encontró el producto-tipo-producto con ID ${id}`);
      }
      return entity;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Ocurrió un error al obtener el producto-tipo-producto con ID ${id}`,
      );
    }
  }

  async update(id: number, updateProductoTipoProductoDto: UpdateProductoTipoProductoDto) {
    try {
      const entity = await this.productoTipoProductoRepository.preload({
        idProductoTipoProducto: id,
        idProducto: updateProductoTipoProductoDto.idProducto
          ? { idProducto: updateProductoTipoProductoDto.idProducto }
          : undefined,
        idTipoProducto: updateProductoTipoProductoDto.idTipoProducto
          ? { idTipoProducto: updateProductoTipoProductoDto.idTipoProducto }
          : undefined,
      });
      if (!entity) {
        throw new NotFoundException(`No se encontró el producto-tipo-producto con ID ${id}`);
      }
      return await this.productoTipoProductoRepository.save(entity);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Ocurrió un error al actualizar el producto-tipo-producto con ID ${id}`,
      );
    }
  }

  async remove(id: number) {
    try {
      const entity = await this.productoTipoProductoRepository.findOne({ where: { idProductoTipoProducto: id } });
      if (!entity) {
        throw new NotFoundException(`No se encontró el producto-tipo-producto con ID ${id}`);
      }
      await this.productoTipoProductoRepository.remove(entity);
      return { message: `Producto-tipo-producto con ID ${id} eliminado correctamente` };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Ocurrió un error al eliminar el producto-tipo-producto con ID ${id}`,
      );
    }
  }
}
