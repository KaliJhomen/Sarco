import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PedidoDetalleService } from './pedido-detalle.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { AddPedidoDetalleDto } from './dto/add-pedido-detalle.dto';

@ApiTags('PedidoDetalle')
@Controller('pedido-detalle')
export class PedidoDetalleController {
  constructor(private readonly pedidoDetalleService: PedidoDetalleService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener carrito (registrado o invitado)' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async getOrder(@Req() req: any) {
    const idUsuario = req.usuario?.id;
    // Para usuarios no registrados, pueden pasar sessionToken en query
    if (!idUsuario && !req.query?.sessionToken) {
      throw new BadRequestException('Usuario no autenticado o sessionToken requerido');
    }
    return this.pedidoDetalleService.findByUser(idUsuario, req.query?.sessionToken);
  }

  @Post()
  @ApiOperation({ summary: 'Agregar producto al carrito (registrado o invitado)' })
  @ApiBody({ type: AddPedidoDetalleDto })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async addToOrder(@Req() req: any, @Body() body: AddPedidoDetalleDto) {
    const idUsuario = req.usuario?.id;
    const sessionToken = body.sessionToken;

    if (!idUsuario && !sessionToken) {
      throw new BadRequestException('Usuario no autenticado o sessionToken requerido');
    }
    if (!body?.idProducto) throw new BadRequestException('idProducto es requerido');
    if (!body?.cantidad) throw new BadRequestException('Cantidad es requerido');

    return this.pedidoDetalleService.addToOrder(
      Number(body.idProducto),
      Number(body.cantidad),
      idUsuario,
      sessionToken ?? undefined,
    );
  }

  @Put(':idProducto')
  @ApiOperation({ summary: 'Actualizar cantidad del item del carrito' })
  @ApiParam({ name: 'idProducto', type: Number })
  @ApiBody({ type: AddPedidoDetalleDto })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async updateOrderItem(
    @Req() req: any,
    @Param('idProducto', ParseIntPipe) idProducto: number,
    @Body() body: AddPedidoDetalleDto,
  ) {
    const idUsuario = req.usuario?.id;
    const sessionToken = body['sessionToken'];

    if (!idUsuario && !sessionToken) {
      throw new BadRequestException('Usuario no autenticado o sessionToken requerido');
    }
    if (!body?.cantidad) throw new BadRequestException('quantity es requerido');

    return this.pedidoDetalleService.updateOrderItem(
      idProducto,
      Number(body.cantidad),
      idUsuario,
      sessionToken ?? undefined,
    );
  }

  @Delete(':idProducto')
  @ApiOperation({ summary: 'Eliminar item del carrito' })
  @ApiParam({ name: 'idProducto', type: Number })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async removeFromOrder(
    @Req() req: any,
    @Param('idProducto', ParseIntPipe) idProducto: number,
  ) {
    const idUsuario = req.usuario?.id;
    const sessionToken = req.query?.sessionToken;

    if (!idUsuario && !sessionToken) {
      throw new BadRequestException('Usuario no autenticado o sessionToken requerido');
    }

    return this.pedidoDetalleService.removeFromOrder(idProducto, idUsuario, sessionToken);
  }
}
