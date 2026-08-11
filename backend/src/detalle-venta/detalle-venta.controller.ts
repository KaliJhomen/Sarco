import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { DetalleVentaService } from './detalle-venta.service';
import { CreateDetalleVentaDto } from './dto/create-detalle-venta.dto';
import { UpdateDetalleVentaDto } from './dto/update-detalle-venta.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';

@ApiTags('Detalle venta')
@Controller('detalle-venta')
export class DetalleVentaController {
  constructor(private readonly detalleVentaService: DetalleVentaService) { }

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Crear un nuevo detalle de venta' })
  @ApiResponse({ status: 201, description: 'Detalle de venta creado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiBody({ type: CreateDetalleVentaDto })
  create(@Body() createDetalleVentaDto: CreateDetalleVentaDto) {
    if ((createDetalleVentaDto as any)?.idArticulo !== undefined) {
      throw new BadRequestException('Campo idArticulo no permitido. Use idProducto.');
    }
    if (createDetalleVentaDto?.idProducto === undefined || createDetalleVentaDto?.idProducto === null) {
      throw new BadRequestException('idProducto es requerido.');
    }
    return this.detalleVentaService.create(createDetalleVentaDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener todos los detalles de venta' })
  @ApiResponse({ status: 200, description: 'Lista de detalles de venta devuelta' })
  getDetallesVenta() {
    return this.detalleVentaService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener un detalle de venta por ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID único del detalle de venta',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Detalle de venta encontrado' })
  @ApiResponse({ status: 404, description: 'Detalle de venta no encontrado' })
  getDetalleVenta(@Param('id') id: string) {
    return this.detalleVentaService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Actualizar un detalle de venta' })
  @ApiResponse({ status: 200, description: 'Detalle de venta actualizado correctamente' })
  @ApiResponse({ status: 400, description: 'Detalle de venta no encontrado' })
  @ApiBody({ type: UpdateDetalleVentaDto })
  update(@Param('id') id: string, @Body() updateDetalleVentaDto: UpdateDetalleVentaDto) {
    if ((updateDetalleVentaDto as any)?.idArticulo !== undefined) {
      throw new BadRequestException('Campo idArticulo no permitido. Use idProducto.');
    }
    if ('idProducto' in (updateDetalleVentaDto as any) && (updateDetalleVentaDto as any).idProducto == null) {
      throw new BadRequestException('Si envía idProducto debe ser un valor válido.');
    }
    return this.detalleVentaService.update(+id, updateDetalleVentaDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Eliminar un detalle de venta' })
  @ApiResponse({ status: 200, description: 'Detalle de venta eliminado correctamente' })
  @ApiResponse({ status: 400, description: 'Detalle de venta no encontrado' })
  remove(@Param('id') id: string) {
    return this.detalleVentaService.remove(+id);
  }
}
