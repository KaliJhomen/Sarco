import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarritoItem } from './entities/carrito-item.entity';
import { Carrito } from '../carrito/entities/carrito.entity';
import { Producto } from '../producto/entities/producto.entity';
import { Usuario } from '../usuario/entities/usuario.entity';

@Injectable()
export class CarritoItemService {
  constructor(
    @InjectRepository(CarritoItem)
    private readonly cartItemRepository: Repository<CarritoItem>,
    @InjectRepository(Carrito)
    private readonly cartRepository: Repository<Carrito>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  private async findClienteByUserId(idUsuario: number): Promise<Cliente> {
    const usuario = await this.usuarioRepository.findOne({ where: { idUsuario } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    let usuario = await this.usuarioRepository.findOne({ where: { email: usuario.email } });
    if (!usuario) {
      usuario = this.usuarioRepository.create({
        nombre: usuario.nombre,
        email: usuario.email,
      });
      usuario = await this.usuarioRepository.save(usuario);
    }
    return usuario;
  }

  private async getOrCreateCart({ idUser, sessionToken }: { idUser?: number, sessionToken?: string }): Promise<Carrito> {

    if (idUser) {
      const cliente = await this.findClienteByUserId(idUser);
      const cart = await this.cartRepository.findOne({ where: { cliente: { idCliente: cliente.idCliente } } });
      if (cart) return cart;
      const newCart = this.cartRepository.create({ cliente });
      return this.cartRepository.save(newCart);
    } else if (sessionToken) {
      const cart = await this.cartRepository.findOne({ where: { sessionToken } });
      if (cart) return cart;
      const newCart = this.cartRepository.create({ sessionToken });
      return this.cartRepository.save(newCart);
    } else {
      throw new BadRequestException('Debe proporcionar idUser o sessionToken');
    }
  }

  async findByUser({ idUser, sessionToken }: { idUser?: number, sessionToken?: string }) {
    let cart: Carrito | null = null;

    if (idUser) {
      const cliente = await this.findClienteByUserId(idUser);
      cart = await this.cartRepository.findOne({
        where: { cliente: { idCliente: cliente.idCliente } },
        relations: ['items', 'items.producto'],
      });
    } else if (sessionToken) {
      cart = await this.cartRepository.findOne({
        where: { sessionToken },
        relations: ['items', 'items.producto'],
      });
    } else {
      throw new BadRequestException('Debe proporcionar idUser o sessionToken');
    }

    if (!cart) {
      return {
        idUser,
        sessionToken,
        idCarrito: null,
        items: [],
        totalItems: 0,
      };
    }

    const items = cart.items || [];
    return {
      idUser,
      sessionToken,
      idCarrito: cart.idCarrito,
      items,
      totalItems: items.reduce((acc, it) => acc + (Number(it.cantidad) || 0), 0),
    };
  }

  async addToCart(
    { idUser, sessionToken }: { idUser?: number, sessionToken?: string },
    idProducto: number,
    quantity: number
  ) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestException('La cantidad debe ser mayor a 0');
    }

    const product = await this.productRepository.findOne({ where: { idProducto } });
    if (!product) throw new NotFoundException(`Producto con ID ${idProducto} no encontrado`);

    const cart = await this.getOrCreateCart({ idUser, sessionToken });

    const existingItem = await this.cartItemRepository.findOne({
      where: {
        carrito: { idCarrito: cart.idCarrito },
        producto: { idProducto },
      },
      relations: ['producto'],
    });

    if (existingItem) {
      existingItem.cantidad += quantity;
      return this.cartItemRepository.save(existingItem);
    }

    const newItem = this.cartItemRepository.create({
      carrito: cart,
      producto: product,
      cantidad: quantity,
    });

    return this.cartItemRepository.save(newItem);
  }

  async updateCartItem(params: { idUser?: number, sessionToken?: string }, idProducto: number, quantity: number) {
    const { idUser, sessionToken } = params;
    let cart: Carrito | null = null;

    if (idUser) {
      const cliente = await this.findClienteByUserId(idUser);
      cart = await this.cartRepository.findOne({
        where: { cliente: { idCliente: cliente.idCliente } },
      });
    } else if (sessionToken) {
      cart = await this.cartRepository.findOne({
        where: { sessionToken },
      });
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestException('La cantidad debe ser mayor a 0');
    }

    if (!cart) {
      throw new NotFoundException('Carrito no encontrado');
    }

    const existingItem = await this.cartItemRepository.findOne({
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
    return this.cartItemRepository.save(existingItem);
  }

  async removeFromCart(params: { idUser?: number, sessionToken?: string }, idProducto: number) {
    const { idUser, sessionToken } = params;
    let cart: Carrito | null = null;

    if (idUser) {
      const cliente = await this.findClienteByUserId(idUser);
      cart = await this.cartRepository.findOne({
        where: { cliente: { idCliente: cliente.idCliente } },
      });
    } else if (sessionToken) {
      cart = await this.cartRepository.findOne({
        where: { sessionToken },
      });
    }

    if (!cart) {
      throw new NotFoundException('Carrito no encontrado');
    }

    const existingItem = await this.cartItemRepository.findOne({
      where: {
        carrito: { idCarrito: cart.idCarrito },
        producto: { idProducto },
      },
    });

    if (!existingItem) {
      throw new NotFoundException(`El producto con ID ${idProducto} no está en el carrito`);
    }

    return this.cartItemRepository.remove(existingItem);
  }
}
