import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';

import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

import { ProductoTipoProducto } from '../producto-tipo-producto/entities/producto-tipo-producto.entity';
import { TipoProducto } from '../tipo-producto/entities/tipo-producto.entity';

export interface ProductoFiltros {
  idCategoria?: number;
  idSubCategoria?: number;
  idTipoProducto?: number;
  idMarca?: number;
  idMarcaList?: number[];
  idTiendaList?: number[];
  categoriaNombre?: string;
  subCategoriaNombre?: string;
  tipoProductoNombre?: string;
  categoriasNombres?: string[];
  subcategoriasNombres?: string[];
  tiposNombres?: string[];
  priceMin?: number;
  priceMax?: number;
  page?: number;
  limit?: number;
  busqueda?: string;
  hasDiscount?: boolean;
}

@Injectable()
export class ProductoService {

  private readonly logger = new Logger(ProductoService.name);

  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,

    @InjectRepository(ProductoTipoProducto)
    private productoTipoProductoRepository: Repository<ProductoTipoProducto>,

    @InjectRepository(TipoProducto)
    private tipoProductoRepository: Repository<TipoProducto>,

    private dataSource: DataSource,
  ) { }

  async create(createProductoDto: CreateProductoDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { idTiposProducto, estado, ...productoData } = createProductoDto;
      const producto = this.productoRepository.create({
        ...productoData,
        ...(estado !== undefined && { estado: Number(estado) as any }),
      });
      const productoGuardado = await queryRunner.manager.save(producto);

      if (idTiposProducto && Array.isArray(idTiposProducto) && idTiposProducto.length > 0) {
        const relaciones = idTiposProducto.map(id => ({
          producto: productoGuardado,
          tipoProducto: { idTipoProducto: id },
        }));
        await queryRunner.manager.save(relaciones);
      }

      await queryRunner.commitTransaction();
      return productoGuardado;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error al crear producto:', error);
      throw new InternalServerErrorException('Ocurrió un error al crear el producto');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    try {
      const productos = await this.productoRepository
        .createQueryBuilder('producto')
        .leftJoinAndSelect('producto.marca', 'm')
        .leftJoinAndSelect('producto.productoTipoProductos', 'ptp')
        .leftJoinAndSelect('ptp.tipoProducto', 'tp')
        .leftJoinAndSelect('tp.tipoProductoSubCategorias', 'tpsc')
        .leftJoinAndSelect('tpsc.subCategoria', 'sc')
        .leftJoinAndSelect('sc.categoria', 'c')
        .leftJoinAndSelect('producto.productoTiendas', 'pt')
        .leftJoinAndSelect('pt.tienda', 't')
        .where('producto.estado = :estado', { estado: true })
        .getMany();

      return productos.map(p => ({
        idProducto: p.idProducto,
        nombre: p.nombre,
        modelo: p.modelo,
        descripcion: p.descripcion,
        stock: p.stock,
        imagen: p.imagen,
        precioTope: p.precioTope,
        precioVenta: p.precioVenta,
        estado: p.estado,
        fechaIngreso: p.fechaIngreso,
        garantiaFabrica: p.garantiaFabrica,
        descuento: p.descuento,
        marca: p.marca?.nombre ?? null,
        categoria: p.productoTipoProductos?.[0]?.tipoProducto?.tipoProductoSubCategorias?.[0]?.subCategoria?.categoria?.nombre ?? null,
      }));
    } catch (error) {
      this.logger.error('Error en findAll:', error);
      throw new InternalServerErrorException('Ocurrió un error al obtener los productos');
    }
  }

  async findProductosFiltros(filtros: ProductoFiltros) {
    try {
      const query = this.buildProductoQuery(filtros);
      this.applyPagination(query, filtros);
      const [productos] = await query.getManyAndCount();
    return productos.map(p => ({
      idProducto: p.idProducto,
      nombre: p.nombre,
      modelo: p.modelo,
      descripcion: p.descripcion,
      stock: p.stock,
      imagen: p.imagen,
      precioTope: p.precioTope,
      precioVenta: p.precioVenta,
      estado: p.estado,
      fechaIngreso: p.fechaIngreso,
      garantiaFabrica: p.garantiaFabrica,
      descuento: p.descuento,
      marca: p.marca?.nombre ?? null,
      categoria: p.productoTipoProductos?.[0]?.tipoProducto?.tipoProductoSubCategorias?.[0]?.subCategoria?.categoria?.nombre ?? null,
    }));
  } catch (error) {
    this.logger.error('Error en findProductosFiltros:', error);
    throw new InternalServerErrorException('Error interno del servidor.');
  }
}

  private buildProductoQuery(filtros: ProductoFiltros): SelectQueryBuilder<Producto> {
    const query = this.productoRepository
      .createQueryBuilder('producto')
      .leftJoinAndSelect('producto.marca', 'marca')
      .leftJoinAndSelect('producto.productoTipoProductos', 'ptp')
      .leftJoinAndSelect('ptp.tipoProducto', 'tp')
      .leftJoinAndSelect('tp.tipoProductoSubCategorias', 'tpsc')
      .leftJoinAndSelect('tpsc.subCategoria', 'sc')
      .leftJoinAndSelect('sc.categoria', 'categoria')
      .leftJoinAndSelect('producto.productoTiendas', 'pt')
      .leftJoinAndSelect('pt.tienda', 'tienda');

    this.applyFilters(query, filtros);
    this.applySearchFilter(query, filtros);
    this.applyPriceFilters(query, filtros);

    return query;
  }

  private applyFilters(query: SelectQueryBuilder<Producto>, filtros: ProductoFiltros) {
    if (filtros.idMarca)
      query.andWhere('marca.idMarca = :idMarca', { idMarca: filtros.idMarca });

    if (filtros.idMarcaList && filtros.idMarcaList.length)
      query.andWhere('marca.idMarca IN (:...idMarcaList)', { idMarcaList: filtros.idMarcaList });

    if (filtros.idTipoProducto)
      query.andWhere('tp.idTipoProducto = :idTipoProducto', { idTipoProducto: filtros.idTipoProducto });

    if (filtros.idSubCategoria)
      query.andWhere('sc.idSubCategoria = :idSubCategoria', { idSubCategoria: filtros.idSubCategoria });

    if (filtros.idCategoria)
      query.andWhere('categoria.idCategoria = :idCategoria', { idCategoria: filtros.idCategoria });

    if (filtros.idTiendaList && filtros.idTiendaList.length)
      query.andWhere('tienda.idTienda IN (:...idTiendaList)', { idTiendaList: filtros.idTiendaList });

    if (filtros.categoriaNombre)
      query.andWhere('LOWER(categoria.nombre) = :categoriaNombre', { categoriaNombre: filtros.categoriaNombre.toLowerCase() });
    if (filtros.subCategoriaNombre)
      query.andWhere('LOWER(sc.nombre) = :subCategoriaNombre', { subCategoriaNombre: filtros.subCategoriaNombre.toLowerCase() });
    if (filtros.tipoProductoNombre)
      query.andWhere('LOWER(tp.nombre) = :tipoProductoNombre', { tipoProductoNombre: filtros.tipoProductoNombre.toLowerCase() });

    if (filtros.categoriasNombres && filtros.categoriasNombres.length > 0) {
      query.andWhere('LOWER(categoria.nombre) IN (:...categoriasNombres)', {
        categoriasNombres: filtros.categoriasNombres.map(n => n.toLowerCase()),
      });
    }

    if (filtros.subcategoriasNombres && filtros.subcategoriasNombres.length > 0) {
      query.andWhere('LOWER(sc.nombre) IN (:...subcategoriasNombres)', {
        subcategoriasNombres: filtros.subcategoriasNombres.map(n => n.toLowerCase()),
      });
    }

    if (filtros.tiposNombres && filtros.tiposNombres.length > 0) {
      query.andWhere('LOWER(tp.nombre) IN (:...tiposNombres)', {
        tiposNombres: filtros.tiposNombres.map(n => n.toLowerCase()),
      });
    }

    if (filtros.hasDiscount === true) {
      query.andWhere('producto.descuento > :minDiscount', { minDiscount: 0 });
    }
  }

  private applyPriceFilters(query: SelectQueryBuilder<Producto>, filtros: ProductoFiltros) {
    if (typeof filtros.priceMin === 'number')
      query.andWhere('producto.precioVenta >= :priceMin', { priceMin: filtros.priceMin });
    if (typeof filtros.priceMax === 'number')
      query.andWhere('producto.precioVenta <= :priceMax', { priceMax: filtros.priceMax });
  }

  private applySearchFilter(query: SelectQueryBuilder<Producto>, filtros: ProductoFiltros) {
    if (!filtros.busqueda) return;

    const escaped = filtros.busqueda
      .replace(/%/g, '\\%')
      .replace(/_/g, '\\_');

    query.andWhere(
      `(
        producto.nombre LIKE :busqueda ESCAPE '\\'
        OR producto.modelo LIKE :busqueda ESCAPE '\\'
        OR producto.descripcion LIKE :busqueda ESCAPE '\\'
        OR marca.nombre LIKE :busqueda ESCAPE '\\'
        OR categoria.nombre LIKE :busqueda ESCAPE '\\'
        OR sc.nombre LIKE :busqueda ESCAPE '\\'
        OR tp.nombre LIKE :busqueda ESCAPE '\\'
      )`,
      { busqueda: `%${escaped}%` }
    );
  }

  private applyPagination(query: SelectQueryBuilder<Producto>, filtros: ProductoFiltros) {
    const limit = Math.min(Math.max(filtros.limit || 20, 1), 100);
    const page = Math.max(filtros.page || 1, 1);

    query.take(limit);
    if (page > 1) {
      query.skip((page - 1) * limit);
    }
  }

  async findOne(id: number) {
    try {
      const producto = await this.productoRepository.findOne({
        where: { idProducto: id },
        relations: [
          'marca',
          'productoColores',
          'productoColores.color',
          'productoTipoProductos',
          'productoTipoProductos.tipoProducto',
          'productoTipoProductos.tipoProducto.tipoProductoSubCategorias',
          'productoTipoProductos.tipoProducto.tipoProductoSubCategorias.subCategoria',
          'productoTipoProductos.tipoProducto.tipoProductoSubCategorias.subCategoria.categoria',
          'productoTiendas',
          'productoTiendas.tienda',
        ],
      });

      if (!producto) {
        throw new NotFoundException(`Producto con ID ${id} no encontrado`);
      }

      return producto;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(`Error en findOne (id: ${id}):`, error);
      throw new InternalServerErrorException(`Error al obtener el producto con ID ${id}`);
    }
  }

  async update(idProducto: number, updateProductoDto: UpdateProductoDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { idTiposProducto, estado, ...camposProducto } = updateProductoDto;

      const producto = await queryRunner.manager.preload(Producto, {
        idProducto,
        ...camposProducto,
        ...(estado !== undefined && { estado: Number(estado) as any }),
      });

      if (!producto) {
        throw new NotFoundException(`Producto con ID ${idProducto} no encontrado`);
      }

      const productoGuardado = await queryRunner.manager.save(producto);

      if (Array.isArray(idTiposProducto)) {
        await queryRunner.manager.delete(ProductoTipoProducto, { producto: { idProducto } });

        if (idTiposProducto.length > 0) {
          const nuevasRelaciones = idTiposProducto.map(idTipo => ({
            producto: { idProducto } as any,
            tipoProducto: { idTipoProducto: idTipo } as any,
          }));
          await queryRunner.manager.save(nuevasRelaciones);
        }
      }

      await queryRunner.commitTransaction();
      return productoGuardado;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof NotFoundException) throw error;

      this.logger.error(`Error en update (id: ${idProducto}):`, error);
      throw new InternalServerErrorException(`Error al actualizar el producto con ID ${idProducto}`);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    try {
      const producto = await this.productoRepository.findOne({ where: { idProducto: id } });

      if (!producto) {
        throw new NotFoundException(`Producto con ID ${id} no encontrado`);
      }

      await this.productoRepository.remove(producto);
      return { message: `Producto con ID ${id} eliminado correctamente` };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(`Error en remove (id: ${id}):`, error);
      throw new InternalServerErrorException(`Error al eliminar el producto con ID ${id}`);
    }
  }
}
