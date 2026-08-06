import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  Query,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CarritoItemService } from './carrito-item.service';
import { CreateCarritoDto } from '../carrito/dto/create-carrito.dto';

class UpdateCartDto {
  quantity: number;
}

@ApiTags('CarritoItem')
@Controller('carrito-item')
export class CarritoItemController {
  constructor(private readonly carritoItemService: CarritoItemService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener carrito del usuario o invitado' })
  @ApiQuery({ name: 'sessionToken', required: false, type: String })
  getCart(@Req() req: any, @Query('sessionToken') sessionToken?: string) {
    const idUser = req.user?.id;
    if (!idUser && !sessionToken) throw new BadRequestException('Debe estar autenticado o enviar sessionToken');
    return this.carritoItemService.findByUser({ idUser, sessionToken });
  }

  @Post()
  @ApiOperation({ summary: 'Agregar producto al carrito (usuario o invitado)' })
  @ApiBody({ type: CreateCarritoDto })
  addToCart(@Req() req: any, @Body() body: CreateCarritoDto) {
    const idUser = req.user?.id;
    const sessionToken = body.sessionToken;
    if (!idUser && !sessionToken) throw new BadRequestException('Debe estar autenticado o enviar sessionToken');
    if (!body?.idProducto) throw new BadRequestException('idProducto es requerido');
    return this.carritoItemService.addToCart(
      { idUser, sessionToken },
      Number(body.idProducto),
      Number(body.quantity ?? 1),
    );
  }

  @Put(':idProducto')
  @ApiOperation({ summary: 'Actualizar cantidad de un item (usuario o invitado)' })
  @ApiParam({ name: 'idProducto', type: Number })
  @ApiBody({ type: UpdateCartDto })
  updateCartItem(
    @Req() req: any,
    @Param('idProducto', ParseIntPipe) idProducto: number,
    @Body() body: UpdateCartDto,
    @Query('sessionToken') sessionToken?: string,
  ) {
    const idUser = req.user?.id;
    if (!idUser && !sessionToken) throw new BadRequestException('Debe estar autenticado o enviar sessionToken');
    if (!body?.quantity) throw new BadRequestException('La cantidad es requerida');
    return this.carritoItemService.updateCartItem(
      { idUser, sessionToken },
      idProducto,
      Number(body.quantity),
    );
  }

  @Delete(':idProducto')
  @ApiOperation({ summary: 'Eliminar item del carrito (usuario o invitado)' })
  @ApiParam({ name: 'idProducto', type: Number })
  removeFromCart(
    @Req() req: any,
    @Param('idProducto', ParseIntPipe) idProducto: number,
    @Query('sessionToken') sessionToken?: string,
  ) {
    const idUser = req.user?.id;
    if (!idUser && !sessionToken) throw new BadRequestException('Debe estar autenticado o enviar sessionToken');
    return this.carritoItemService.removeFromCart(
      { idUser, sessionToken },
      idProducto,
    );
  }
}
