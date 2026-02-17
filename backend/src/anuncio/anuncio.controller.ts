import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AnuncioService } from './anuncio.service';
import { CreateAnuncioDto } from './dto/create-anuncio.dto';
import { UpdateAnuncioDto } from './dto/update-anuncio.dto';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Anuncio')
@Controller('anuncio')
export class AnuncioController {
  constructor(private readonly anuncioService: AnuncioService) {}

  @ApiOperation({ summary: 'Crear un nuevo anuncio' })
  @ApiResponse({ status: 201, description: 'Anuncio creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiBody({ type: CreateAnuncioDto })
  @Post()
  create(@Body() createAnuncioDto: CreateAnuncioDto) {
    return this.anuncioService.create(createAnuncioDto);
  }
  @ApiOperation({ summary: 'Obtener anuncios activos ordenados' })
  @ApiResponse({ status: 200, description: 'Lista de anuncios obtenida exitosamente.' })
  @Get()
  getAnuncios() {
    return this.anuncioService.getAnuncios();
  }
  @ApiOperation({ summary: 'Obtener un anuncio por ID' })
  @ApiResponse({ status: 200, description: 'Anuncio obtenido exitosamente.' })
  @ApiResponse({ status: 404, description: 'Anuncio no encontrado.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.anuncioService.findOne(+id);
  }

  @ApiOperation({ summary: 'Actualizar un anuncio por ID' })
  @ApiResponse({ status: 200, description: 'Anuncio actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Anuncio no encontrado.' })
  @ApiBody({ type: UpdateAnuncioDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAnuncioDto: UpdateAnuncioDto) {
    return this.anuncioService.update(+id, updateAnuncioDto);
  }
  @ApiOperation({ summary: 'Eliminar un anuncio por ID' })
  @ApiResponse({ status: 200, description: 'Anuncio eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Anuncio no encontrado.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.anuncioService.remove(+id);
  }
}
