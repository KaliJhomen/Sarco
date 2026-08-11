import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { MarcaService } from './marca.service';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { AuthGuard } from '../auth/guard/auth.guard';

@ApiTags('Marca')
@Controller('marca')
export class MarcaController {
  constructor(private readonly marcaService: MarcaService) {}

  @Post()
  //@UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Crear una nueva marca' })
  @ApiResponse({ status: 201, description: 'Marca creada correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiBody({ type: CreateMarcaDto })
  async create(@Body() createMarcaDto: CreateMarcaDto) {
    return await this.marcaService.create(createMarcaDto);
  }
  //@UseGuards(AuthGuard)
  @Get()
  @ApiOperation({ summary: 'Obtener todas las marcas' })
  @ApiResponse({ status: 200, description: 'Marcas obtenidas correctamente' })
  async findAll() {
    return await this.marcaService.findAll();
  }
  //@UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Obtener una marca por ID' })
  @ApiResponse({ status: 200, description: 'Marca obtenida correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async findOne(@Param('id') id: string) {
    return await this.marcaService.findOne(+id);
  }
  //@UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una marca' })
  @ApiResponse({ status: 201, description: 'Marca actualizada correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiBody({ type: UpdateMarcaDto })
  async update(@Param('id') id: string, @Body() updateMarcaDto: UpdateMarcaDto) {
    return await this.marcaService.update(+id, updateMarcaDto);
  }

  @Delete(':id')
  //@UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Eliminar una marca' })
  @ApiResponse({ status: 200, description: 'Marca eliminada correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async remove(@Param('id') id: string) {
    return await this.marcaService.remove(+id);
  }
}
