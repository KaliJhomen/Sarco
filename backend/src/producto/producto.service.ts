import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
import { ProductoTipoProducto } from 'src/producto-tipo-producto/entities/producto-tipo-producto.entity';
import { TipoProducto } from 'src/tipo-producto/entities/tipo-producto.entity';
@Injectable()
export class ProductoService {

  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,

    @InjectRepository(ProductoTipoProducto)
    private productoTipoProductoRepository: Repository<ProductoTipoProducto>, 

    @InjectRepository(TipoProducto)
    private tipoProductoRepository: Repository<TipoProducto>,
  ) { }

  async create(createProductoDto: CreateProductoDto) {
    try {
      const {idTiposProducto, ...productoData}= createProductoDto;
      const producto = this.productoRepository.create(productoData);
      const productoGuardado = await this.productoRepository.save(producto);
      if (idTiposProducto && Array.isArray(idTiposProducto)) {
        const relaciones = idTiposProducto.map(id => ({
          idProducto: productoGuardado,
          idTipoProducto: { idTipoProducto: id }
        })) as DeepPartial<ProductoTipoProducto>[];
      return await this.productoTipoProductoRepository.save(relaciones);
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Ocurrió un error al crear el producto',
      );
    }
  }

  async findAll() {
    try {
      return await this.productoRepository.find({
        relations: ["idMarca2", "productoTipoProducto", "productoTipoProducto.idTipoProducto"],
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocurrió un error al obtener los productos',
      );
    }

  }

  // async findProductosFiltro(filtros: {
  //   idCategoria?: number;
  //   idSubCategoria?: number;
  //   idTipoProducto?: number;
  //   idMarca?: number;
  // }) {
  //   try {
  //     const query = this.productoRepository
  //       .createQueryBuilder('producto')
  //       .leftJoinAndSelect('producto.producto_tipo_productos', 'productoTipoProducto')
  //       .leftJoinAndSelect('productoTipoProducto.idTipoProducto2', 'tipoProducto')
  //       .leftJoinAndSelect('tipoProducto.sub_categoria_tipo_productos', 'subCategoriaTipoProducto')
  //       .leftJoinAndSelect('subCategoriaTipoProducto.idSubCategoria2', 'subCategoria')
  //       .leftJoinAndSelect('subCategoria.idCategoria2', 'categoria')
  //       .leftJoinAndSelect('producto.idMarca2', 'marca');

  //     const params: any = {};

  //     if (filtros.idCategoria) {
  //       query.andWhere('categoria.idCategoria = :idCategoria');
  //       params.idCategoria = filtros.idCategoria;
  //     }

  //     if (filtros.idSubCategoria) {
  //       query.andWhere('subCategoria.idSubCategoria = :idSubCategoria');
  //       params.idSubCategoria = filtros.idSubCategoria;
  //     }

  //     if (filtros.idTipoProducto) {
  //       query.andWhere('tipoProducto.idTipoProducto = :idTipoProducto');
  //       params.idTipoProducto = filtros.idTipoProducto;
  //     }

  //     if (filtros.idMarca) {
  //       query.andWhere('marca.idMarca = :idMarca');
  //       params.idMarca = filtros.idMarca;
  //     }

  //     if (Object.keys(params).length > 0) {
  //       query.setParameters(params);
  //     }

  //     const productos = await query.getMany();

  //     if (!productos.length) {
  //       return { message: 'No se encontraron productos con los filtros aplicados.', data: [] };
  //     }

  //     //NO BORRAR Xd
  //     //SI LO BORRAS VAS A LAMENTARLO LUEGO 😞😢
  //     // return { total: productos.length, data: productos };
  //     return productos;
  //   } catch (error) {
  //     console.error('Error en findProductosFiltro:', error);
  //     throw new InternalServerErrorException('Error interno del servidor.');
  //   }
  // }

  async findProductosFiltro(filtros: {
    idCategoria?: number;
    idSubCategoria?: number;
    idTipoProducto?: number;
    idMarca?: number;
    idMarcaList?: number[];
    categoriaNombre?: string;
    subCategoriaNombre?: string;
    tipoProductoNombre?: string;
    priceMin?: number;
    priceMax?: number;
    page?: number;
    limit?: number;
    busqueda?: string;
    idTiendaList?: number[];
  }) {
    try {
      const query = this.buildProductoQuery(filtros);

      this.applyPagination(query, filtros);

      const [productos/*, total*/] = await query.getManyAndCount();
      // Nota: mantenemos la compatibilidad retornando sólo productos.
      // Si el controlador se ajusta, podemos devolver { data: productos, paginacion: { total, page, limit } }.
      return productos;
    } catch (error) {
      console.error('Error en findProductosFiltro:', error);
      throw new InternalServerErrorException('Error interno del servidor.');
    }
  }

  private buildProductoQuery(filtros: any): SelectQueryBuilder<Producto> {
    const query = this.productoRepository
      .createQueryBuilder('producto')
      .leftJoinAndSelect('producto.idMarca2', 'marca')
      .leftJoinAndSelect('producto.producto_tipo_productos', 'ptp')
      .leftJoinAndSelect('ptp.idTipoProducto2', 'tipoProducto')
      .leftJoinAndSelect('tipoProducto.sub_categoria_tipo_productos', 'sctp')
      .leftJoinAndSelect('sctp.idSubCategoria2', 'subCategoria')
      .leftJoinAndSelect('subCategoria.idCategoria2', 'categoria')
      .leftJoinAndSelect('producto.productoTiendas', 'pt')
      .leftJoinAndSelect('pt.idTienda2', 'tienda');

    this.applyFilters(query, filtros);
    this.applySearchFilter(query, filtros);
    this.applyPriceFilters(query, filtros);

    return query;
  }

  private applyFilters(query: SelectQueryBuilder<Producto>, filtros: any) {
    if (filtros.idMarca)
      query.andWhere('marca.idMarca = :idMarca', { idMarca: filtros.idMarca });

    if (filtros.idMarcaList && filtros.idMarcaList.length)
      query.andWhere('marca.idMarca IN (:...idMarcaList)', { idMarcaList: filtros.idMarcaList });

    if (filtros.idTipoProducto)
      query.andWhere('tipoProducto.idTipoProducto = :idTipoProducto', { idTipoProducto: filtros.idTipoProducto });

    if (filtros.idSubCategoria)
      query.andWhere('subCategoria.idSubCategoria = :idSubCategoria', { idSubCategoria: filtros.idSubCategoria });

    if (filtros.idCategoria)
      query.andWhere('categoria.idCategoria = :idCategoria', { idCategoria: filtros.idCategoria });

    if (filtros.idTiendaList && filtros.idTiendaList.length)
      query.andWhere('tienda.idTienda IN (:...idTiendaList)', { idTiendaList: filtros.idTiendaList });

    if (filtros.categoriaNombre)
      query.andWhere('LOWER(categoria.nombre) = :categoriaNombre', { categoriaNombre: filtros.categoriaNombre });
    if (filtros.subCategoriaNombre)
      query.andWhere('LOWER(subCategoria.nombre) = :subCategoriaNombre', { subCategoriaNombre: filtros.subCategoriaNombre });
    if (filtros.tipoProductoNombre)
      query.andWhere('LOWER(tipoProducto.nombre) = :tipoProductoNombre', { tipoProductoNombre: filtros.tipoProductoNombre });
  }

  private applyPriceFilters(query: SelectQueryBuilder<Producto>, filtros: any) {
    if (typeof filtros.priceMin === 'number')
      query.andWhere('producto.precioVenta >= :priceMin', { priceMin: filtros.priceMin });
    if (typeof filtros.priceMax === 'number')
      query.andWhere('producto.precioVenta <= :priceMax', { priceMax: filtros.priceMax });
  }

  private applySearchFilter(query: SelectQueryBuilder<Producto>, filtros: any) {
    if (!filtros.busqueda) return;
    query.andWhere(
      `(
        producto.nombre LIKE :busqueda
        OR producto.modelo LIKE :busqueda
        OR producto.descripcion LIKE :busqueda
        OR marca.nombre LIKE :busqueda
        OR categoria.nombre LIKE :busqueda
        OR subCategoria.nombre LIKE :busqueda
        OR tipoProducto.nombre LIKE :busqueda
      )`,
      { busqueda: `%${filtros.busqueda}%` }
    );
  }

  private applyPagination(query: SelectQueryBuilder<Producto>, filtros: any) {
    if (filtros.limit && filtros.limit > 0) query.take(filtros.limit);
    if (filtros.page && filtros.page > 1 && filtros.limit && filtros.limit > 0)
      query.skip((filtros.page - 1) * filtros.limit);
  }

  // MÉTODO ACTUALIZADO - RETORNA DATOS REALES
  async findOne(id: number) {
    try {
      const producto = await this.productoRepository.findOne({
        where: { idProducto: id },
        relations: ['idMarca2'], 
      });

      if (!producto) {
        throw new NotFoundException(`Producto con ID ${id} no encontrado`);
      }

      return producto;
    } catch (error) {
      console.error('Error en findOne:', error);
      
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw new InternalServerErrorException(
        `Error al obtener el producto con ID ${id}`,
      );
    }
  }

  async update(id: number, updateProductoDto: UpdateProductoDto) {
    try {
      const producto = await this.productoRepository.preload({
        idProducto: id,
        ...updateProductoDto,
      });
      if (!producto) {
        throw new NotFoundException(`Producto con ID ${id} no encontrado`);
      }
      return await this.productoRepository.save(producto);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al actualizar el producto con ID ${id}`,
      );
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
      console.error('Error en remove:', error);
      throw new InternalServerErrorException(
        `Error al eliminar el producto con ID ${id}`,
      );
    }
  }
}
