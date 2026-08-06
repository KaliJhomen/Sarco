import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AgendaService } from './agenda.service';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { UpdateAgendaDto } from './dto/update-agenda.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { UpdateEstadoAgendaDto } from './dto/state-agenda.dto';

@ApiTags('Agenda')
@Controller('agenda')
export class AgendaController {
  constructor(private readonly agendaService: AgendaService) { }

  @Post()
  //@UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Crear una nueva agenda' })
  @ApiResponse({ status: 201, description: 'Agenda creada correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiBody({ type: CreateAgendaDto })
  create(@Body() createAgendaDto: CreateAgendaDto) {
    return this.agendaService.create(createAgendaDto);
  }

  @Get()
  //@UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener todas las agendas' })
  @ApiResponse({ status: 200, description: 'Lista de agendas devuelta' })
  getAgendas() {
    return this.agendaService.findAll();
  }

  @Get(':id')
  //@UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener una agenda por ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID único de la agenda',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Agenda encontrada' })
  @ApiResponse({ status: 404, description: 'Agenda no encontrada' })
  getAgenda(@Param('id') id: string) {
    return this.agendaService.findOne(+id);
  }

  @Patch(':id')
  //@UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Actualizar una agenda' })
  @ApiResponse({ status: 200, description: 'Agenda actualizada correctamente' })
  @ApiResponse({ status: 400, description: 'Agenda no encontrada' })
  @ApiBody({ type: UpdateAgendaDto })
  update(@Param('id') id: string, @Body() updateAgendaDto: UpdateAgendaDto) {
    return this.agendaService.update(+id, updateAgendaDto);
  }
  
  @Patch('estado/:id')  
  //@UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Actualizar estado de una agenda' })
  @ApiResponse({ status: 200, description: 'Agenda actualizada correctamente' })
  @ApiResponse({ status: 400, description: 'Agenda no encontrada' })
  @ApiBody({ type: UpdateEstadoAgendaDto })
  updateEstado(@Param('id') id: string, @Body() updateEstadoAgendaDto: UpdateEstadoAgendaDto) {
    return this.agendaService.updateEstadoAgenda(+id, updateEstadoAgendaDto);
  }

  @Delete(':id')
  //@UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Eliminar una agenda' })
  @ApiResponse({ status: 200, description: 'Agenda eliminada correctamente' })
  deleteAgenda(@Param('id') id: string) {
    return this.agendaService.remove(+id);
  }
}
