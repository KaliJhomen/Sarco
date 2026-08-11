import { Injectable, BadRequestException, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateGarantiaDto } from './dto/create-garantia.dto';
import { UpdateGarantiaDto } from './dto/update-garantia.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Garantia } from './entities/garantia.entity';

@Injectable()
export class GarantiaService {
  private readonly logger = new Logger(GarantiaService.name);

  constructor(
    @InjectRepository(Garantia)
    private readonly garantiaRepository: Repository<Garantia>,
  ) {}

  async create(createGarantiaDto: CreateGarantiaDto) {
    if ((createGarantiaDto as any)?.idArticulo !== undefined) {
      throw new BadRequestException('Campo idArticulo no permitido. Use idProducto.');
    }
    if (createGarantiaDto?.idProducto === undefined || createGarantiaDto?.idProducto === null) {
      throw new BadRequestException('idProducto es requerido.');
    }
    const garantia = this.garantiaRepository.create(createGarantiaDto);
    return await this.garantiaRepository.save(garantia);
  }

  async findAll() {
    try {
      return await this.garantiaRepository.find({
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocurrió un error al obtener las garantías',
      );
    }
  }

  async findOne(id: number) {
    try {
      const garantia= await this.garantiaRepository.findOne({ where: { idGarantia: id }
      });

      if (!garantia) {
        throw new NotFoundException(`Garantia con ID ${id} no encontrado`);
      }
      return garantia;
    } catch (error) {      
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error al obtener la garantia con ID ${id}`,
      );
    }  
  }

  async update(id: number, updateGarantiaDto: UpdateGarantiaDto) {
    try {
      const garantia = await this.garantiaRepository.preload({
        idGarantia: id,
        ...updateGarantiaDto,
      });
      if (!garantia) {
        throw new NotFoundException(`Garantia con ID ${id} no encontrado`);
      }
      return await this.garantiaRepository.save(garantia);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al actualizar la garantia con ID ${id}`,
      );
    }
  }

  async remove(id: number) {
    try {
      const garantia = await this.garantiaRepository.findOne({ where: { idGarantia: id } });
      if (!garantia) {
        throw new NotFoundException(`Garantia con ID ${id} no encontrado`);
      }
      await this.garantiaRepository.remove(garantia);
      return { message: `Garantia con ID ${id} eliminado correctamente` };
    } catch (error) {
      this.logger.error('Error en remove:', error);
      throw new InternalServerErrorException(
        `Error al eliminar la garantia con ID ${id}`,
      );
    }  }
}
