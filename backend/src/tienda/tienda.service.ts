import { Injectable, InternalServerErrorException, Logger, NotFoundException} from '@nestjs/common';
import { CreateTiendaDto } from './dto/create-tienda.dto';
import { UpdateTiendaDto } from './dto/update-tienda.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tienda } from './entities/tienda.entity';

@Injectable()
export class TiendaService {
  private readonly logger = new Logger(TiendaService.name);

  constructor(
    @InjectRepository(Tienda)
    private readonly tiendaRepository: Repository<Tienda>,
  ) {}

  async create(createTiendaDto: CreateTiendaDto) {
    try {
      const tienda = this.tiendaRepository.create(createTiendaDto);
      return await this.tiendaRepository.save(tienda);
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocurrió un error al crear la tienda',
      );
    }
  }

  async findAll() {
    try {
      return await this.tiendaRepository.find({
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocurrió un error al obtener las tiendas',
      );
    }
  }

  async findOne(id: number) {
    try {
      const tienda = await this.tiendaRepository.findOne({
        where: { idTienda: id }
      });

      if (!tienda) {
        throw new NotFoundException(`Tienda con ID ${id} no encontrado`);
      }

      return tienda;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw new InternalServerErrorException(
        `Error al obtener la tienda con ID ${id}`,
      );
    }  
  }

  async update(id: number, updateTiendaDto: UpdateTiendaDto) {
    try {
      const tienda = await this.tiendaRepository.preload({
        idTienda: id,
        ...updateTiendaDto,
      });
      if (!tienda) {
        throw new NotFoundException(`Tienda con ID ${id} no encontrado`);
      }
      return await this.tiendaRepository.save(tienda);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al actualizar la tienda con ID ${id}`,
      );
    }  
  }

  async remove(id: number) {
    try {
      const tienda = await this.tiendaRepository.findOne({ where: { idTienda: id } });
      if (!tienda) {
        throw new NotFoundException(`Tienda con ID ${id} no encontrado`);
      }
      await this.tiendaRepository.remove(tienda);
      return { message: `Tienda con ID ${id} eliminado correctamente` };
    } catch (error) {
      this.logger.error('Error en remove:', error);
      throw new InternalServerErrorException(
        `Error al eliminar la tienda con ID ${id}`,
      );
    }  }
}
