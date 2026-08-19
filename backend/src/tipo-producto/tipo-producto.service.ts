import { BadRequestException, HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TipoProducto } from './entities/tipo-producto.entity';
import { CreateTipoProductoDto } from './dto/create-tipo-producto.dto';
import { UpdateTipoProductoDto } from './dto/update-tipo-producto.dto';

import { SubCategoriaTipoProducto } from '../sub-categoria-tipo-producto/entities/sub-categoria-tipo-producto.entity';
import { SubCategoria } from '../sub-categoria/entities/sub-categoria.entity';

import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class TipoProductoService {
  private readonly logger = new Logger(TipoProductoService.name);

  constructor(
    @InjectRepository(TipoProducto)
    private tipoProductoRepository: Repository<TipoProducto>,
    @InjectRepository(SubCategoriaTipoProducto)
    private tipoProductoSubCategoriaRepository: Repository<SubCategoriaTipoProducto>,
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
          tipoProducto: tipoProductoGuardado,
          subCategoria: { idSubCategoria: id }
        })) as DeepPartial<SubCategoriaTipoProducto>[];
        
        await this.tipoProductoSubCategoriaRepository.save(relaciones);
      }
      
      return tipoProductoGuardado;
    } catch (error) {
      this.logger.error('Error al crear tipo producto:', error);
      throw new InternalServerErrorException(
        'Ocurrió un error al crear el tipo producto',
      );
    }
  }

  async findAll() {
    try {
      return await this.tipoProductoRepository.find({
        relations: ['subCategoriaTipoProductos', 'subCategoriaTipoProductos.subCategoria']
      });
    } catch (error) {
      this.logger.error('Error al obtener tipos de producto:', error);
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
        .leftJoinAndSelect('tipoProducto.subCategoriaTipoProductos', 'sctp')
        .leftJoinAndSelect('sctp.subCategoria', 'subcat');

      if (idSubCategoria && Number(idSubCategoria) > 0) {
        qb.andWhere('sctp.idSubCategoria = :subId', { subId: Number(idSubCategoria) });
      }

      if (idProducto && Number(idProducto) > 0) {
        qb.innerJoin('tipoProducto.productoTipoProducto', 'ptprod')
          .andWhere('ptprod.idProducto = :prodId', { prodId: Number(idProducto) });
      }

      return qb.getMany();
    } catch (error) {
      this.logger.error('ERROR en findAllFiltered:', {
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
        relations: ['subCategoriaTipoProductos', 'subCategoriaTipoProductos.subCategoria']
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

  async update(idTipoProducto: number, updateTipoProductoDto: UpdateTipoProductoDto) {
    try {
      const tipoProductoFound = await this.tipoProductoRepository.findOne({
        where: { idTipoProducto}
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
          tipoProducto: { idTipoProducto }
        });

        // Crear nuevas relaciones
        if (idSubCategorias.length > 0) {
          const relaciones = idSubCategorias.map(subCatId => ({
            tipoProducto: tipoProductoFound,
            subCategoria: { idSubCategoria: subCatId }
          })) as DeepPartial<SubCategoriaTipoProducto>[];

          await this.tipoProductoSubCategoriaRepository.save(relaciones);
        }
      }

      return await this.findOne(idTipoProducto);
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

  async remove(idTipoProducto: number) {
    try {
      // Verificar que existe
      const tipoProductoFound = await this.tipoProductoRepository.findOne({
        where: { idTipoProducto }
      });

      if (!tipoProductoFound) {
        throw new NotFoundException(`Tipo Producto con ID ${idTipoProducto} no existe`);
      }

      // Paso 1: Eliminar todas las relaciones en producto_tipo_producto
      await this.tipoProductoRepository
        .createQueryBuilder()
        .delete()
        .from('producto_tipo_producto')
        .where('id_tipo_producto = :id', { idTipoProducto })
        .execute();

      // Paso 2: Eliminar todas las relaciones en tipo_producto_sub_categoria
      await this.tipoProductoSubCategoriaRepository.delete({
        tipoProducto: { idTipoProducto }
      });

      // Paso 3: Eliminar el tipo de producto
      const deleteResult = await this.tipoProductoRepository.delete({
        idTipoProducto
      });

      if (deleteResult.affected === 0) {
        throw new NotFoundException(`Tipo Producto con ID ${idTipoProducto} no existe`);
      }

      return { message: `Tipo Producto con ID ${idTipoProducto} eliminado correctamente` };
    } catch (error : any) {
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