import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { handleDBError } from '../common/execeptions/errors';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
  ) { }

  async create(createClienteDto: CreateClienteDto) {
    const existing = await this.clienteRepository.findOne({
      where:[
        {email: createClienteDto.email ?? undefined},
        /*
        {nombre: createClienteDto.nombre ?? undefined},
        */
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
      console.error(error); 
     throw handleDBError(error,'Ocurrió un error al guardar el cliente');
    }
  }

  async findAll() {
    try {
      return await this.clienteRepository.find({
        relations: ['documento','estadoCliente' ],
        select: {
          documento: {
            idDocumento: true,
            nombre: true
          },
          estadoCliente: {
            nombre: true
          },
        },
      });
    } catch (error) {
      handleDBError(error,'Ocurrió un error al obtener clientes');
    }
  }
  async findOne(idCliente: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOneBy({ idCliente });
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${idCliente} no encontrado`);
    }
    return cliente;
  }
  async findOneByEmail(email: string): Promise<Cliente | null> {
    return this.clienteRepository.findOneBy({ email: email });
  }

  async findOneWithRelations(id: number) {
    try {
      const clienteFound = await this.clienteRepository.findOne({
        where: { idCliente: id },
        relations: ["idDocumento2"],
        select: {
          documento: {
            idDocumento: true,
            nombre: true
          },
        },
      });
      if (!clienteFound) {
        throw new NotFoundException('cliente no encontrado');
      }

      return clienteFound;
    }
    catch (error) {
      handleDBError(error,'Ocurrió un error al obtener el cliente');
    }
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
      handleDBError(error,'Ocurrió un error al elimiar el cliente');
    }
  }

  async findWithFilters(qs: any) {
    const page = Number(qs.page) || 1;
    const limit = Math.min(Number(qs.limit) || 20, 200);
    const qb = this.clienteRepository.createQueryBuilder('c');

    if (qs.id) qb.andWhere('c.idCliente = :id', { id: qs.id });
    if (qs.idDocumento) qb.andWhere('c.idDocumento = :idDocumento', { idDocumento: qs.idDocumento });

    // case-insensitive searches compatible con MySQL/Postgres
    if (qs.numeroDocumento) qb.andWhere('LOWER(c.numeroDocumento) LIKE :num', { num: `%${String(qs.numeroDocumento).toLowerCase()}%` });
    if (qs.nombre) qb.andWhere('LOWER(c.nombre) LIKE :nombre', { nombre: `%${String(qs.nombre).toLowerCase()}%` });
    if (qs.direccion) qb.andWhere('LOWER(c.direccion) LIKE :direccion', { direccion: `%${String(qs.direccion).toLowerCase()}%` });
    if (qs.referencia) qb.andWhere('LOWER(c.referencia) LIKE :ref', { ref: `%${String(qs.referencia).toLowerCase()}%` });
    if (qs.telefono) qb.andWhere('LOWER(c.telefono) LIKE :tel', { tel: `%${String(qs.telefono).toLowerCase()}%` });
    if (qs.email) qb.andWhere('LOWER(c.email) LIKE :email', { email: `%${String(qs.email).toLowerCase()}%` });

    // estado viene como id de estado cliente
    if (qs.estado) qb.andWhere('c.idEstadoCliente = :estado', { estado: qs.estado });

    // quick full-text q across several columns (lowercased)
    if (qs.q) {
      const term = `%${String(qs.q).toLowerCase()}%`;
      qb.andWhere(
        '(LOWER(c.nombre) LIKE :term OR LOWER(c.numeroDocumento) LIKE :term OR LOWER(c.email) LIKE :term OR LOWER(c.telefono) LIKE :term)',
        { term },
      );
    }

    // safe sorting: whitelist columns
    const allowedSort = ['nombre', 'numeroDocumento', 'email', 'telefono', 'idCliente', 'createdAt'];
    if (qs.sortBy && allowedSort.includes(qs.sortBy)) {
      qb.orderBy(`c.${qs.sortBy}`, (qs.sortOrder || 'ASC').toUpperCase() as 'ASC' | 'DESC');
    } else {
      qb.orderBy('c.idCliente', 'DESC');
    }

    const [data, total] = await qb.skip((page - 1) * limit).take(limit).getManyAndCount();

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async filterWithBody(body: any) {
    // Por ahora delegamos a findWithFilters; aquí puedes implementar AND/OR complejos más adelante.
    return this.findWithFilters(body || {});
  }
}
