import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TipoProducto } from './entities/tipo-producto.entity';
import { CreateTipoProductoDto } from './dto/create-tipo-producto.dto';
import { UpdateTipoProductoDto } from './dto/update-tipo-producto.dto';

import { TipoProductoSubCategoria } from 'src/TipoProductoSubCategoria/entities/tipo-producto-sub-categoria.entity';
import {SubCategoria} from 'src/sub-categoria/entities/sub-categoria.entity';

import { DeepPartial, Repository, SelectQueryBuilder} from 'typeorm';

@Injectable()
export class TipoProductoService {
  constructor(
    @InjectRepository(TipoProducto)
    private tipoProductoRepository: Repository<TipoProducto>,
    @InjectRepository(TipoProductoSubCategoria)
    private tipoProductoSubCategoriaRepository: Repository<TipoProductoSubCategoria>,
    @InjectRepository(SubCategoria)
    private subCategoriaRepository: Repository<SubCategoria>,
  ) { }
  async create(createTipoProductoDto: CreateTipoProductoDto) {
    try {
      const { idSubCategorias, ...tipoProductoData } = createTipoProductoDto;
      const tipoProducto = this.tipoProductoRepository.create(tipoProductoData);
      const tipoProductoGuardado = await this.tipoProductoRepository.save(tipoProducto);
      if (idSubCategorias && Array.isArray(idSubCategorias)) {
        const relaciones = idSubCategorias.map(id => ({
          idTipoProducto: tipoProductoGuardado,
          idSubCategoria: { idSubCategoria: id }
        })) as DeepPartial<TipoProductoSubCategoria>[];
      return await this.tipoProductoSubCategoriaRepository.save(relaciones);
    }}catch (error) {
      throw new InternalServerErrorException(
        'Ocurrió un error al crear el tipo producto',
      );
    }
  }
  async findAll() {
    try {
      return await this.tipoProductoRepository.find();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Ocurrió un error al obtener los tipos de producto',
      );
    }
  }

  async findAllFiltered(idProducto?: number, idSubCategoria?: number) {
    try {
      const qb = this.tipoProductoRepository.createQueryBuilder('tipoProducto');

      if (idSubCategoria && Number(idSubCategoria) > 0) {
        qb.innerJoin('tipoProducto.sub_categoria_tipo_productos', 'sctp')
          .andWhere('sctp.idSubCategoria = :subId', { subId: Number(idSubCategoria) });
      }

      if (idProducto && Number(idProducto) > 0) {
        qb.innerJoin('tipoProducto.producto_tipo_productos', 'ptprod')
          .andWhere('ptprod.idProducto = :prodId', { prodId: Number(idProducto) });
      }
      if (
        (!idSubCategoria || Number(idSubCategoria) <= 0) &&
        (!idProducto || Number(idProducto) <= 0)
      ) {
        return await this.findAll();
      }

      return await qb.getMany();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Ocurrió un error al obtener los tipos de producto filtrados',
      );
    }
  }
  findOne(id: number) {
    return `This action returns a #${id} tipoProducto`;
  }

  update(id: number, updateTipoProductoDto: UpdateTipoProductoDto) {
    return `This action updates a #${id} tipoProducto`;
  }

  remove(id: number) {
    return `This action removes a #${id} tipoProducto`;
  }
}