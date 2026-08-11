import { BadRequestException, HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { UpdateAgendaDto } from './dto/update-agenda.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agenda } from './entities/agenda.entity';
import { UpdateEstadoAgendaDto } from './dto/state-agenda.dto';

@Injectable()
export class AgendaService {
  private readonly logger = new Logger(AgendaService.name);

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
        relations: ['user'],
        select: {
          user: {
            idUser: true,
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

  async findOne(idAgenda: number) {
    return this.agendaRepository.findOne({
        where: { idAgenda },
      });
  }

  async findOneByUser(idUser: number) {
    const agenda = await this.agendaRepository.findOne({
      where: { idUsuario: idUser },
      relations: ['user'],
    });
      if (!agenda) {
        throw new NotFoundException(`Agenda de usuario con ID ${idUser} no encontrada`);
      }
      return agenda;
  }

  async update(idAgenda: number, updateAgendaDto: UpdateAgendaDto) {
    try {
      const agendaFound = await this.agendaRepository.findOneBy({ idAgenda });

      if (!agendaFound) {
        throw new NotFoundException(`Agenda con ID ${idAgenda} no encontrada`);
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

  async updateEstadoAgenda(idAgenda: number, updateEstadoAgendaDto: UpdateEstadoAgendaDto) {
    try {
      const agendaFound = await this.agendaRepository.findOneBy({ idAgenda });

      if (!agendaFound) {
        throw new NotFoundException(`Agenda con ID ${idAgenda} no encontrada`);
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

  async remove(idAgenda: number) {
    try {
      const result = await this.agendaRepository.delete(idAgenda);

      if (result.affected === 0) {
        throw new NotFoundException(`Agenda con ID ${idAgenda} no encontrada`);
      }
      return {
        message: `Agenda con ID ${idAgenda} eliminada correctamente`,
      };
    } catch (error) {
      this.logger.error('Error al eliminar agenda:', error);
    }
  }
}