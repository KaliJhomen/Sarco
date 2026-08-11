import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Marca } from './entities/marca.entity';

@Injectable()
export class MarcaService {
  private readonly logger = new Logger(MarcaService.name);

  constructor(
    @InjectRepository(Marca)
    private marcaRepository: Repository<Marca>,
  ) {}
  
  async create(createMarcaDto: CreateMarcaDto) {
    try{
      const marca = this.marcaRepository.create(createMarcaDto);
      return this.marcaRepository.save(marca);
    } catch(error){
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.marcaRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocurrió un error al obtener las marcas',
      );
    }  }

  async findOne(id: number) {
    try {
      const marca = await this.marcaRepository.findOne({
        where: { idMarca: id } 
      });

      if (!marca) {
        throw new NotFoundException(`Marca con ID ${id} no encontrado`);
      }
      return marca;
    } catch (error) {      
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw new InternalServerErrorException(
        `Error al obtener la marca con ID ${id}`,
      );
    }  }


  async update(id: number, updateMarcaDto: UpdateMarcaDto) {
    try {
      const marca = await this.marcaRepository.preload({
        idMarca: id,
        ...updateMarcaDto,
      });
      if (!marca) {
        throw new NotFoundException(`Marca con ID ${id} no encontrado`);
      }
      return await this.marcaRepository.save(marca);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al actualizar la marca con ID ${id}`,
      );
    }  
  }

  async remove(id: number) {
    try {
      const marca = await this.marcaRepository.findOne({ where: { idMarca: id } });
      if (!marca) {
        throw new NotFoundException(`Marca con ID ${id} no encontrado`);
      }
      await this.marcaRepository.remove(marca);
      return { message: `Marca con ID ${id} eliminado correctamente` };
    } catch (error) {
      this.logger.error('Error en remove:', error);
      throw new InternalServerErrorException(
        `Error al eliminar la marca con ID ${id}`,
      );
    }  
  }
}
