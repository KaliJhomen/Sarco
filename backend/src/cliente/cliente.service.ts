import { BadRequestException, HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { handleDBError } from '../common/exceptions/errors';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class ClienteService {
  private readonly logger = new Logger(ClienteService.name);

  constructor(
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
  ) { }
  async activateAccount(idCliente:number, login:string, email:string, clave:string){
    const cliente = await this.clienteRepository.findOne({ where: { idCliente } });
    if (!cliente) throw new NotFoundException(`Cliente con ID ${idCliente} no encontrado`);
    cliente.login = login;
    cliente.email = email;
    cliente.clave = clave;
    return this.clienteRepository.save(cliente);
  }
  async create(createClienteDto: CreateClienteDto) {
    const clave = createClienteDto.clave ?? '';
    const login = createClienteDto.login ?? createClienteDto.email ?? '';
    const existing = await this.clienteRepository.findOne({
      where:[
        {email: createClienteDto.email ?? undefined},
        {numeroDocumento: createClienteDto.numeroDocumento ?? undefined}
      ]
    });
    if (existing) {
      throw new BadRequestException('Ya hay registros con esta informacion');
    }
    try {
      const nuevoCliente = this.clienteRepository.create({...createClienteDto, login, clave});
      return await this.clienteRepository.save(nuevoCliente);
    } catch (error) {
      this.logger.error(error);
     throw handleDBError(error,'Ocurrió un error al guardar el cliente');
    }
  }

  async findAll() {
    try {
      const qb = this.clienteRepository.createQueryBuilder('c');
      return await this.selectFields(qb).getMany();
    } catch (error) {
      handleDBError(error, 'Ocurrió un error al obtener clientes');
    }
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
  
  findOneByNumeroDocumento(numeroDocumento: string) {   
    return this.clienteRepository.findOne({
      where: { numeroDocumento },
    });
  }
  findOneByLogin(login: string) {   
    return this.clienteRepository.findOne({
      where: { login },
    });
  }

  async findOneByEmail(email: string): Promise<Cliente | null> {
    return this.clienteRepository.findOneBy({ email });
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

  async update(idCliente: number, updateClienteDto: UpdateClienteDto) {
    const cliente = await this.clienteRepository.findOne({ where: { idCliente} });
    if (!cliente) throw new NotFoundException(`cliente con ID ${idCliente} no encontrado`);
    const patch: Partial<UpdateClienteDto> = {};
    for (const [key, value] of Object.entries(updateClienteDto)){
      if (value !== undefined && value !== null){
        (patch as Record<string, unknown>)[key] =value;
      }
    }
    const nuevoEmail = patch.email as string | undefined;
    const nuevoDocumento = patch.numeroDocumento as string | undefined;
    if (nuevoEmail || nuevoDocumento) {
      const dupe = await this.clienteRepository.findOne({
        where: [
          ...(nuevoEmail ? [{ email: nuevoEmail }] : []),
          ...(nuevoDocumento ? [{ numeroDocumento: nuevoDocumento }] : []),
        ],
      });
      if (dupe && dupe.idCliente !== idCliente) {
        throw new BadRequestException('Ya hay registros con esta información');
      }
    }
    if (patch.clave) {
    patch.clave = await bcryptjs.hash(patch.clave as string, 10);
    }
    Object.assign(cliente, patch);
    await this.clienteRepository.save(cliente);
    return await this.findOne(idCliente);
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
