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
        producto: { idProducto: createProductoTipoProductoDto.idProducto },
        tipoProducto: { idTipoProducto: createProductoTipoProductoDto.idTipoProducto },
      });
      return await this.productoTipoProductoRepository.save(entity);
    } catch (error : any) {
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
        relations:['producto', 'tipoProducto']
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Ocurrió un error al obtener las categorías',
      );
    }
  }
  //Por ID Producto
  async findByProductId(idProducto: number) {
    try {
      const entity = await this.productoTipoProductoRepository.find({ where: { producto: {idProducto}} });
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
  // Por ID TipoProducto 
  async findByProductTypeId(idTipoProducto: number) {
    try {
      const entity = await this.productoTipoProductoRepository.find({ where: { tipoProducto: { idTipoProducto: idTipoProducto } } });
      if (!entity) {
        throw new NotFoundException(`No se encontró el producto-tipo-producto con ID ${idTipoProducto}`);
      }
      return entity;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Ocurrió un error al obtener el producto-tipo-producto con Producto ID ${idTipoProducto}`,
      );
    }
  }
  async findOne(idProductoTipoProducto: number) {
    try {
      const entity = await this.productoTipoProductoRepository.findOne({ where: { idProductoTipoProducto} });
      if (!entity) {
        throw new NotFoundException(`No se encontró el producto-tipo-producto con ID ${idProductoTipoProducto}`);
      }
      return entity;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Ocurrió un error al obtener el producto-tipo-producto con ID ${idProductoTipoProducto}`,
      );
    }
  }

  async update(idProductoTipoProducto: number, updateProductoTipoProductoDto: UpdateProductoTipoProductoDto) {
    try {
      const entity = await this.productoTipoProductoRepository.preload({
        tipoProducto: updateProductoTipoProductoDto.idTipoProducto
          ? { idTipoProducto: updateProductoTipoProductoDto.idTipoProducto,
           }
          : undefined,
        producto: updateProductoTipoProductoDto.idProducto
          ? { idProducto: updateProductoTipoProductoDto.idProducto
          }
          : undefined,
      });
      if (!entity) {
        throw new NotFoundException(`No se encontró el producto-tipo-producto con ID ${idProductoTipoProducto}`);
      }
      return await this.productoTipoProductoRepository.save(entity);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Ocurrió un error al actualizar el producto-tipo-producto con ID ${idProductoTipoProducto}`,
      );
    }
  }

  async remove(idProductoTipoProducto: number) {
    try {
      const entity = await this.productoTipoProductoRepository.findOne({ where: { idProductoTipoProducto } });
      if (!entity) {
        throw new NotFoundException(`No se encontró el producto-tipo-producto con ID ${idProductoTipoProducto}`);
      }
      await this.productoTipoProductoRepository.remove(entity);
      return { message: `Producto-tipo-producto con ID ${idProductoTipoProducto} eliminado correctamente` };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Ocurrió un error al eliminar el producto-tipo-producto con ID ${idProductoTipoProducto}`,
      );
    }
  }
}
