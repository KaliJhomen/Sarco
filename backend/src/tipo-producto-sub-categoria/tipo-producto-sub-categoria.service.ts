import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTipoProductoSubCategoriaDto } from './dto/create-tipo-producto-sub-categoria.dto';
import { UpdateTipoProductoSubCategoriaDto } from './dto/update-tipo-producto-sub-categoria.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoProductoSubCategoria } from './entities/tipo-producto-sub-categoria.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TipoProductoSubCategoriaService {
  constructor(
      @InjectRepository(TipoProductoSubCategoria)
      private tipoProductoSubCategoriaRepository: Repository<TipoProductoSubCategoria>,
    ) { }
    async create(dtoCreate: CreateTipoProductoSubCategoriaDto) {
      try {
        const entity = this.tipoProductoSubCategoriaRepository.create({
          tipoProducto: { idTipoProducto: dtoCreate.idTipoProducto },
          subCategoria: { idSubCategoria: dtoCreate.idSubCategoria },
        });
        return await this.tipoProductoSubCategoriaRepository.save(entity);
      } catch (error) {
        if (
          error.code === 'ER_DUP_ENTRY' ||
          (error.message && error.message.includes('Duplicate entry'))
        ) {
          throw new InternalServerErrorException(
            'Este tipo de producto ya está asociado a esa subcategoría.'
          );
        }
        console.error(error);
        throw new InternalServerErrorException('Ocurrió un error al crear el tipo-producto-sub-categoria');
      }
  }

  async findAll() {
    try {
      return await this.tipoProductoSubCategoriaRepository.find({
        relations:['idTipoProducto', 'idSubCategoria']
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Ocurrió un error al obtener las categorías',
      );
    }
    }

  async findOne(id: number) {
    try {
      const entity = await this.tipoProductoSubCategoriaRepository.findOne({
        where: { idTipoProductoSubCategoria: id },
        relations: ['idTipoProducto', 'idSubCategoria'], 
      });
      if (!entity) {
        throw new NotFoundException(`No se encontró el tipo-producto-sub-categoria con ID ${id}`);
      }
      return entity;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Ocurrió un error al obtener el tipo-producto-sub-categoria con ID ${id}`,
      );
    }  }

  async update(id: number, dtoUpdate: UpdateTipoProductoSubCategoriaDto) {
    try {
      const entity = await this.tipoProductoSubCategoriaRepository.preload({
        idTipoProductoSubCategoria: id,
        tipoProducto: dtoUpdate.idTipoProducto
          ? { idTipoProducto: dtoUpdate.idTipoProducto }
          : undefined,
        subCategoria: dtoUpdate.idSubCategoria
          ? { idSubCategoria: dtoUpdate.idSubCategoria }
          : undefined,
      });
      if (!entity) {
        throw new NotFoundException(`No se encontró el tipo-producto-sub-categoria con ID ${id}`);
      }
      return await this.tipoProductoSubCategoriaRepository.save(entity);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Ocurrió un error al actualizar el tipo-producto-sub-categoria con ID ${id}`,
      );
    }  }

  async remove(id: number) {
    try {
      const entity = await this.tipoProductoSubCategoriaRepository.findOne({ where: { idTipoProductoSubCategoria: id } });
      if (!entity) {
        throw new NotFoundException(`No se encontró el tipo-producto-sub-categoria con ID ${id}`);
      }
      await this.tipoProductoSubCategoriaRepository.remove(entity);
      return { message: `Tipo-producto-sub-categoria con ID ${id} eliminado correctamente` };
    } catch (error) {
        console.error(error);
        throw new InternalServerErrorException(
        `Ocurrió un error al eliminar el tipo-producto-sub-categoria con ID ${id}`,
      );
    }  }
}
