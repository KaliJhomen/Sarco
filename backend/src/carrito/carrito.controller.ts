import { Controller, Get, Post, Put, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { CarritoService } from './carrito.service';

@Controller('carrito')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  @Get()
  getCart(@Req() req) {
    const userId = req.user.id; // Obtén el ID del usuario autenticado
    return this.carritoService.getCart(userId);
  }

  @Post()
  addToCart(@Req() req, @Body() body: { productId: number; quantity: number }) {
    const userId = req.user.id;
    return this.carritoService.addToCart(userId, body.productId, body.quantity);
  }

  @Put(':productId')
  updateCartItem(
    @Req() req,
    @Param('productId') productId: number,
    @Body() body: { quantity: number },
  ) {
    const userId = req.user.id;
    return this.carritoService.updateCartItem(userId, productId, body.quantity);
  }

  @Delete(':productId')
  removeFromCart(@Req() req, @Param('productId') productId: number) {
    const userId = req.user.id;
    return this.carritoService.removeFromCart(userId, productId);
  }
}
