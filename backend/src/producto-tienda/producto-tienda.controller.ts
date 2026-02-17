import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductoTiendaService } from './producto-tienda.service';
import { CreateProductoTiendaDto } from './dto/create-producto-tienda.dto';
import { UpdateProductoTiendaDto } from './dto/update-producto-tienda.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('ProductoTienda')
@Controller('producto-tienda')
export class ProductoTiendaController {
  constructor(private readonly productoTiendaService: ProductoTiendaService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo producto-tienda' })
  @ApiResponse({ status: 201, description: 'Creado correctamente' })
  @ApiBody({ type: CreateProductoTiendaDto })
  create(@Body() createProductoTiendaDto: CreateProductoTiendaDto) {
    return this.productoTiendaService.create(createProductoTiendaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los producto-tienda' })
  @ApiResponse({ status: 200, description: 'Lista devuelta correctamente' })
  findAll() {
    return this.productoTiendaService.findAll();
  }

  @Get('by-product/:id')
  @ApiOperation({ summary: 'Obtener la/s tienda/s a la que pertenece un producto' })
  @ApiResponse({ status: 200, description: 'Obtenido correctamente' })
  @ApiResponse({ status: 404, description: 'No encontrado' })
  findByProductId(@Param('id') id: string) {
    return this.productoTiendaService.findByProductId(+id);
  }
  @Get('by-store/:id')
  @ApiOperation({ summary: 'Obtener el/los producto/s que contiene una tienda' })
  @ApiResponse({ status: 200, description: 'Obtenido correctamente' })
  @ApiResponse({ status: 404, description: 'No encontrado' })
  findByStoreId(@Param('id') id: string) {
    return this.productoTiendaService.findByStoreId(+id);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductoTiendaDto: UpdateProductoTiendaDto) {
    return this.productoTiendaService.update(+id, updateProductoTiendaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productoTiendaService.remove(+id);
  }
}
