import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ColorService } from './color.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { AuthGuard } from '../auth/guard/auth.guard';

@ApiTags('Color')
@Controller('color')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Post()
  //@UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Crear un nuevo color' })
  @ApiResponse({ status: 201, description: 'Color creado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiBody({ type: CreateColorDto })
  create(@Body() createColorDto: CreateColorDto) {
    return this.colorService.create(createColorDto);
  }
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un color por ID' })
  @ApiResponse({ status: 200, description: 'Color obtenido correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  findOne(@Param('id') id: string) {
    return this.colorService.findOne(+id);
  }
  @Get()
  //@UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener todos los colores' })
  @ApiResponse({ status: 200, description: 'Colores obtenidos correctamente' })
  @ApiResponse({ status: 400, description: 'Error al obtener colores' })
  findAll() {
    return this.colorService.findAll();
  }

  @Patch(':id')
  //@UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Actualizar Color' })
  @ApiResponse({ status: 200, description: 'Color actualizado correctamente' })
  @ApiResponse({ status: 400, description: 'Actualización fallida' })
  @ApiBody({ type: UpdateColorDto })
  update(@Param('id') id: string, @Body() updateColorDto: UpdateColorDto) {
    return this.colorService.update(+id, updateColorDto);
  }

  @Delete(':id')
  //@UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Eliminar un Color' })
  @ApiResponse({ status: 200, description: 'Color eliminado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  remove(@Param('id') id: string) {
    return this.colorService.remove(+id);
  }
}