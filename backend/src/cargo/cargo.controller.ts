import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CargoService } from './cargo.service';
import { CreateCargoDto } from './dto/create-cargo.dto';
import { UpdateCargoDto } from './dto/update-cargo.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@ApiTags('Cargo')
@Controller('cargo')
export class CargoController {
  constructor(private readonly cargoService: CargoService) {}

  @Post()
 // @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Crear un nuevo cargo' })
  @ApiResponse({ status: 201, description: 'Cargo creado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiBody({ type: CreateCargoDto })
  createCargo(@Body() createCargoDto: CreateCargoDto) {
    return this.cargoService.create(createCargoDto);
  }

  @Get()
 // @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener todos los cargos' })
  @ApiResponse({ status: 200, description: 'Lista de cargos devuelta' })
  getCargos() {
    return this.cargoService.findAll();
  }

  @Get(':id')
  //@UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener un cargo por ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID único del cargo',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Cargo encontrado' })
  @ApiResponse({ status: 404, description: 'Cargo no encontrado' })
  getCargo(@Param('id') id: string) {
    return this.cargoService.findOne(+id);
  }

  @Patch(':id')
  //@UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Actualizar un cargo' })
  @ApiResponse({ status: 200, description: 'Cargo actualizado correctamente' })
  @ApiResponse({ status: 400, description: 'Cargo no encontrado' })
  @ApiBody({ type: UpdateCargoDto })
  update(@Param('id') id: string, @Body() updateCargoDto: UpdateCargoDto) {
    return this.cargoService.update(+id, updateCargoDto);
  }

  @Delete(':id')
  //@UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Eliminar un cargo' })
  @ApiResponse({ status: 200, description: 'Cargo eliminado correctamente' })
  @ApiResponse({ status: 400, description: 'Cargo no encontrado' })
  remove(@Param('id') id: string) {
    return this.cargoService.remove(+id);
  }
}
