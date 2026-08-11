import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EgresoService } from './egreso.service';
import { CreateEgresoDto } from './dto/create-egreso.dto';
import { UpdateEgresoDto } from './dto/update-egreso.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';

@ApiTags('Egreso')
@Controller('egreso')
export class EgresoController {
  constructor(private readonly egresoService: EgresoService) { }

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Crear un nuevo egreso' })
  @ApiResponse({ status: 201, description: 'egreso creado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiBody({ type: CreateEgresoDto })
  create(@Body() createEgresoDto: CreateEgresoDto) {
    return this.egresoService.create(createEgresoDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener todos los detalles de separado' })
  @ApiResponse({ status: 200, description: 'Lista de detalles de separado devuelta' })
  getEgresos() {
    return this.egresoService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener un egreso por ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID único del egreso',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'egreso encontrado' })
  @ApiResponse({ status: 404, description: 'egreso no encontrado' })
  findOne(@Param('id') id: string) {
    return this.egresoService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Actualizar un egreso' })
  @ApiResponse({ status: 200, description: 'egreso actualizado correctamente' })
  @ApiResponse({ status: 400, description: 'egreso no encontrado' })
  @ApiBody({ type: UpdateEgresoDto })
  update(@Param('id') id: string, @Body() updateEgresoDto: UpdateEgresoDto) {
    return this.egresoService.update(+id, updateEgresoDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Eliminar un egreso' })
  @ApiResponse({ status: 200, description: 'egreso eliminado correctamente' })
  @ApiResponse({ status: 400, description: 'egreso no encontrado' })
  remove(@Param('id') id: string) {
    return this.egresoService.remove(+id);
  }
}
