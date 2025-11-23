import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TipoProductoService } from './tipo-producto.service';
import { CreateTipoProductoDto } from './dto/create-tipo-producto.dto';
import { UpdateTipoProductoDto } from './dto/update-tipo-producto.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('TipoProducto')
@Controller('tipo-producto')
export class TipoProductoController {
  constructor(private readonly tipoProductoService: TipoProductoService) {}

  @Post()
  create(@Body() createTipoProductoDto: CreateTipoProductoDto) {
    return this.tipoProductoService.create(createTipoProductoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener tipos de producto' })
  @ApiResponse({ status: 200, description: 'Lista de tipos de producto devuelta' })
  findAll() {
    return this.tipoProductoService.findAll();
  }
  @Get('filtro')
  @ApiOperation({ summary: 'Obtener tipos de producto filtrados por producto o subcategoría' })
  @ApiResponse({ status: 200, description: 'Lista de tipos de producto filtrados correctamente' })
  @ApiQuery({ name: 'idSubCategoria', required: false, type: Number, description: 'Filtra por subcategoría' })
  @ApiQuery({ name: 'idProducto', required: false, type: Number, description: 'Filtra por producto' })
  async findAllFiltered(
    @Query('idSubCategoria') idSubCategoria?: number,
    @Query('idProducto') idProducto?: number
  ) {
    return this.tipoProductoService.findAllFiltered(idProducto, idSubCategoria);
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoProductoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoProductoDto: UpdateTipoProductoDto) {
    return this.tipoProductoService.update(+id, updateTipoProductoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoProductoService.remove(+id);
  }
}