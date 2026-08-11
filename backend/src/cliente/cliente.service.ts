import { BadRequestException, HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { handleDBError } from '../common/exceptions/errors';

@Injectable()
export class ClienteService {
  private readonly logger = new Logger(ClienteService.name);

  constructor(
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
  ) { }

  async create(createClienteDto: CreateClienteDto) {
    const existing = await this.clienteRepository.findOne({
      where:[
        {email: createClienteDto.email ?? undefined},
  
        {nombre: createClienteDto.nombre ?? undefined},
        
        {numeroDocumento: createClienteDto.numeroDocumento}
      ]
    });
    if (existing) {
      throw new BadRequestException('Ya hay registros con esta informacion');
    }
    try {
      const newCliente = this.clienteRepository.create(createClienteDto);
      return await this.clienteRepository.save(newCliente);
    } catch (error) {
      this.logger.error(error);
     throw handleDBError(error,'Ocurrió un error al guardar el cliente');
    }
  }

  private selectFields(qb: any) {
    return qb
      .leftJoinAndSelect('c.documento', 'd')
      .leftJoinAndSelect('c.estadoCliente', 'ec')
      .select([
        'c.idCliente', 'c.nombre', 'c.numeroDocumento',
        'c.direccion', 'c.telefono', 'c.email',
        'd.idDocumento', 'd.nombre',
        'ec.nombre',
      ]);
  }

  async findAll() {
    try {
      const qb = this.clienteRepository.createQueryBuilder('c');
      return await this.selectFields(qb).getMany();
    } catch (error) {
      handleDBError(error, 'Ocurrió un error al obtener clientes');
    }
  }

  async findWithFilters(qs: any) {
    if (qs.id) return this.findOne(+qs.id);

    const page = Number(qs.page) || 1;
    const limit = Math.min(Number(qs.limit) || 20, 200);
    const qb = this.clienteRepository.createQueryBuilder('c');

    if (qs.idDocumento) qb.andWhere('c.idDocumento = :idDocumento', { idDocumento: qs.idDocumento });

    if (qs.numeroDocumento) qb.andWhere('LOWER(c.numeroDocumento) LIKE :num', { num: `%${String(qs.numeroDocumento).toLowerCase()}%` });
    if (qs.nombre) qb.andWhere('LOWER(c.nombre) LIKE :nombre', { nombre: `%${String(qs.nombre).toLowerCase()}%` });
    if (qs.direccion) qb.andWhere('LOWER(c.direccion) LIKE :direccion', { direccion: `%${String(qs.direccion).toLowerCase()}%` });
    if (qs.referencia) qb.andWhere('LOWER(c.referencia) LIKE :ref', { ref: `%${String(qs.referencia).toLowerCase()}%` });
    if (qs.telefono) qb.andWhere('LOWER(c.telefono) LIKE :tel', { tel: `%${String(qs.telefono).toLowerCase()}%` });
    if (qs.email) qb.andWhere('LOWER(c.email) LIKE :email', { email: `%${String(qs.email).toLowerCase()}%` });

    if (qs.estado) qb.andWhere('c.idEstadoCliente = :estado', { estado: qs.estado });

    if (qs.q) {
      const term = `%${String(qs.q).toLowerCase()}%`;
      qb.andWhere(
        '(LOWER(c.nombre) LIKE :term OR LOWER(c.numeroDocumento) LIKE :term OR LOWER(c.email) LIKE :term OR LOWER(c.telefono) LIKE :term)',
        { term },
      );
    }

    const allowedSort = ['nombre', 'numeroDocumento', 'email', 'telefono', 'idCliente', 'createdAt'];
    if (qs.sortBy && allowedSort.includes(qs.sortBy)) {
      qb.orderBy(`c.${qs.sortBy}`, (qs.sortOrder || 'ASC').toUpperCase() as 'ASC' | 'DESC');
    } else {
      qb.orderBy('c.idCliente', 'DESC');
    }

    const [data, total] = await this.selectFields(qb).skip((page - 1) * limit).take(limit).getManyAndCount();

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: number) {
    const qb = this.clienteRepository.createQueryBuilder('c')
      .where('c.idCliente = :id', { id });
    const cliente = await this.selectFields(qb).getOne();
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    return cliente;
  }

  async update(idCliente: number, updateClienteDto: UpdateClienteDto) {
    try {
      if (updateClienteDto.email || updateClienteDto.nombre || updateClienteDto.numeroDocumento) {
      const existing = await this.clienteRepository.findOne({ 
        where: [
          { email: updateClienteDto.email ?? undefined}, 
          { nombre: updateClienteDto.nombre ?? undefined},
          { numeroDocumento: updateClienteDto.numeroDocumento ?? undefined},
        ] 
      });
      if (existing && existing.idCliente !== idCliente) {
        throw new BadRequestException('Ya hay registros con esta informacion');
      }
      }
      const updatedCliente = Object.assign(updateClienteDto);
      return await this.clienteRepository.save({ idCliente, updatedCliente});
    } catch (error) {
      handleDBError(error,'Ocurrió un error al actualizar el cliente');
    }
  }

  async remove(idCliente: number) {
    try {
      const deleteResult = await this.clienteRepository.delete(idCliente);
      if (deleteResult.affected === 0) {
        throw new NotFoundException(`Cliente con ID ${idCliente} no encontrado`);
      }
      return { message: `Cliente con ID ${idCliente} eliminado correctamente` };
    } catch (error) {
      throw handleDBError(error, 'Ocurrió un error al eliminar el cliente');
    }
  }
  async filterWithBody(body: any) {
    // Por ahora delegamos a findWithFilters; aquí puedes implementar AND/OR complejos más adelante.
    return this.findWithFilters(body || {});
  }
}
