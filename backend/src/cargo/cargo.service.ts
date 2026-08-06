import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCargoDto } from './dto/create-cargo.dto';
import { UpdateCargoDto } from './dto/update-cargo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cargo } from './entities/cargo.entity';

@Injectable()
export class CargoService {
  constructor(
    @InjectRepository(Cargo)
    private cargoRepository: Repository<Cargo>,
  ) { }

  async create(createCargoDto: CreateCargoDto) {
    try {
      const newCargo = this.cargoRepository.create(createCargoDto);
      return await this.cargoRepository.save(newCargo);
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocurrió un error al guardar el cargo'
      );
    }
  }

  async findAll() {
    try {
      return await this.cargoRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocurrió un error al obtener los cargos',
      );
    }
  }

  async findOne(id: number) {
    try {
      const cargoFound = await this.cargoRepository.findOne({ where: { idCargo: id } });
      if (!cargoFound) {
        throw new NotFoundException(`Cargo con ID ${id} no existe`);
      }
      return cargoFound;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Ocurrió un error al obtener el cargo',
      );
    }
  }

  async update(id: number, updateCargoDto: UpdateCargoDto) {
    try {
      const cargoFound = await this.cargoRepository.findOne({
        where: { idCargo: id },
      });
      if (!cargoFound) {
        throw new NotFoundException(`Cargo con ID ${id} no existe`);
      }
      const updatedCargo = Object.assign(cargoFound, updateCargoDto);
      return await this.cargoRepository.save(updatedCargo);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Ocurrió un error al actualizar el cargo',
      );
    }
  }

  async remove(idCargo: number) {
    try {
      const deleteResult = await this.cargoRepository.delete(idCargo);

      if (deleteResult.affected === 0) {
        throw new NotFoundException(`Cargo con ID ${idCargo} no existe`);
      }

      return { message: 'Cargo eliminado correctamente' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      // Errores de conexión a la base de datos
      if (error.code === 'ECONNREFUSED' || error.code === 'PROTOCOL_CONNECTION_LOST') {
        throw new InternalServerErrorException('No se pudo conectar a la base de datos.');
      }

      throw new InternalServerErrorException('Error interno al eliminar el cargo.');
    }
  }

}
