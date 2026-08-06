import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { UpdateAgendaDto } from './dto/update-agenda.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agenda } from './entities/agenda.entity';
import { UpdateEstadoAgendaDto } from './dto/state-agenda.dto';

@Injectable()
export class AgendaService {
  constructor(
    @InjectRepository(Agenda)
    private agendaRepository: Repository<Agenda>,
  ) { }

  async create(createAgendaDto: CreateAgendaDto) {
    try {
      const newAgenda = this.agendaRepository.create(createAgendaDto);
      return await this.agendaRepository.save(newAgenda);
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocurrió un error al guardar la agenda',
      );
    }
  }


  async findAll() {
    try {
      return await this.agendaRepository.find({
        relations: ['idUsuario2'],
        select: {
          idUsuario2: {
            idUsuario: true,
            nombre: true,
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocurrió un error al obtener las agendas',
      );
    }
  }

  async findOne(id: number) {
    try {
      const agendaFound = await this.agendaRepository.findOne({
        where: { id },
        relations: ['idUsuario2'],
        select: {
          idUsuario2: {
            idUsuario: true,
            nombre: true,
          },
        },
      });

      if (!agendaFound) {
        throw new NotFoundException(`Agenda con ID ${id} no encontrada`);
      }

      return agendaFound;
    } catch (error) {
      if (error.code === 'ECONNREFUSED' || error.code === 'PROTOCOL_CONNECTION_LOST') {
        throw new InternalServerErrorException('No se pudo conectar a la base de datos.');
      }
      throw new InternalServerErrorException('Error interno al obtener la agenda.');
    }
  }


  async update(id: number, updateAgendaDto: UpdateAgendaDto) {
    try {
      const agendaFound = await this.agendaRepository.findOneBy({ id });

      if (!agendaFound) {
        throw new NotFoundException(`Agenda con ID ${id} no encontrada`);
      }

      const updatedAgenda = Object.assign(agendaFound, updateAgendaDto);

      return await this.agendaRepository.save(updatedAgenda);
    } catch (error) {
 
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Ya existe una agenda con esos datos.');
      }
      throw new InternalServerErrorException('Error interno al actualizar la agenda.');
    }
  }

  async updateEstadoAgenda(id: number, updateEstadoAgendaDto: UpdateEstadoAgendaDto) {
    try {
      const agendaFound = await this.agendaRepository.findOneBy({ id });

      if (!agendaFound) {
        throw new NotFoundException(`Agenda con ID ${id} no encontrada`);
      }

      const updatedEstadoAgenda = Object.assign(agendaFound, updateEstadoAgendaDto);

      return await this.agendaRepository.save(updatedEstadoAgenda);
    } catch (error) {
 
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Ya existe una agenda con esos datos.');
      }
      throw new InternalServerErrorException('Error interno al actualizar la agenda.');
    }
  }

  async remove(id: number) {
    try {
      const result = await this.agendaRepository.delete(id);

      if (result.affected === 0) {
        throw new NotFoundException(`Agenda con ID ${id} no encontrada`);
      }

      return {
        message: `Agenda con ID ${id} eliminada correctamente`,
      };
    } catch (error) {
      console.error('Error al eliminar agenda:', error);

      // 👉 Si ya es una excepción HTTP (como NotFoundException), la relanzamos
      if (error instanceof HttpException) {
        throw error;
      }

      // Errores de conexión a la base de datos
      if (error.code === 'ECONNREFUSED' || error.code === 'PROTOCOL_CONNECTION_LOST') {
        throw new InternalServerErrorException('No se pudo conectar a la base de datos.');
      }

      // Error genérico
      throw new InternalServerErrorException('Error interno al eliminar la agenda.');
    }

  }
}