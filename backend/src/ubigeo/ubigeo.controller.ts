import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { UbigeoService } from './ubigeo.service';
import { GuestGuard } from '../auth/guard/guest.guard';

@ApiTags('Ubigeo')
@UseGuards(GuestGuard)
@Controller('ubigeo')
export class UbigeoController {
  constructor(private readonly ubigeoService: UbigeoService) {}
  @Get('departamentos')
  @ApiOperation({ summary: 'Listar departamentos' })
  getDepartamentos() {
    return this.ubigeoService.getDepartamentos();
  }

  @Get('provincias/:codigo')
  @ApiOperation({ summary: 'Provincias de un departamento (código o 2 primeros dígitos)' })
  @ApiParam({ name: 'codigo', type: String })
  getProvincias(@Param('codigo') codigo: string) {
    return this.ubigeoService.getProvincias(codigo);
  }

  @Get('distritos/:codigo')
  @ApiOperation({ summary: 'Distritos de una provincia (código o 4 primeros dígitos)' })
  @ApiParam({ name: 'codigo', type: String })
  getDistritos(@Param('codigo') codigo: string) {
    return this.ubigeoService.getDistritos(codigo);
  }
}