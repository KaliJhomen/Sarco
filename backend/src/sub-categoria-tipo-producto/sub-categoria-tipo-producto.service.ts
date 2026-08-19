import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateSubCategoriaTipoProductoDto } from './dto/create-sub-categoria-tipo-producto.dto';
import { UpdateSubCategoriaTipoProductoDto } from './dto/update-sub-categoria-tipo-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SubCategoriaTipoProducto } from './entities/sub-categoria-tipo-producto.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TipoProductoSubCategoriaService {
  private readonly logger = new Logger(TipoProductoSubCategoriaService.name);

  constructor(
      @InjectRepository(SubCategoriaTipoProducto)
      private tipoProductoSubCategoriaRepository: Repository<SubCategoriaTipoProducto>,
    ) { }
    async create(createTipoProductoSubCategoriaDto: CreateSubCategoriaTipoProductoDto) {
      try {
        const entity = this.tipoProductoSubCategoriaRepository.create({
          tipoProducto: { idTipoProducto: createTipoProductoSubCategoriaDto.idTipoProducto },
          subCategoria: { idSubCategoria: createTipoProductoSubCategoriaDto.idSubCategoria },
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
        this.logger.error(error);
        throw new InternalServerErrorException('Ocurrió un error al crear el tipo-producto-sub-categoria');
      }
  }

  async findAll() {
    try {
      return await this.tipoProductoSubCategoriaRepository.find({
        relations:['idTipoProducto', 'idSubCategoria']
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocurrió un error al obtener las categorías',
      );
    }
    }

  async findOne(id: number) {
    try {
      const entity = await this.tipoProductoSubCategoriaRepository.findOne({
        where: { idSubCategoriaTipoProducto: id },
        relations: ['idTipoProducto', 'idSubCategoria'], 
      });
      if (!entity) {
        throw new NotFoundException(`No se encontró el tipo-producto-sub-categoria con ID ${id}`);
      }
      return entity;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Ocurrió un error al obtener el tipo-producto-sub-categoria con ID ${id}`,
      );
    }  }

  async update(id: number, updateTipoProductoSubCategoriaDto: UpdateSubCategoriaTipoProductoDto) {
    try {
      const entity = await this.tipoProductoSubCategoriaRepository.preload({
        idSubCategoriaTipoProducto: id,
        tipoProducto: updateTipoProductoSubCategoriaDto.idTipoProducto
          ? { idTipoProducto: updateTipoProductoSubCategoriaDto.idTipoProducto }
          : undefined,
        subCategoria: updateTipoProductoSubCategoriaDto.idSubCategoria
          ? { idSubCategoria: updateTipoProductoSubCategoriaDto.idSubCategoria }
          : undefined,
      });
      if (!entity) {
        throw new NotFoundException(`No se encontró el tipo-producto-sub-categoria con ID ${id}`);
      }
      return await this.tipoProductoSubCategoriaRepository.save(entity);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Ocurrió un error al actualizar el tipo-producto-sub-categoria con ID ${id}`,
      );
    }  }

  async remove(id: number) {
    try {
      const entity = await this.tipoProductoSubCategoriaRepository.findOne({ where: { idSubCategoriaTipoProducto: id } });
      if (!entity) {
        throw new NotFoundException(`No se encontró el tipo-producto-sub-categoria con ID ${id}`);
      }
      await this.tipoProductoSubCategoriaRepository.remove(entity);
      return { message: `Tipo-producto-sub-categoria con ID ${id} eliminado correctamente` };
    } catch (error) {
        this.logger.error(error);
        throw new InternalServerErrorException(
        `Ocurrió un error al eliminar el tipo-producto-sub-categoria con ID ${id}`,
      );
    }  }
}
