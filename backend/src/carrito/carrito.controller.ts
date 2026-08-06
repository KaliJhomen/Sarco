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
import { CarritoService } from './carrito.service';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { IsInt, Min } from 'class-validator';
import { UseGuards } from '@nestjs/common';
import { GuestGuard } from '../auth/guard/guest.guard';

class UpdateCartDto {
  @IsInt()
  @Min(1)
  quantity: number;
}

@ApiTags('Carrito')
@Controller('carrito')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  @UseGuards(GuestGuard)
  @Get()
  @ApiOperation({ summary: 'Obtener carrito del usuario o invitado' })
  @ApiQuery({ name: 'sessionToken', required: false, type: String })
  getCart(@Req() req: any, @Query('sessionToken') sessionToken?: string) {
    const idUser = req.user?.id;
    if (!idUser && !sessionToken) throw new BadRequestException('Debe estar autenticado o enviar sessionToken');
    return this.carritoService.findByUser({ idUser, sessionToken });
  }

  @UseGuards(GuestGuard)
  @Post()
  @ApiOperation({ summary: 'Agregar producto al carrito (usuario o invitado)' })
  @ApiBody({ type: CreateCarritoDto })
  async addToCart(@Req() req: any, @Body() body: CreateCarritoDto) {
    const idUser = req.user?.id;
    const sessionToken = idUser ? undefined : body.sessionToken;
    if (!idUser && !sessionToken) throw new BadRequestException('Debe estar autenticado o enviar sessionToken');
    return this.carritoService.addToCart(
      { idUser, sessionToken },
      body.idProducto,
      body.quantity ?? 1,
    );
  }

  @UseGuards(GuestGuard)
  @Post('share')
  @ApiOperation({ summary: 'Generar link para compartir carrito' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        idUser: { type: 'number' },
        sessionToken: { type: 'string' },
      },
    },
  })
  async generateShareLink(@Body() ident: { idUser?: number; sessionToken?: string }) {
    return this.carritoService.generateShareCartLink(ident);
  }

  @UseGuards(GuestGuard)
  @Put(':idProducto')
  @ApiOperation({ summary: 'Actualizar cantidad de un producto del carrito (usuario o invitado)' })
  @ApiParam({ name: 'idProducto', type: Number })
  @ApiBody({ type: UpdateCartDto })
  async updateCartItem(
    @Req() req: any,
    @Param('idProducto', ParseIntPipe) idProducto: number,
    @Body() body: UpdateCartDto,
    @Query('sessionToken') sessionToken?: string,
  ) {
    const idUser = req.user?.id;
    if (!idUser && !sessionToken) throw new BadRequestException('Debe estar autenticado o enviar sessionToken');
    if (!body?.quantity) throw new BadRequestException('La cantidad es requerida');
    return this.carritoService.updateCartItem(
      { idUser, sessionToken },
      idProducto,
      Number(body.quantity),
    );
  }

  @UseGuards(GuestGuard)
  @Delete(':idProducto')
  @ApiOperation({ summary: 'Eliminar producto del carrito (usuario o invitado)' })
  @ApiParam({ name: 'idProducto', type: Number })
  async removeFromCart(
    @Req() req: any,
    @Param('idProducto', ParseIntPipe) idProducto: number,
    @Query('sessionToken') sessionToken?: string,
  ) {
    const idUser = req.user?.id;
    if (!idUser && !sessionToken) throw new BadRequestException('Debe estar autenticado o enviar sessionToken');
    return this.carritoService.removeFromCart(
      { idUser, sessionToken },
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
