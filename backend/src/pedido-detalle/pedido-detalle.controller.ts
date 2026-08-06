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

class UpdatePedidoDetalleDto {
  quantity: number;
}

@ApiTags('PedidoDetalle')
@Controller('pedido-detalle')
export class PedidoDetalleController {
  constructor(private readonly pedidoDetalleService: PedidoDetalleService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener carrito (registrado o invitado)' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async getOrder(@Req() req: any) {
    const userId = req.user?.id;
    // Para usuarios no registrados, pueden pasar sessionToken en query
    if (!userId && !req.query?.sessionToken) {
      throw new BadRequestException('Usuario no autenticado o sessionToken requerido');
    }
    return this.pedidoDetalleService.findByUser(userId, req.query?.sessionToken);
  }

  @Post()
  @ApiOperation({ summary: 'Agregar producto al carrito (registrado o invitado)' })
  @ApiBody({ type: AddPedidoDetalleDto })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async addToOrder(@Req() req: any, @Body() body: AddPedidoDetalleDto) {
    const userId = req.user?.id;
    const sessionToken = body.sessionToken;

    if (!userId && !sessionToken) {
      throw new BadRequestException('Usuario no autenticado o sessionToken requerido');
    }
    if (!body?.idProducto) throw new BadRequestException('idProducto es requerido');
    if (!body?.quantity) throw new BadRequestException('quantity es requerido');

    return this.pedidoDetalleService.addToOrder(
      Number(body.idProducto),
      Number(body.quantity),
      userId,
      sessionToken,
    );
  }

  @Put(':idProducto')
  @ApiOperation({ summary: 'Actualizar cantidad del item del carrito' })
  @ApiParam({ name: 'idProducto', type: Number })
  @ApiBody({ type: UpdatePedidoDetalleDto })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async updateOrderItem(
    @Req() req: any,
    @Param('idProducto', ParseIntPipe) idProducto: number,
    @Body() body: UpdatePedidoDetalleDto,
  ) {
    const userId = req.user?.id;
    const sessionToken = body['sessionToken'];

    if (!userId && !sessionToken) {
      throw new BadRequestException('Usuario no autenticado o sessionToken requerido');
    }
    if (!body?.quantity) throw new BadRequestException('quantity es requerido');

    return this.pedidoDetalleService.updateOrderItem(
      idProducto,
      Number(body.quantity),
      userId,
      sessionToken,
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
    const userId = req.user?.id;
    const sessionToken = req.query?.sessionToken;

    if (!userId && !sessionToken) {
      throw new BadRequestException('Usuario no autenticado o sessionToken requerido');
    }

    return this.pedidoDetalleService.removeFromOrder(idProducto, userId, sessionToken);
  }
}
