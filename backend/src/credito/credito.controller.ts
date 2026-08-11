import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CreditoService } from './credito.service';
import { CreateCreditoDto } from './dto/create-credito.dto';
import { UpdateCreditoDto } from './dto/update-credito.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Crédito')
@Controller('credito')
export class CreditoController {
  constructor(private readonly creditoService: CreditoService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Crear un nuevo crédito' })
  @ApiResponse({ status: 201, description: 'Crédito creado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiBody({ type: CreateCreditoDto })
  create(@Body() createCreditoDto: CreateCreditoDto) {
    return this.creditoService.create(createCreditoDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener todos los créditos' })
  @ApiResponse({ status: 200, description: 'Lista de créditos devuelta' })
  getCreditos() {
    return this.creditoService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener un crédito por ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID único del crédito',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Crédito encontrado' })
  @ApiResponse({ status: 404, description: 'Crédito no encontrado' })
  getCredito(@Param('id') id: string) {
    return this.creditoService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Actualizar un crédito' })
  @ApiResponse({ status: 200, description: 'Crédito actualizado correctamente' })
  @ApiResponse({ status: 400, description: 'Crédito no encontrado' })
  @ApiBody({ type: UpdateCreditoDto })
  update(@Param('id') id: string, @Body() updateCreditoDto: UpdateCreditoDto) {
    return this.creditoService.update(+id, updateCreditoDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Eliminar un crédito' })
  @ApiResponse({ status: 200, description: 'Crédito eliminado correctamente' })
  @ApiResponse({ status: 400, description: 'Crédito no encontrado' })
  remove(@Param('id') id: string) {
    return this.creditoService.remove(+id);
  }
}
