import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TiendaService } from './tienda.service';
import { CreateTiendaDto } from './dto/create-tienda.dto';
import { UpdateTiendaDto } from './dto/update-tienda.dto';
import { AuthGuard } from '../auth/guard/auth.guard';

@ApiTags('Tienda')
@Controller('tienda')
export class TiendaController {
  constructor(private readonly tiendaService: TiendaService) {}

  @Post()
  //@UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Crear una tienda' })
  @ApiResponse({ status: 201, description: 'Tienda creada correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() createTiendaDto: CreateTiendaDto) {
    return await this.tiendaService.create(createTiendaDto);
  }
  @Get()
  //@UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener Todas las tiendas' })
  @ApiResponse({ status: 200, description: 'Tiendas obtenidas correctamente' })
  async findAll() {
    return await this.tiendaService.findAll();
  }

  @Get(':id')
  //@UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener tienda por id' })
  @ApiResponse({ status: 200, description: 'Tienda obtenida correctamente' })
  @ApiResponse({ status: 404, description: 'No existe esa tienda' })
  async findOne(@Param('id') id: string) {
    return await this.tiendaService.findOne(+id);
  }

  @Patch(':id')
  //@UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Actualizar una Tienda' })
  @ApiResponse({ status: 200, description: 'Tienda actualizada correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiBody({ type: UpdateTiendaDto })
  async update(@Param('id') id: string, @Body() updateTiendaDto: UpdateTiendaDto) {
    return await this.tiendaService.update(+id, updateTiendaDto);
  }
  @Delete(':id')
  //@UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Eliminar una tienda' })
  @ApiResponse({ status: 200, description: 'Tienda eliminada correctamente' })
  @ApiResponse({ status: 404, description: 'No existe una tienda con ese ID' })
  async remove(@Param('id') id: string) {
    return await this.tiendaService.remove(+id);
  }
}
