import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@ApiTags('Producto')
@Controller('producto')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post()
  //@UseGuards(AuthGuard)
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

  // 👇 Parámetros opcionales en Swagger (IDs y nombres)
  @ApiQuery({ name: 'idCategoria', required: false, type: Number, description: 'Filtra por categoría (ID)' })
  @ApiQuery({ name: 'idSubCategoria', required: false, type: Number, description: 'Filtra por subcategoría (ID)' })
  @ApiQuery({ name: 'idTipoProducto', required: false, type: Number, description: 'Filtra por tipo de producto (ID)' })
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

  async findProductosFiltro(
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
  ) {
    const normalize = (v?: string) => v?.toLowerCase().replace(/-/g, ' ').trim();
    const brandIds = marcas
      ? marcas.split(',').map((x) => Number(x)).filter((n) => !Number.isNaN(n) && n > 0)
      : undefined;
    const tiendaIds = (tiendas || tiendaId)
      ? (tiendas || tiendaId)!.split(',').map((x) => Number(x)).filter((n) => !Number.isNaN(n) && n > 0)
      : undefined;

    const filtros = {
      idCategoria: idCategoria ? Number(idCategoria) : undefined,
      idSubCategoria: idSubCategoria ? Number(idSubCategoria) : undefined,
      idTipoProducto: idTipoProducto ? Number(idTipoProducto) : undefined,
      idMarca: idMarca ? Number(idMarca) : undefined,
      idMarcaList: brandIds,
      categoriaNombre: normalize(categoria),
      subCategoriaNombre: normalize(subcategoria),
      priceMin: typeof priceMin === 'number' ? Number(priceMin) : undefined,
      priceMax: typeof priceMax === 'number' ? Number(priceMax) : undefined,
      page: page ? Math.max(1, Number(page)) : undefined,
      limit: limit ? Math.max(1, Number(limit)) : undefined,
      busqueda: (q || busqueda)?.trim() || undefined,
      idTiendaList: tiendaIds,
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
