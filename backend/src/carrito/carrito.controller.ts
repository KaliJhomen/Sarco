import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CarritoService } from './carrito.service';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { UpdateCarritoDto } from './dto/update-carrito.dto';
import { UseGuards } from '@nestjs/common';
import { GuestGuard } from '../auth/guard/guest.guard';
import { Identity } from 'src/auth/decorators/identity.decorator';
@ApiTags('Carrito')
@Controller('carrito')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}
  @UseGuards(GuestGuard)
  @Get()
  @ApiOperation({ summary: 'Obtener carrito del cliente o invitado' })
  async getCart(@Identity('id') idCliente: number, @Identity('sessionToken') sessionToken: string) {
    if (!idCliente && !sessionToken) throw new BadRequestException('Debe estar autenticado o enviar sessionToken');
    return this.carritoService.findByClient({ idCliente, sessionToken });
  }

  @UseGuards(GuestGuard)
  @Post()
  @ApiOperation({ summary: 'Agregar producto al carrito (cliente o invitado)' })
  @ApiBody({ type: CreateCarritoDto })
  async addToCart(@Identity('id') idCliente: number, @Identity('sessionToken') sessionToken: string, @Body() body: CreateCarritoDto) {
    if (!idCliente && !sessionToken) throw new BadRequestException('Debe estar autenticado o enviar sessionToken');
    return this.carritoService.addToCart(
      { idCliente,   sessionToken },
      body.idProducto,
      body.cantidad,
    );
  }

  @UseGuards(GuestGuard)
  @Post('share')
  @ApiOperation({ summary: 'Generar link para compartir carrito' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        idCliente: { type: 'number' },
        sessionToken: { type: 'string' },
      },
    },
  })
  async generateShareLink(@Body() ident: { idCliente?: number; sessionToken?: string }) {
    return this.carritoService.generateShareCartLink(ident);
  }

  @UseGuards(GuestGuard)
  @Put(':idProducto')
  @ApiOperation({ summary: 'Actualizar cantidad de un producto del carrito (cliente o invitado)' })
  @ApiParam({ name: 'idProducto', type: Number })
  @ApiBody({ type: UpdateCarritoDto })
  async updateCartItem(
    @Identity('id') idCliente: number, @Identity('sessionToken') sessionToken: string,
    @Param('idProducto', ParseIntPipe) idProducto: number,
    @Body() body: UpdateCarritoDto,
  ) {
    if (!idCliente && !sessionToken) throw new BadRequestException('Debe estar autenticado o enviar sessionToken');
    if (!body?.cantidad) throw new BadRequestException('La cantidad es requerida');
    return this.carritoService.updateCartItem(
      { idCliente, sessionToken },
      idProducto,
      Number(body.cantidad),
    );
  }

  @UseGuards(GuestGuard)
  @Delete(':idProducto')
  @ApiOperation({ summary: 'Eliminar producto del carrito (cliente o invitado)' })
  @ApiParam({ name: 'idProducto', type: Number })
  async removeFromCart(
    @Identity('id') idCliente: number, @Identity('sessionToken') sessionToken: string,
    @Param('idProducto', ParseIntPipe) idProducto: number,
  ) {
    if (!idCliente && !sessionToken) throw new BadRequestException('Debe estar autenticado o enviar sessionToken');
    return this.carritoService.removeFromCart(
      { idCliente, sessionToken },
      idProducto,
    );
  }

  @UseGuards(GuestGuard)
  @Get('shared/:token')
  @ApiOperation({ summary: 'Obtener carrito compartido' })
  @ApiParam({
    name: 'token',
    description: 'Token del carrito compartido',
    type: String,
    required: true,
  })
  async getSharedCart(@Param('token') token: string) {
    return this.carritoService.findByShareToken(token);
  }
}
