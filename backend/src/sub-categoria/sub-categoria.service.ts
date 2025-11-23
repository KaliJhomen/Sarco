import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateSubCategoriaDto } from './dto/create-sub-categoria.dto';
import { UpdateSubCategoriaDto } from './dto/update-sub-categoria.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubCategoria } from './entities/sub-categoria.entity';

@Injectable()
export class SubCategoriaService {
  constructor(
    @InjectRepository(SubCategoria)
    private subCategoriaRepository: Repository<SubCategoria>,
  ) { }
  async create(createSubCategoriaDto: CreateSubCategoriaDto) {
    try {
      const subCategoria = this.subCategoriaRepository.create(createSubCategoriaDto);
      return await this.subCategoriaRepository.save(subCategoria);
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocurrió un error al crear la subcategoría',
      );
    }
  }

  async findAll(categoriaId?: number) {
    try {
      if (categoriaId && Number(categoriaId) > 0) {
        return await this.subCategoriaRepository.find({ where: { idCategoria: Number(categoriaId) } });
      }
      return await this.subCategoriaRepository.find();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Ocurrió un error al obtener las subcategorías',
      );
    }
  }
  async findOne(id: number) {
    return await this.subCategoriaRepository.findOne({ where: { idSubCategoria: id } });
  }

  async update(id: number, updateSubCategoriaDto: UpdateSubCategoriaDto) {
    return await this.subCategoriaRepository.update(id, updateSubCategoriaDto);
  }

  async remove(id: number) {
    return await this.subCategoriaRepository.delete(id);
  }
}