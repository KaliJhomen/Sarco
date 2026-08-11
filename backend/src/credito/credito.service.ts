import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCreditoDto } from './dto/create-credito.dto';
import { UpdateCreditoDto } from './dto/update-credito.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Credito } from './entities/credito.entity';
import { handleDBError } from '../common/exceptions/errors';

@Injectable()
export class CreditoService {
  constructor(
    @InjectRepository(Credito)
    private creditoRepository: Repository<Credito>,
  ) { }

  async create(createCreditoDto: CreateCreditoDto) {
    try {
      const newCredito = this.creditoRepository.create(createCreditoDto);
      return await this.creditoRepository.save(newCredito);
    } catch (error) {
      handleDBError(error, 'Ocurrió un error al guardar el crédito');
    }
  }

  async findAll() {
    try {
      return await this.creditoRepository.find({
        relations: ['cliente', 'tienda', 'usuario', 'metodoPago', 'estadoCredito', 'comprobante', 'clienteGarante'],
      });
    }
    catch (error) {
      handleDBError(error, 'Ocurrió un error al obtener los créditos');
    }
  }

  async findOne(idCredito: number) {
    try {
      const found = await this.creditoRepository.findOne({
        where: { idCredito },
        relations: ['cliente', 'tienda', 'usuario', 'metodoPago', 'estadoCredito', 'comprobante', 'clienteGarante'],
      });
      if (!found) {
        throw new NotFoundException('Crédito no encontrado');
      }
      return found;
    } catch (error) {
      handleDBError(error, 'Ocurrió un error al obtener el crédito');
    }
  }

  async update(id: number, updateCreditoDto: UpdateCreditoDto) {
    try {
      const found = await this.creditoRepository.findOneBy({ idCredito: id });
      if (!found) {
        throw new NotFoundException('Crédito no encontrado');
      }
      const updated = Object.assign(found, updateCreditoDto);
      return await this.creditoRepository.save(updated);
    } catch (error) {
      handleDBError(error, 'Ocurrió un error al actualizar el crédito');
    }
  }

  async remove(id: number) {
    try {
      const deleted = await this.creditoRepository.delete({ idCredito: id });
      if (deleted.affected === 0) {
        throw new NotFoundException('Crédito no encontrado');
      }
      return { message: 'Crédito eliminado correctamente' };
    } catch (error) {
      handleDBError(error, 'Ocurrió un error al eliminar el crédito');
    }
  }
}
