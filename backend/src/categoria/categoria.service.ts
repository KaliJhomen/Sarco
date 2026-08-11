import { BadRequestException, HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { SubCategoria } from '../sub-categoria/entities/sub-categoria.entity'; // ✅ Importar

@Injectable()
export class CategoriaService {
  private readonly logger = new Logger(CategoriaService.name);

  constructor(
    @InjectRepository(Categoria)
    private categoriaRepository: Repository<Categoria>,
    @InjectRepository(SubCategoria) // ✅ Inyectar
    private subCategoriaRepository: Repository<SubCategoria>,
  ) { }

  async create(createCategoriaDto: CreateCategoriaDto) {
    try {
      const newCategoria = this.categoriaRepository.create(createCategoriaDto);
      return await this.categoriaRepository.save(newCategoria);
    } catch (error) {
      this.logger.error('Error al crear categoría:', error);
      throw new InternalServerErrorException(
        'Ocurrió un error al guardar la categoría'
      );
    }
  }

  async findAll() {
    try {
      return await this.categoriaRepository.find({
        relations: ['subCategorias'], // ✅ Verificar nombre correcto en entidad
        order: { nombre: 'ASC' }
      });
    } catch (error) {
      this.logger.error('Error al obtener categorías:', error);
      throw new InternalServerErrorException(
        'Ocurrió un error al obtener las categorías',
      );
    }
  }

  async findOne(id: number) {
    try {
      const categoriaFound = await this.categoriaRepository.findOne({
        where: { idCategoria: id },
        relations: ['subCategorias'] // ✅ Nombre correcto
      });

      if (!categoriaFound) {
        throw new NotFoundException('Categoría no encontrada');
      }

      return categoriaFound;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error interno al obtener la categoría',
      );
    }
  }

  async update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    try {
      const categoriaFound = await this.categoriaRepository.findOne({
        where: { idCategoria: id }
      });

      if (!categoriaFound) {
        throw new NotFoundException('Categoría no encontrada');
      }

      const updatedCategoria = Object.assign(categoriaFound, updateCategoriaDto);
      return await this.categoriaRepository.save(updatedCategoria);
    } catch (error) {
      if (error instanceof HttpException) { 
        throw error;
      }
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Ya existe una categoría con esos datos.');
      }
      throw new InternalServerErrorException('Error interno al actualizar la categoría.');
    }
  }

  async remove(id: number) {
    try {
      // Verificar que existe primero
      const categoriaFound = await this.categoriaRepository.findOne({
        where: { idCategoria: id },
        relations: ['subCategorias'] // ✅ Nombre correcto
      });

      if (!categoriaFound) {
        throw new NotFoundException(`Categoría con ID ${id} no existe`);
      }

      // ✅ Verificar si hay subcategorías y productos asociados
      if (categoriaFound.subCategorias && categoriaFound.subCategorias.length > 0) {
        throw new BadRequestException(
          `No se puede eliminar la categoría porque tiene ${categoriaFound.subCategorias.length} subcategoría(s) asociada(s)`
        );
      }

      // Eliminar la categoría
      const deleteResult = await this.categoriaRepository.delete({ idCategoria: id });

      if (deleteResult.affected === 0) {
        throw new NotFoundException(`Categoría con ID ${id} no existe`);
      }

      return { message: `Categoría con ID ${id} eliminada correctamente` };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error.code === 'ECONNREFUSED' || error.code === 'PROTOCOL_CONNECTION_LOST') {
        throw new InternalServerErrorException('No se pudo conectar a la base de datos.');
      }

      throw new InternalServerErrorException('Error interno al eliminar la categoría.');
    }
  }
}