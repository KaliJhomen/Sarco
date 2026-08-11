import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { DetalleCreditoService } from './detalle-credito.service';
import { CreateDetalleCreditoDto } from './dto/create-detalle-credito.dto';
import { UpdateDetalleCreditoDto } from './dto/update-detalle-credito.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';

@ApiTags('Detalle Crédito')
@Controller('detalle-credito')
export class DetalleCreditoController {
  constructor(private readonly detalleCreditoService: DetalleCreditoService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Crear un nuevo detalle de crédito' })
  @ApiResponse({ status: 201, description: 'Detalle de crédito creado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiBody({ type: CreateDetalleCreditoDto })
  create(@Body() createDetalleCreditoDto: CreateDetalleCreditoDto) {
    if ((createDetalleCreditoDto as any)?.idArticulo !== undefined) {
      throw new BadRequestException('Campo idArticulo no permitido. Use idProducto.');
    }
    if (createDetalleCreditoDto?.idProducto === undefined || createDetalleCreditoDto?.idProducto === null) {
      throw new BadRequestException('idProducto es requerido.');
    }
    return this.detalleCreditoService.create(createDetalleCreditoDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener todos los detalles de crédito' })
  @ApiResponse({ status: 200, description: 'Lista de detalles de crédito devuelta' })
  getDetallesCredito() {
    return this.detalleCreditoService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener un detalle de crédito por ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID único del detalle de crédito',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Detalle de crédito encontrado' })
  @ApiResponse({ status: 404, description: 'Detalle de crédito no encontrado' })
  getDetalleCredito(@Param('id') id: string) {
    return this.detalleCreditoService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Actualizar un detalle de crédito' })
  @ApiResponse({ status: 200, description: 'Detalle de crédito actualizado correctamente' })
  @ApiResponse({ status: 400, description: 'Detalle de crédito no encontrado' })
  @ApiBody({ type: UpdateDetalleCreditoDto })
  update(@Param('id') id: string, @Body() updateDetalleCreditoDto: UpdateDetalleCreditoDto) {
    if ((updateDetalleCreditoDto as any)?.idArticulo !== undefined) {
      throw new BadRequestException('Campo idArticulo no permitido. Use idProducto.');
    }
    if ('idProducto' in (updateDetalleCreditoDto as any) && (updateDetalleCreditoDto as any).idProducto == null) {
      throw new BadRequestException('Si envía idProducto debe ser un valor válido.');
    }
    return this.detalleCreditoService.update(+id, updateDetalleCreditoDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Eliminar un detalle de crédito' })
  @ApiResponse({ status: 200, description: 'Detalle de crédito eliminado correctamente' })
  @ApiResponse({ status: 400, description: 'Detalle de crédito no encontrado' })
  remove(@Param('id') id: string) {
    return this.detalleCreditoService.remove(+id);
  }
}
