import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';

@ApiTags('Cliente')
@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post()
  //@UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente creado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiBody({ type: CreateClienteDto })
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clienteService.create(createClienteDto);
  }

  @Get()
  async findAll(@Query() query) {
    // query: q, nombre, numeroDocumento, idDocumento, direccion, referencia, telefono, email, estado, page, limit, sortBy, sortOrder
    return this.clienteService.findAll();
  }

  @Post('filter')
  async filter(@Body() body) {
    return this.clienteService.filterWithBody(body);
  }

  @Get(':id')
  //@UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener un cliente por ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del cliente',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  getCliente(@Param('id') id: string) {
    return this.clienteService.findOne(+id);
  }

  @Patch(':id')
  //@UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Actualizar un cliente' })
  @ApiResponse({ status: 200, description: 'Cliente actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  @ApiBody({ type: UpdateClienteDto })
  update(@Param('id') id: string, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clienteService.update(+id, updateClienteDto);
  }

  @Delete(':id')
  //@UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Eliminar un cliente' })
  @ApiResponse({ status: 200, description: 'Cliente eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  remove(@Param('id') id: string) {
    return this.clienteService.remove(+id);
  }
}
