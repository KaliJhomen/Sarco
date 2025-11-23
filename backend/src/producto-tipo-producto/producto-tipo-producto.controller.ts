import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductoTipoProductoService } from './producto-tipo-producto.service';
import { CreateProductoTipoProductoDto } from './dto/create-producto-tipo-producto.dto';
import { UpdateProductoTipoProductoDto } from './dto/update-producto-tipo-producto.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('ProductoTipoProducto')
@Controller('producto-tipo-producto')
export class ProductoTipoProductoController {
  constructor(private readonly productoTipoProductoService: ProductoTipoProductoService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo producto-tipo-producto' })
  @ApiResponse({ status: 201, description: 'Creado correctamente' })
  @ApiBody({ type: CreateProductoTipoProductoDto })
  create(@Body() createProductoTipoProductoDto: CreateProductoTipoProductoDto) {
    return this.productoTipoProductoService.create(createProductoTipoProductoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los producto-tipo-producto' })
  @ApiResponse({ status: 200, description: 'Lista devuelta correctamente' })
  findAll() {
    return this.productoTipoProductoService.findAll();
  }
  @Get('by-product/:id')
  @ApiOperation({ summary: 'Obtener un producto-tipo-producto por Id producto' })
  @ApiResponse({ status: 200, description: 'Obtenido correctamente' })
  @ApiResponse({ status: 404, description: 'No encontrado' })
  findByProductId(@Param('id') id: string) {
    return this.productoTipoProductoService.findByProductId(+id);
  }
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto-tipo-producto por ID' })
  @ApiResponse({ status: 200, description: 'Obtenido correctamente' })
  @ApiResponse({ status: 404, description: 'No encontrado' })
  findOne(@Param('id') id: string) {
    return this.productoTipoProductoService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un producto-tipo-producto' })
  @ApiResponse({ status: 200, description: 'Actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'No encontrado' })
  @ApiBody({ type: UpdateProductoTipoProductoDto })
  update(@Param('id') id: string, @Body() updateProductoTipoProductoDto: UpdateProductoTipoProductoDto) {
    return this.productoTipoProductoService.update(+id, updateProductoTipoProductoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un producto-tipo-producto' })
  @ApiResponse({ status: 200, description: 'Eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'No encontrado' })
  remove(@Param('id') id: string) {
    return this.productoTipoProductoService.remove(+id);
  }
}
