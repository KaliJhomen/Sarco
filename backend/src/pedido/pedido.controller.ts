import {
  Controller,
  Get,
  Post,
  Patch,
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
import { UpdatePedidoDto} from './dto/update-pedido.dto'
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
    const idCliente = req.cliente?.id;
    if (!idCliente) throw new BadRequestException('cliente no autenticado');
    return this.pedidoService.createPedido(idCliente, body);
  }

  @Patch(':idPedido')
  @ApiOperation({ summary: 'Actualizar pedido (cancelar o editar dirección)' })
  async updatePedido(
    @Param('idPedido', ParseIntPipe) idPedido: number,
    @Req() req: any,
    @Body() body: UpdatePedidoDto,
  ) {
    const idCliente = req.cliente?.id;
    if (!idCliente) throw new BadRequestException('cliente no autenticado');
    return this.pedidoService.update(idPedido, body, idCliente);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los pedidos del cliente autenticado' })
  async getPedidosByUser(@Req() req: any) {
    const idCliente = req.cliente?.id;
    if (!idCliente) throw new BadRequestException('cliente no autenticado');
    return this.pedidoService.findByUserId(idCliente);
  }

  @Get(':idPedido')
  @ApiOperation({ summary: 'Obtener un pedido por ID' })
  @ApiParam({ name: 'idPedido', type: Number })
  async getPedidoById(@Param('idPedido', ParseIntPipe) idPedido: number) {
    return this.pedidoService.findOne(idPedido);
  }
}
