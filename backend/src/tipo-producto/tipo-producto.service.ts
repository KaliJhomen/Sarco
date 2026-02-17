import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TipoProducto } from './entities/tipo-producto.entity';
import { CreateTipoProductoDto } from './dto/create-tipo-producto.dto';
import { UpdateTipoProductoDto } from './dto/update-tipo-producto.dto';

import { TipoProductoSubCategoria } from 'src/TipoProductoSubCategoria/entities/tipo-producto-sub-categoria.entity';
import { SubCategoria } from 'src/sub-categoria/entities/sub-categoria.entity';

import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class TipoProductoService {
  constructor(
    @InjectRepository(TipoProducto)
    private tipoProductoRepository: Repository<TipoProducto>,
    @InjectRepository(TipoProductoSubCategoria)
    private tipoProductoSubCategoriaRepository: Repository<TipoProductoSubCategoria>,
    @InjectRepository(SubCategoria)
    private subCategoriaRepository: Repository<SubCategoria>,
  ) { }

  async create(createTipoProductoDto: CreateTipoProductoDto) {
    try {
      const { idSubCategorias, ...tipoProductoData } = createTipoProductoDto;
      
      // Crear y guardar el tipo de producto
      const tipoProducto = this.tipoProductoRepository.create(tipoProductoData);
      const tipoProductoGuardado = await this.tipoProductoRepository.save(tipoProducto);
      
      // Crear las relaciones con las subcategorías
      if (idSubCategorias && Array.isArray(idSubCategorias) && idSubCategorias.length > 0) {
        const relaciones = idSubCategorias.map(id => ({
          idTipoProducto: tipoProductoGuardado,
          idSubCategoria: { idSubCategoria: id }
        })) as DeepPartial<TipoProductoSubCategoria>[];
        
        await this.tipoProductoSubCategoriaRepository.save(relaciones);
      }
      
      return tipoProductoGuardado;
    } catch (error) {
      console.error('Error al crear tipo producto:', error);
      throw new InternalServerErrorException(
        'Ocurrió un error al crear el tipo producto',
      );
    }
  }

  async findAll() {
    try {
      return await this.tipoProductoRepository.find({
        relations: ['tipoProductoSubCategoria', 'tipoProductoSubCategoria.idSubCategoria']
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Ocurrió un error al obtener los tipos de producto',
      );
    }
  }

  async findAllFiltered(idProducto?: number, idSubCategoria?: number) {
    try {
      if (
        (!idSubCategoria || Number(idSubCategoria) <= 0) &&
        (!idProducto || Number(idProducto) <= 0)
      ) {
        return await this.findAll();
      }

      const qb = this.tipoProductoRepository.createQueryBuilder('tipoProducto')
        .leftJoinAndSelect('tipoProducto.tipoProductoSubCategoria', 'sctp')
        .leftJoinAndSelect('sctp.idSubCategoria', 'subcat');

      if (idSubCategoria && Number(idSubCategoria) > 0) {
        qb.where('sctp.idSubCategoria = :subId', { subId: Number(idSubCategoria) });
      }

      if (idProducto && Number(idProducto) > 0) {
        qb.innerJoin('tipoProducto.productoTipoProducto', 'ptprod')
          .andWhere('ptprod.idProducto = :prodId', { prodId: Number(idProducto) });
      }

      return await qb.getMany();
    } catch (error) {
      console.error('❌ ERROR en findAllFiltered:', {
        message: error.message,
        stack: error.stack,
        params: { idProducto, idSubCategoria }
      });
      throw new InternalServerErrorException(
        `Error al obtener tipos de producto filtrados: ${error.message}`,
      );
    }
  }

  async findOne(id: number) {
    try {
      const tipoProductoFound = await this.tipoProductoRepository.findOne({
        where: { idTipoProducto: id },
        relations: ['tipoProductoSubCategoria', 'tipoProductoSubCategoria.idSubCategoria']
      });
      
      if (!tipoProductoFound) {
        throw new NotFoundException('Tipo Producto no encontrado');
      }
      
      return tipoProductoFound;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error interno al obtener el tipo producto',
      );
    }
  }

  async update(id: number, updateTipoProductoDto: UpdateTipoProductoDto) {
    try {
      const tipoProductoFound = await this.tipoProductoRepository.findOne({
        where: { idTipoProducto: id }
      });

      if (!tipoProductoFound) {
        throw new NotFoundException('Tipo Producto no encontrado');
      }

      const { idSubCategorias, ...tipoProductoData } = updateTipoProductoDto;

      // Actualizar datos básicos
      const updatedTipoProducto = Object.assign(tipoProductoFound, tipoProductoData);
      await this.tipoProductoRepository.save(updatedTipoProducto);

      // Actualizar relaciones si se envían
      if (idSubCategorias && Array.isArray(idSubCategorias)) {
        // Eliminar relaciones antiguas
        await this.tipoProductoSubCategoriaRepository.delete({
          idTipoProducto: { idTipoProducto: id }
        });

        // Crear nuevas relaciones
        if (idSubCategorias.length > 0) {
          const relaciones = idSubCategorias.map(subCatId => ({
            idTipoProducto: tipoProductoFound,
            idSubCategoria: { idSubCategoria: subCatId }
          })) as DeepPartial<TipoProductoSubCategoria>[];

          await this.tipoProductoSubCategoriaRepository.save(relaciones);
        }
      }

      return await this.findOne(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Ya existe un tipo producto con esos datos.');
      }
      throw new InternalServerErrorException('Error interno al actualizar el tipo producto.');
    }
  }

  async remove(id: number) {
    try {
      // Verificar que existe
      const tipoProductoFound = await this.tipoProductoRepository.findOne({
        where: { idTipoProducto: id }
      });

      if (!tipoProductoFound) {
        throw new NotFoundException(`Tipo Producto con ID ${id} no existe`);
      }

      // Paso 1: Eliminar todas las relaciones en producto_tipo_producto
      await this.tipoProductoRepository
        .createQueryBuilder()
        .delete()
        .from('producto_tipo_producto')
        .where('id_tipo_producto = :id', { id })
        .execute();

      // Paso 2: Eliminar todas las relaciones en tipo_producto_sub_categoria
      await this.tipoProductoSubCategoriaRepository.delete({
        idTipoProducto: { idTipoProducto: id }
      });

      // Paso 3: Eliminar el tipo de producto
      const deleteResult = await this.tipoProductoRepository.delete({
        idTipoProducto: id
      });

      if (deleteResult.affected === 0) {
        throw new NotFoundException(`Tipo Producto con ID ${id} no existe`);
      }

      return { message: `Tipo Producto con ID ${id} eliminado correctamente` };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error.code === 'ECONNREFUSED' || error.code === 'PROTOCOL_CONNECTION_LOST') {
        throw new InternalServerErrorException('No se pudo conectar a la base de datos.');
      }

      throw new InternalServerErrorException('Error interno al eliminar el tipo de producto.');
    }
  }
}