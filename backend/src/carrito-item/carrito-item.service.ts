import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarritoItem } from './entities/carrito-item.entity';
import { Carrito } from '../carrito/entities/carrito.entity';
import { Producto } from '../producto/entities/producto.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class CarritoItemService {
  constructor(
    @InjectRepository(CarritoItem)
    private readonly carritoItemRepository: Repository<CarritoItem>,
    @InjectRepository(Carrito)
    private readonly carritoRepository: Repository<Carrito>,
    @InjectRepository(Producto)
    private readonly productRepository: Repository<Producto>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private async getOrCreateCart(idUser: number): Promise<Carrito> {
    const user = await this.userRepository.findOne({ where: { idUser } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${idUser} no encontrado`);
    }

    let cart = await this.carritoRepository.findOne({
      where: { user: { idUser } },
    });

    if (!cart) {
      cart = this.carritoRepository.create({ user });
      cart = await this.carritoRepository.save(cart);
    }

    return cart;
  }

  async getCart(idUser: number) {
    const cart = await this.carritoRepository.findOne({
      where: { user: { idUser } },
      relations: ['items', 'items.producto'],
    });

    if (!cart) {
      return {
        userId: idUser,
        idCarrito: null,
        items: [],
        totalItems: 0,
      };
    }

    const items = cart.items || [];

    return {
      userId: idUser,
      idCarrito: cart.idCarrito,
      items,
      totalItems: items.reduce((acc, it) => acc + (Number(it.cantidad) || 0), 0),
    };
  }

  async addToCart(idUser: number, idProducto: number, quantity: number) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestException('La cantidad debe ser mayor a 0');
    }

    const product = await this.productRepository.findOne({ where: { idProducto } });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${idProducto} no encontrado`);
    }

    const cart = await this.getOrCreateCart(idUser);

    const existingItem = await this.carritoItemRepository.findOne({
      where: {
        carrito: { idCarrito: cart.idCarrito },
        producto: { idProducto },
      },
      relations: ['producto'],
    });

    if (existingItem) {
      existingItem.cantidad += quantity;
      return this.carritoItemRepository.save(existingItem);
    }

    const newItem = this.carritoItemRepository.create({
      carrito: cart,
      producto: product,
      cantidad: quantity,
    });

    return this.carritoItemRepository.save(newItem);
  }

  async updateCartItem(idUser: number, idProducto: number, quantity: number) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestException('La cantidad debe ser mayor a 0');
    }

    const cart = await this.carritoRepository.findOne({
      where: { user: { idUser } },
    });

    if (!cart) {
      throw new NotFoundException('Carrito no encontrado');
    }

    const existingItem = await this.carritoItemRepository.findOne({
      where: {
        carrito: { idCarrito: cart.idCarrito },
        producto: { idProducto },
      },
      relations: ['producto'],
    });

    if (!existingItem) {
      throw new NotFoundException(`El producto con ID ${idProducto} no está en el carrito`);
    }

    existingItem.cantidad = quantity;
    return this.carritoItemRepository.save(existingItem);
  }

  async removeFromCart(idUser: number, idProducto: number) {
    const cart = await this.carritoRepository.findOne({
      where: { user: { idUser } },
    });

    if (!cart) {
      throw new NotFoundException('Carrito no encontrado');
    }

    const existingItem = await this.carritoItemRepository.findOne({
      where: {
        carrito: { idCarrito: cart.idCarrito },
        producto: { idProducto },
      },
    });

    if (!existingItem) {
      throw new NotFoundException(`El producto con ID ${idProducto} no está en el carrito`);
    }

    return this.carritoItemRepository.remove(existingItem);
  }
}
