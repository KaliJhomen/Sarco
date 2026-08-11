import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { DetalleSeparadoService } from './detalle-separado.service';
import { CreateDetalleSeparadoDto } from './dto/create-detalle-separado.dto';
import { UpdateDetalleSeparadoDto } from './dto/update-detalle-separado.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';

@ApiTags('Detalle separado')
@Controller('detalle-separado')
export class DetalleSeparadoController {
  constructor(private readonly detalleSeparadoService: DetalleSeparadoService) { }

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Crear un nuevo detalle de separado' })
  @ApiResponse({ status: 201, description: 'Detalle de separado creado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiBody({ type: CreateDetalleSeparadoDto })
  create(@Body() createDetalleSeparadoDto: CreateDetalleSeparadoDto) {
    if ((createDetalleSeparadoDto as any)?.idArticulo !== undefined) {
      throw new BadRequestException('Campo idArticulo no permitido. Use idProducto.');
    }
    if (createDetalleSeparadoDto?.idProducto === undefined || createDetalleSeparadoDto?.idProducto === null) {
      throw new BadRequestException('idProducto es requerido.');
    }
    return this.detalleSeparadoService.create(createDetalleSeparadoDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener todos los detalles de separado' })
  @ApiResponse({ status: 200, description: 'Lista de detalles de separado devuelta' })
  getDetallesCredito() {
    return this.detalleSeparadoService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener un detalle de separado por ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID único del detalle de separado',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Detalle de separado encontrado' })
  @ApiResponse({ status: 404, description: 'Detalle de separado no encontrado' })
  getDetalleCredito(@Param('id') id: string) {
    return this.detalleSeparadoService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Actualizar un detalle de separado' })
  @ApiResponse({ status: 200, description: 'Detalle de separado actualizado correctamente' })
  @ApiResponse({ status: 400, description: 'Detalle de separado no encontrado' })
  @ApiBody({ type: UpdateDetalleSeparadoDto })
  update(@Param('id') id: string, @Body() updateDetalleSeparadoDto: UpdateDetalleSeparadoDto) {
    if ((updateDetalleSeparadoDto as any)?.idArticulo !== undefined) {
      throw new BadRequestException('Campo idArticulo no permitido. Use idProducto.');
    }
    if ('idProducto' in (updateDetalleSeparadoDto as any) && (updateDetalleSeparadoDto as any).idProducto == null) {
      throw new BadRequestException('Si envía idProducto debe ser un valor válido.');
    }
    return this.detalleSeparadoService.update(+id, updateDetalleSeparadoDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Eliminar un detalle de separado' })
  @ApiResponse({ status: 200, description: 'Detalle de separado eliminado correctamente' })
  @ApiResponse({ status: 400, description: 'Detalle de separado no encontrado' })
  remove(@Param('id') id: string) {
    return this.detalleSeparadoService.remove(+id);
  }
}
