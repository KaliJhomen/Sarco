import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carrito } from './entities/carrito.entity';
import { Producto } from '../producto/entities/producto.entity';

@Injectable()
export class CarritoService {
  constructor(
    @InjectRepository(Carrito)
    private readonly carritoRepository: Repository<Carrito>,
    @InjectRepository(Producto)
    private readonly productRepository: Repository<Producto>,
  ) {}

  async getCart(idUser: number) {
    console.log('Obteniendo carrito para el usuario con ID:', idUser);

    if (!idUser) {
      throw new BadRequestException('El ID del usuario es requerido.');
    }

    try {
      const cart = await this.carritoRepository.find({
        where: { user: { idUser } },
        relations: ['producto'],
      });

      if (!cart || cart.length === 0) {
        console.log('El carrito está vacío para el usuario con ID:', idUser);
        throw new NotFoundException('El carrito está vacío.');
      }

      console.log('Carrito encontrado:', cart);
      return cart;
    } catch (error) {
      console.error('Error al obtener el carrito:', error);
      throw new BadRequestException('Error al obtener el carrito: ' + error.message);
    }
  }

  async addToCart(idUser: number, idProducto: number, quantity: number) {
    if (quantity <= 0) {
      throw new BadRequestException('La cantidad debe ser mayor a 0');
    }

    const product = await this.productRepository.findOne({ where: { idProducto } });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${idProducto} no encontrado`);
    }

    const existingItem = await this.carritoRepository.findOne({
      where: { user: { idUser }, producto: { idProducto } }, // Usa 'producto' en lugar de 'idProducto'
    });

    if (existingItem) {
      // Si el producto ya está en el carrito, actualiza la cantidad
      existingItem.cantidad += quantity;
      return this.carritoRepository.save(existingItem);
    }

    // Si no está en el carrito, añádelo
    const newCartItem = this.carritoRepository.create({
      user: { idUser },
      producto: product, // Usa el objeto 'product' directamente
      cantidad: quantity,
    });
    return this.carritoRepository.save(newCartItem);
  }

  async updateCartItem(idUser: number, idProducto: number, quantity: number) {
    if (quantity <= 0) {
      throw new BadRequestException('La cantidad debe ser mayor a 0');
    }

    const existingItem = await this.carritoRepository.findOne({
      where: { user: { idUser }, producto: { idProducto } }, // Usa 'producto' en lugar de 'idProducto'
    });

    if (!existingItem) {
      throw new NotFoundException(`El producto con ID ${idProducto} no está en el carrito`);
    }

    existingItem.cantidad = quantity;
    return this.carritoRepository.save(existingItem);
  }

  async removeFromCart(idUser: number, idProducto: number) {
    const existingItem = await this.carritoRepository.findOne({
      where: { user: { idUser }, producto: { idProducto } }, // Usa 'producto' en lugar de 'idProducto'
    });

    if (!existingItem) {
      throw new NotFoundException(`El producto con ID ${idProducto} no está en el carrito`);
    }

    return this.carritoRepository.remove(existingItem);
  }
}
