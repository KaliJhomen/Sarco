import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Req,
  UseGuards,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import { PedidoService } from './pedido.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { CreatePedidoDto } from './dto/create-pedido.dto';

@ApiTags('Pedido')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('pedido')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo pedido (checkout)' })
  @ApiBody({ type: CreatePedidoDto })
  async createPedido(@Req() req: any, @Body() body: CreatePedidoDto) {
    const idUser = req.usuario?.id;
    if (!idUser) throw new BadRequestException('Usuario no autenticado');
    if (!Array.isArray(body.items) || body.items.length === 0) {
      throw new BadRequestException('Debes enviar al menos un producto en items');
    }
    return this.pedidoService.createPedido(
      idUser,
      {
        nombre: body.nombre,
        email: body.email,
        telefono: body.telefono,
        direccion: body.direccion,
        ciudad: body.ciudad,
      },
      body.items
    );
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los pedidos del usuario autenticado' })
  async getPedidosByUser(@Req() req: any) {
    const idUser = req.usuario?.id;
    if (!idUser) throw new BadRequestException('Usuario no autenticado');
    return this.pedidoService.findByUserId(idUser);
  }

  @Get(':idPedido')
  @ApiOperation({ summary: 'Obtener un pedido por ID' })
  @ApiParam({ name: 'idPedido', type: Number })
  async getPedidoById(@Param('idPedido', ParseIntPipe) idPedido: number) {
    return this.pedidoService.findOne(idPedido);
  }
}
