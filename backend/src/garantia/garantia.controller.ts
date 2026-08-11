import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';


import { GarantiaService } from './garantia.service';
import { CreateGarantiaDto } from './dto/create-garantia.dto';
import { UpdateGarantiaDto } from './dto/update-garantia.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
@ApiTags('Garantia')
@Controller('garantia')
export class GarantiaController {
  constructor(private readonly garantiaService: GarantiaService) {}
  @Post()
  //@UseGuards()
  @ApiOperation({ summary: 'Crear un nueva Garantia' })
  @ApiResponse({ status: 201, description: 'Garantia creada correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiBody({ type: CreateGarantiaDto })
  async create(@Body() createGarantiaDto: CreateGarantiaDto) {
    if ((createGarantiaDto as any)?.idArticulo !== undefined) {
      throw new BadRequestException('Campo idArticulo no permitido. Use idProducto.');
    }
    if (createGarantiaDto?.idProducto === undefined || createGarantiaDto?.idProducto === null) {
      throw new BadRequestException('idProducto es requerido.');
    }
    return await this.garantiaService.create(createGarantiaDto);
  }

  @Get()
  async findAll() {
    return await this.garantiaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener garantia por ID' })
  @ApiResponse({ status: 200, description: 'Garantia obtenida correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async findOne(@Param('id') id: string) {
    return await this.garantiaService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateGarantiaDto: UpdateGarantiaDto) {
    if ((updateGarantiaDto as any)?.idArticulo !== undefined) {
      throw new BadRequestException('Campo idArticulo no permitido. Use idProducto.');
    }
    if ('idProducto' in (updateGarantiaDto as any) && (updateGarantiaDto as any).idProducto == null) {
      throw new BadRequestException('Si envía idProducto debe ser un valor válido.');
    }
    return await this.garantiaService.update(+id, updateGarantiaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.garantiaService.remove(+id);
  }
}
