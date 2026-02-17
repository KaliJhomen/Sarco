import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('Producto')
@Controller('producto')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles('Administrador') 
  @ApiOperation({ summary: 'Crear un nuevo articulo' })
  @ApiResponse({ status: 201, description: 'Articulo creada correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiBody({ type: CreateProductoDto })
  async create(@Body() createProductoDto: CreateProductoDto) {
    console.log('DTO recibido:', createProductoDto);
    return await this.productoService.create(createProductoDto);
  }

  @Get()
  //@UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener todos los articulos' })
  @ApiResponse({ status: 200, description: 'Lista de articulos devuelta' })
  findAll() {
    return this.productoService.findAll();
  }

  //http://localhost:4000/api/producto/filtro?idCategoria=1&idSubCategoria=1&idTipoProducto=1&idMarca=1
  //Asi debe ser la llamada con los query params opcionales
  // @Get('filtro')
  // @UseGuards(AuthGuard)
  // @ApiOperation({ summary: 'Obtener productos filtrados dinámicamente' })
  // @ApiResponse({ status: 200, description: 'Lista de productos filtrados correctamente' })

  // @ApiQuery({ name: 'idCategoria', required: false, type: Number, description: 'Filtra por categoría' })
  // @ApiQuery({ name: 'idSubCategoria', required: false, type: Number, description: 'Filtra por subcategoría' })
  // @ApiQuery({ name: 'idTipoProducto', required: false, type: Number, description: 'Filtra por tipo de producto' })
  // @ApiQuery({ name: 'idMarca', required: false, type: Number, description: 'Filtra por marca' })

  // async findProductosFiltro(
  //   @Query('idCategoria') idCategoria?: number,
  //   @Query('idSubCategoria') idSubCategoria?: number,
  //   @Query('idTipoProducto') idTipoProducto?: number,
  //   @Query('idMarca') idMarca?: number,
  // ) {

  //   const filtros = {
  //     idCategoria: idCategoria ? Number(idCategoria) : undefined,
  //     idSubCategoria: idSubCategoria ? Number(idSubCategoria) : undefined,
  //     idTipoProducto: idTipoProducto ? Number(idTipoProducto) : undefined,
  //     idMarca: idMarca ? Number(idMarca) : undefined,
  //   };

  //   return this.productoService.findProductosFiltro(filtros);
  // }

  @Get('filtro')
  @ApiOperation({ summary: 'Obtener productos filtrados dinámicamente (público)' })
  @ApiResponse({ status: 200, description: 'Lista de productos filtrados correctamente' })

  // Parámetros opcionales en Swagger
  @ApiQuery({ name: 'c[]', required: false, type: [String], description: 'Array de nombres/slugs de categorías (ej: ?c[]=motos&c[]=autos)' })
  @ApiQuery({ name: 's[]', required: false, type: [String], description: 'Array de nombres/slugs de subcategorías (ej: ?s[]=deportivas&s[]=touring)' })
  @ApiQuery({ name: 't[]', required: false, type: [String], description: 'Array de nombres/slugs de tipos de producto' })
  @ApiQuery({ name: 'marca_id[]', required: false, type: [Number], description: 'Array de IDs de marcas (ej: ?marca_id[]=1&marca_id[]=2)' })
  @ApiQuery({ name: 'idCategoria', required: false, type: Number, description: 'Filtra por categoría (ID único)' })
  @ApiQuery({ name: 'idSubCategoria', required: false, type: Number, description: 'Filtra por subcategoría (ID único)' })
  @ApiQuery({ name: 'idTipoProducto', required: false, type: Number, description: 'Filtra por tipo de producto (ID único)' })
  @ApiQuery({ name: 'idMarca', required: false, type: Number, description: 'Filtra por marca (ID único)' })
  @ApiQuery({ name: 'marcas', required: false, type: String, description: 'Lista de IDs de marcas separadas por coma, p.ej. 1,2,3' })
  @ApiQuery({ name: 'categoria', required: false, type: String, description: 'Nombre/slug de categoría' })
  @ApiQuery({ name: 'subcategoria', required: false, type: String, description: 'Nombre/slug de subcategoría' })
  @ApiQuery({ name: 'tipo', required: false, type: String, description: 'Nombre/slug de tipo de producto' })
  @ApiQuery({ name: 'price_min', required: false, type: Number, description: 'Precio mínimo' })
  @ApiQuery({ name: 'price_max', required: false, type: Number, description: 'Precio máximo' })
  @ApiQuery({ name: 'tienda_id', required: false, type: String, description: 'IDs de tiendas separadas por coma, p.ej. 1,2,3' })
  @ApiQuery({ name: 'tiendas', required: false, type: String, description: 'Alias de tienda_id (lista separada por comas)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Página para paginación (1 por defecto)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Límite por página (20 por defecto)' })
  @ApiQuery({ name: 'busqueda', required: false, type: String, description: 'Filtra por nombre, modelo o descripción' })
  @ApiQuery({ name: 'q', required: false, type: String, description: 'Alias de busqueda (mismo que busqueda)' })
  @ApiQuery({ name: 'hasDiscount', required: false, type: String, description: 'Filtrar por productos con descuento (true/false)' })

  async findProductosFiltro(
    @Query('c[]') categoriasArray?: string | string[],
    @Query('s[]') subcategoriasArray?: string | string[],
    @Query('t[]') tiposArray?: string | string[],
    @Query('marca_id[]') marcaIdsArray?: string | string[],
    @Query('idCategoria') idCategoria?: number,
    @Query('idSubCategoria') idSubCategoria?: number,
    @Query('idTipoProducto') idTipoProducto?: number,
    @Query('idMarca') idMarca?: number,
    @Query('marcas') marcas?: string,
    @Query('categoria') categoria?: string,
    @Query('subcategoria') subcategoria?: string,
    @Query('tipo') tipo?: string,
    @Query('price_min') priceMin?: number,
    @Query('price_max') priceMax?: number,
    @Query('tienda_id') tiendaId?: string,
    @Query('tiendas') tiendas?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('busqueda') busqueda?: string,
    @Query('q') q?: string,
    @Query('hasDiscount') hasDiscount?: string,
  ) {
    const normalize = (v?: string) => v?.toLowerCase().replace(/-/g, ' ').trim();
    
    // Procesar arrays de categorías (de URL params c[])
    const categoriasNombres = categoriasArray 
      ? (Array.isArray(categoriasArray) ? categoriasArray : [categoriasArray]).map(normalize).filter(Boolean)
      : [];

    // Procesar arrays de subcategorías (de URL params s[])
    const subcategoriasNombres = subcategoriasArray
      ? (Array.isArray(subcategoriasArray) ? subcategoriasArray : [subcategoriasArray]).map(normalize).filter(Boolean)
      : [];

    // Procesar arrays de tipos (de URL params t[])
    const tiposNombres = tiposArray
      ? (Array.isArray(tiposArray) ? tiposArray : [tiposArray]).map(normalize).filter(Boolean)
      : [];

    // Procesar IDs de marcas desde marca_id[] o marcas (comma-separated)
    let brandIds: number[] = [];
    if (marcaIdsArray) {
      const idsFromArray = Array.isArray(marcaIdsArray) ? marcaIdsArray : [marcaIdsArray];
      brandIds = idsFromArray.map(id => Number(id)).filter(n => !Number.isNaN(n) && n > 0);
    } else if (marcas) {
      brandIds = marcas.split(',').map(x => Number(x)).filter(n => !Number.isNaN(n) && n > 0);
    }

    // Procesar tiendas
    const tiendaIds = (tiendas || tiendaId)
      ? (tiendas || tiendaId)!.split(',').map((x) => Number(x)).filter((n) => !Number.isNaN(n) && n > 0)
      : undefined;

    // Procesamiento de hasDiscount
    const hasDiscountFilter = hasDiscount === 'true' ? true : undefined;
    const filtros = {
      // IDs únicos (backwards compatibility)
      idCategoria: idCategoria ? Number(idCategoria) : undefined,
      idSubCategoria: idSubCategoria ? Number(idSubCategoria) : undefined,
      idTipoProducto: idTipoProducto ? Number(idTipoProducto) : undefined,
      idMarca: idMarca ? Number(idMarca) : undefined,
      
      // Arrays de nombres normalizados (nuevo)
      categoriasNombres: categoriasNombres.length > 0 ? categoriasNombres : undefined,
      subcategoriasNombres: subcategoriasNombres.length > 0 ? subcategoriasNombres : undefined,
      tiposNombres: tiposNombres.length > 0 ? tiposNombres : undefined,
      
      // Nombres únicos (backwards compatibility)
      categoriaNombre: normalize(categoria),
      subCategoriaNombre: normalize(subcategoria),
      tipoProductoNombre: normalize(tipo),
      
      // Marcas (array)
      idMarcaList: brandIds.length > 0 ? brandIds : undefined,
      
      // Precio
      priceMin: typeof priceMin === 'number' ? Number(priceMin) : undefined,
      priceMax: typeof priceMax === 'number' ? Number(priceMax) : undefined,
      
      // Paginación
      page: page ? Math.max(1, Number(page)) : undefined,
      limit: limit ? Math.max(1, Number(limit)) : undefined,
      
      // Búsqueda
      busqueda: (q || busqueda)?.trim() || undefined,
      
      // Tiendas
      idTiendaList: tiendaIds,
      
      // Filtro de descuento ← AGREGAR ESTO
      hasDiscount: hasDiscountFilter,
    } as any;

    return this.productoService.findProductosFiltro(filtros);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un articulo por ID' })
  @ApiResponse({ status: 200, description: 'Articulo obtenido correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  findOne(@Param('id') id: string) {
    return this.productoService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un articulo' })
  @ApiResponse({ status: 201, description: 'Articulo actualizado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiBody({ type: UpdateProductoDto })
  update(@Param('id') id: string, @Body() updateProductoDto: UpdateProductoDto) {
    return this.productoService.update(+id, updateProductoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un articulo' })
  @ApiResponse({ status: 201, description: 'Articulo eliminado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  remove(@Param('id') id: string) {
    return this.productoService.remove(+id);
  }
}
