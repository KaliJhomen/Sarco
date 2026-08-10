import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

import { ProductoTipoProducto } from 'src/producto-tipo-producto/entities/producto-tipo-producto.entity';
import { TipoProducto } from 'src/tipo-producto/entities/tipo-producto.entity';

import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
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

  async create(dtoCreate: CreateProductoDto) {
    try {
      const {idTiposProducto, ...productoData}= dtoCreate;
      const producto = this.productoRepository.create(productoData);
      const productoGuardado = await this.productoRepository.save(producto);
      if (idTiposProducto && Array.isArray(idTiposProducto)) {
        const relaciones = idTiposProducto.map(id => ({
          producto: productoGuardado,
          tipoProducto: { idTipoProducto: id }
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
      const productos = await this.productoRepository
        .createQueryBuilder('producto')
        .leftJoinAndSelect('producto.marca', 'm')
        .leftJoinAndSelect('producto.productoTipoProductos', 'ptp')
        .leftJoinAndSelect('ptp.tipoProducto', 'tp')
        .leftJoinAndSelect('tp.tipoProductoSubCategoria', 'tpsc')
        .leftJoinAndSelect('tpsc.subCategoria', 'sc')
        .leftJoinAndSelect('sc.categoria', 'c')
        .leftJoinAndSelect('producto.productoTiendas', 'pt')
        .leftJoinAndSelect('pt.tienda', 't')
        .getMany();
      /*
      const getCategoriaNombre = (producto: Producto) => {
        if (!producto.productoTipoProductos) return null;
        for (const ptp of producto.productoTipoProductos) {
          const tipo = ptp.idTipoProducto as any;
          if (!tipo || !tipo.tipoProductoSubCategoria) continue;
          for (const tpsc of tipo.tipoProductoSubCategoria) {
            const sub = (tpsc as any).idSubCategoria;
            const cat = sub?.idCategoria2;
            if (cat?.nombre) return cat.nombre;
          }
        }
        return null;
      };
      */

      return productos.map(p  => ({
        ...p,
        marca: p.marca?.nombre ?? null,
        categoria: p.productoTipoProductos?.[0]?.tipoProducto?.tipoProductoSubCategorias?.[0]?.subCategoria?.categoria?.nombre ?? null,
      }));
    } catch (error) {
      console.error('Error en findAll:', error);
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
    // IDs únicos (backwards compatibility)
    idCategoria?: number;
    idSubCategoria?: number;
    idTipoProducto?: number;
    idMarca?: number;
    
    // Arrays de IDs
    idMarcaList?: number[];
    idTiendaList?: number[];
    
    // Nombres únicos (backwards compatibility)
    categoriaNombre?: string;
    subCategoriaNombre?: string;
    tipoProductoNombre?: string;
    
    // Arrays de nombres (nuevo - para selección múltiple)
    categoriasNombres?: string[];
    subcategoriasNombres?: string[];
    tiposNombres?: string[];
    
    // Precio
    priceMin?: number;
    priceMax?: number;
    
    // Paginación
    page?: number;
    limit?: number;
    
    // Búsqueda
    busqueda?: string;

    // Filtro de descuento ← AGREGAR ESTO
    hasDiscount?: boolean;
  }) {
    try {
      const query = this.buildProductoQuery(filtros);

      this.applyPagination(query, filtros);

      const [productos/*, total*/] = await query.getManyAndCount();
      return productos;
    } catch (error) {
      console.error('Error en findProductosFiltro:', error);
      throw new InternalServerErrorException('Error interno del servidor.');
    }
  }

  private buildProductoQuery(filtros: any): SelectQueryBuilder<Producto> {
    const query = this.productoRepository
      .createQueryBuilder('producto')
      .leftJoinAndSelect('producto.marca', 'marca')
      .leftJoinAndSelect('producto.productoTipoProductos', 'ptp')
      .leftJoinAndSelect('ptp.tipoProducto', 'tp')
      .leftJoinAndSelect('tp.tipoProductoSubCategoria', 'tpsc')
      .leftJoinAndSelect('tpsc.subCategoria', 'sc')
      .leftJoinAndSelect('sc.categoria', 'categoria')
      .leftJoinAndSelect('producto.productoTiendas', 'pt')
      .leftJoinAndSelect('pt.tienda', 'tienda');

    this.applyFilters(query, filtros);
    this.applySearchFilter(query, filtros);
    this.applyPriceFilters(query, filtros);

    return query;
  }

  private applyFilters(query: SelectQueryBuilder<Producto>, filtros: any) {
    // Filtro de marca única (backwards compatibility)
    if (filtros.idMarca)
      query.andWhere('marca.idMarca = :idMarca', { idMarca: filtros.idMarca });

    // Filtro de múltiples marcas (nuevo)
    if (filtros.idMarcaList && filtros.idMarcaList.length)
      query.andWhere('marca.idMarca IN (:...idMarcaList)', { idMarcaList: filtros.idMarcaList });

    // Filtro de tipo de producto único (backwards compatibility)
    if (filtros.idTipoProducto)
      query.andWhere('tipoProducto.idTipoProducto = :idTipoProducto', { idTipoProducto: filtros.idTipoProducto });

    // Filtro de subcategoría única (backwards compatibility)
    if (filtros.idSubCategoria)
      query.andWhere('subCategoria.idSubCategoria = :idSubCategoria', { idSubCategoria: filtros.idSubCategoria });

    // Filtro de categoría única (backwards compatibility)
    if (filtros.idCategoria)
      query.andWhere('categoria.idCategoria = :idCategoria', { idCategoria: filtros.idCategoria });

    // Filtro de tiendas
    if (filtros.idTiendaList && filtros.idTiendaList.length)
      query.andWhere('tienda.idTienda IN (:...idTiendaList)', { idTiendaList: filtros.idTiendaList });

    // Filtros por nombre único (backwards compatibility)
    if (filtros.categoriaNombre)
      query.andWhere('LOWER(categoria.nombre) = :categoriaNombre', { categoriaNombre: filtros.categoriaNombre });
    if (filtros.subCategoriaNombre)
      query.andWhere('LOWER(subCategoria.nombre) = :subCategoriaNombre', { subCategoriaNombre: filtros.subCategoriaNombre });
    if (filtros.tipoProductoNombre)
      query.andWhere('LOWER(tipoProducto.nombre) = :tipoProductoNombre', { tipoProductoNombre: filtros.tipoProductoNombre });

    // Filtros por arrays de nombres (nuevo - OR logic)
    if (filtros.categoriasNombres && filtros.categoriasNombres.length > 0) {
      query.andWhere('LOWER(categoria.nombre) IN (:...categoriasNombres)', { 
        categoriasNombres: filtros.categoriasNombres 
      });
    }

    if (filtros.subcategoriasNombres && filtros.subcategoriasNombres.length > 0) {
      query.andWhere('LOWER(subCategoria.nombre) IN (:...subcategoriasNombres)', { 
        subcategoriasNombres: filtros.subcategoriasNombres 
      });
    }

    if (filtros.tiposNombres && filtros.tiposNombres.length > 0) {
      query.andWhere('LOWER(tipoProducto.nombre) IN (:...tiposNombres)', { 
        tiposNombres: filtros.tiposNombres 
      });
    }

    // Filtro de descuento
    if (filtros.hasDiscount === true) {
      console.log('🔍 DEBUG SERVICE - Aplicando filtro hasDiscount');
      query.andWhere('producto.descuento > :minDiscount', { minDiscount: 0 });
    }

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

  async findOne(id: number) {
    try {
      const producto = await this.productoRepository.findOne({
        where: { idProducto: id },
        relations: [
          'marca',
          'productoColores',
          'productoColores.color',
          'productoTipoProductos',
          'productoTipoProducto.tipoProducto',
          'productoTipoProducto.tipoProducto.tipoProductoSubCategoria',
          'productoTipoProducto.tipoProducto.tipoProductoSubCategoria.subCategoria',
          'productoTipoProducto.tipoProducto.tipoProductoSubCategoria.subCategoria.categoria',
          'productoTiendas',
          'productoTiendas.tienda',
        ],
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

  async update(idProducto: number, dtoUpdate: UpdateProductoDto) {
    try {
      const producto = await this.productoRepository.preload({
        idProducto,
        ...dtoUpdate,
      });
      if (!producto) {
        throw new NotFoundException(`Producto con ID ${idProducto} no encontrado`);
      }
      return await this.productoRepository.save(producto);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al actualizar el producto con ID ${idProducto}`,
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
