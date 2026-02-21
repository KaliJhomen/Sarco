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
import { CarritoService } from './carrito.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { IsInt, Min } from 'class-validator';

class UpdateCartDto {
  @IsInt()
  @Min(1)
  quantity: number;
}

@ApiTags('Carrito')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('carrito')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener carrito del usuario autenticado' })
  getCart(@Req() req: any) {
    const idUser = req.user.id;
    if (!idUser) throw new BadRequestException('Usuario no autenticado');
    return this.carritoService.getCart(idUser);
  }

  @Post()
  @ApiOperation({ summary: 'Agregar producto al carrito' })
  @ApiBody({ type: CreateCarritoDto })
  addToCart(@Req() req: any, @Body() body: CreateCarritoDto) {
    const idUser = req.user.id;
    if (!idUser) throw new BadRequestException('Usuario no autenticado');
    return this.carritoService.addToCart(idUser, body.idProducto, body.quantity ?? 1);
  }

  @Put(':idProducto')
  @ApiOperation({ summary: 'Actualizar cantidad de un producto del carrito' })
  @ApiParam({ name: 'idProducto', type: Number })
  @ApiBody({ type: UpdateCartDto })
  updateCartItem(
    @Req() req: any,
    @Param('idProducto', ParseIntPipe) idProducto: number,
    @Body() body: UpdateCartDto,
  ) {
    const idUser = req.user.id;
    if (!idUser) throw new BadRequestException('Usuario no autenticado');
    if (!body?.quantity) throw new BadRequestException('quantity es requerido');
    return this.carritoService.updateCartItem(idUser, idProducto, Number(body.quantity));
  }

  @Delete(':idProducto')
  @ApiOperation({ summary: 'Eliminar producto del carrito' })
  @ApiParam({ name: 'idProducto', type: Number })
  removeFromCart(@Req() req: any, @Param('idProducto', ParseIntPipe) idProducto: number) {
    const idUser = req.user.id;
    if (!idUser) throw new BadRequestException('Usuario no autenticado');
    return this.carritoService.removeFromCart(idUser, idProducto);
  }
}
