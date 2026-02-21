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
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import { CarritoItemService } from './carrito-item.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { CreateCarritoDto } from '../carrito/dto/create-carrito.dto';

class UpdateCartDto {
  quantity: number;
}

@ApiTags('CarritoItem')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('carrito-item')
export class CarritoItemController {
  constructor(private readonly carritoItemService: CarritoItemService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener carrito del usuario autenticado' })
  getCart(@Req() req: any) {
    const userId = req.user?.id;
    if (!userId) throw new BadRequestException('Usuario no autenticado');
    return this.carritoItemService.getCart(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Agregar producto al carrito del usuario autenticado' })
  @ApiBody({ type: CreateCarritoDto })
  addToCart(@Req() req: any, @Body() body: CreateCarritoDto) {
    const userId = req.user?.id;
    if (!userId) throw new BadRequestException('Usuario no autenticado');
    if (!body?.idProducto) throw new BadRequestException('idProducto es requerido');
    return this.carritoItemService.addToCart(userId, Number(body.idProducto), Number(body.quantity ?? 1));
  }

  @Put(':idProducto')
  @ApiOperation({ summary: 'Actualizar cantidad de un item del usuario autenticado' })
  @ApiParam({ name: 'idProducto', type: Number })
  @ApiBody({ type: UpdateCartDto })
  updateCartItem(
    @Req() req: any,
    @Param('idProducto', ParseIntPipe) idProducto: number,
    @Body() body: UpdateCartDto,
  ) {
    const userId = req.user?.id;
    if (!userId) throw new BadRequestException('Usuario no autenticado');
    if (!body?.quantity) throw new BadRequestException('quantity es requerido');
    return this.carritoItemService.updateCartItem(userId, idProducto, Number(body.quantity));
  }

  @Delete(':idProducto')
  @ApiOperation({ summary: 'Eliminar item del carrito del usuario autenticado' })
  @ApiParam({ name: 'idProducto', type: Number })
  removeFromCart(
    @Req() req: any,
    @Param('idProducto', ParseIntPipe) idProducto: number,
  ) {
    const userId = req.user?.id;
    if (!userId) throw new BadRequestException('Usuario no autenticado');
    return this.carritoItemService.removeFromCart(userId, idProducto);
  }
}
