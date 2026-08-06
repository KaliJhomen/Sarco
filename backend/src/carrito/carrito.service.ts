import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carrito } from './entities/carrito.entity';
import { CarritoItem } from '../carrito-item/entities/carrito-item.entity';
import { Producto } from '../producto/entities/producto.entity';
import { Cliente } from '../cliente/entities/cliente.entity';
import { User } from '../user/entities/user.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class CarritoService {
  constructor(
    @InjectRepository(Carrito)
    private readonly cartRepository: Repository<Carrito>,
    @InjectRepository(CarritoItem)
    private readonly cartItemRepository: Repository<CarritoItem>,
    @InjectRepository(Producto)
    private readonly productRepository: Repository<Producto>,
    @InjectRepository(Cliente)
    private readonly clientRepository: Repository<Cliente>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private async findClienteByUserId(idUser: number): Promise<Cliente> {
    const user = await this.userRepository.findOne({ where: { id: idUser } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    let cliente = await this.clientRepository.findOne({ where: { email: user.email } });
    if (!cliente) {
      cliente = this.clientRepository.create({
        nombre: user.name,
        email: user.email,
      });
      cliente = await this.clientRepository.save(cliente);
    }
    return cliente;
  }

  private async getOrCreateCart(idUser: number): Promise<Carrito> {
    const cliente = await this.findClienteByUserId(idUser);

    let cart = await this.cartRepository.findOne({
      where: { cliente: { idCliente: cliente.idCliente } },
      relations: ['items', 'items.producto'],
    });
    if (!cart) {
      cart = this.cartRepository.create({
        sessionToken: null,
        expiresAt: null,
        cliente,
      });
      cart = await this.cartRepository.save(cart);
      cart.items = [];
    }

    return cart;
  }

  private validateId(value: number, field: string) {
    if (!Number.isInteger(value) || value <= 0) {
      throw new BadRequestException(`${field} inválido`);
    }
  }

  async findByUser(ident: { idUser?: number; sessionToken?: string }) {
    const { idUser, sessionToken } = ident;
    if (!idUser && !sessionToken) {
      throw new BadRequestException('Se requiere un ID de usuario o un token de sesión');
    }

    let cart: Carrito | null = null;

    if (idUser) {
      const cliente = await this.findClienteByUserId(idUser);
      this.validateId(cliente.idCliente, 'idCliente');
      cart = await this.cartRepository.findOne({
        where: { cliente: { idCliente: cliente.idCliente } },
        relations: ['items', 'items.producto'],
      });
    } else if (sessionToken) {
      cart = await this.cartRepository.findOne({
        where: { sessionToken },
        relations: ['items', 'items.producto'],
      });
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
      sessionToken: cart.sessionToken,
      idCarrito: cart.idCarrito,
      items,
      totalItems: items.reduce((acc, it) => acc + (Number(it.cantidad) || 0), 0),
    };
  }

  async addToCart(
    ident: { idUser?: number; sessionToken?: string },
    idProducto: number,
    quantity: number,
  ) {
    const { idUser, sessionToken } = ident;
    if (!idUser && !sessionToken) {
      throw new BadRequestException('Se requiere un ID de usuario o un token de sesión');
    }

    this.validateId(idProducto, 'idProducto');
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestException('La cantidad debe ser mayor a 0');
    }

    const product = await this.productRepository.findOne({ where: { idProducto } });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${idProducto} no encontrado`);
    }

    let cart: Carrito | null = null;

    if (idUser) {
      cart = await this.getOrCreateCart(idUser);
    } else if (sessionToken) {
      cart = await this.cartRepository.findOne({
        where: { sessionToken },
        relations: ['items', 'items.producto'],
      });
      if (!cart) {
        cart = this.cartRepository.create({
          sessionToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        cart = await this.cartRepository.save(cart);
        cart.items = [];
      }
    }

    if (!cart) throw new NotFoundException('No se pudo obtener o crear el carrito');

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

  async updateCartItem(
    ident: { idUser?: number; sessionToken?: string },
    idProducto: number,
    quantity: number,
  ) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestException('La cantidad debe ser mayor a 0');
    }

    const { idUser, sessionToken } = ident;
    if (!idUser && !sessionToken) {
      throw new BadRequestException('Se requiere un ID de usuario o un token de sesión');
    }

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
      relations: ['producto'],
    });

    if (!existingItem) {
      throw new NotFoundException(`El producto con ID ${idProducto} no está en el carrito`);
    }

    existingItem.cantidad = quantity;
    return this.cartItemRepository.save(existingItem);
  }

  async removeFromCart(
    ident: { idUser?: number; sessionToken?: string },
    idProducto: number,
  ) {
    const { idUser, sessionToken } = ident;
    if (!idUser && !sessionToken) {
      throw new BadRequestException('Se requiere un ID de usuario o un token de sesión');
    }

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

  async mergeGuestCart(idUser: number, sessionToken: string) {
    const guestCart = await this.cartRepository.findOne({
      where: { sessionToken },
      relations: ['items', 'items.producto'],
    });

    if (!guestCart) return;

    const cliente = await this.findClienteByUserId(idUser);
    const userCart = await this.cartRepository.findOne({
      where: { cliente: { idCliente: cliente.idCliente } },
      relations: ['items', 'items.producto'],
    });

    if (!userCart) {
      guestCart.cliente = cliente;
      guestCart.sessionToken = null;
      guestCart.expiresAt = null;
      await this.cartRepository.save(guestCart);
      return;
    }

    for (const item of guestCart.items) {
      const existingItem = userCart.items.find(
        (i) => i.producto.idProducto === item.producto.idProducto,
      );

      if (existingItem) {
        existingItem.cantidad += item.cantidad;
        await this.cartItemRepository.save(existingItem);
      } else {
        item.carrito = userCart;
        await this.cartItemRepository.save(item);
      }
    }

    await this.cartRepository.remove(guestCart);
  }

  async generateShareCartLink(ident: { idUser?: number; sessionToken?: string }) {
    const { idUser, sessionToken } = ident;
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
    }

    if (!cart) {
      throw new NotFoundException('Carrito no encontrado');
    }

    if (!cart.items.length) {
      throw new BadRequestException('El carrito está vacío');
    }

    if (!cart.shareToken) {
      cart.shareToken = randomUUID();
      await this.cartRepository.save(cart);
    }
    return { url: cart.shareToken };
  }

  async findByShareToken(shareToken: string) {
    const cart = await this.cartRepository.findOne({
      where: { shareToken },
      relations: ['items', 'items.producto'],
    });

    if (!cart) {
      throw new NotFoundException('Carrito compartido no encontrado');
    }

    return {
      idCarrito: cart.idCarrito,
      items: cart.items,
      totalItems: cart.items.reduce(
        (acc, it) => acc + (Number(it.cantidad) || 0),
        0,
      ),
    };
  }
}
