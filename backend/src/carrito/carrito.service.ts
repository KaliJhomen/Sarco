import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carrito } from './entities/carrito.entity';
import { CarritoItem } from './entities/carrito-item.entity';
import { Producto } from '../producto/entities/producto.entity';
import { randomUUID } from 'crypto';
import { Usuario } from '../usuario/entities/usuario.entity';
type CartIdent = { idUsuario?: number; sessionToken?: string };
@Injectable()
export class CarritoService {
  constructor(
    @InjectRepository(Carrito)
    private readonly cartRepository: Repository<Carrito>,
    @InjectRepository(CarritoItem)
    private readonly cartItemRepository: Repository<CarritoItem>,
    @InjectRepository(Producto)
    private readonly productRepository: Repository<Producto>,
  ) {}
  ///
  ///PRIVADOS
  ///
  private validateId(value: number, field: string) {
    if (!Number.isInteger(value) || value <= 0) {
      throw new BadRequestException(`${field} inválido`);
    }
  }

  private async findCart(ident: CartIdent): Promise<Carrito | null> {
    const { idUsuario, sessionToken } = ident;
    if (idUsuario) return this.getCart(idUsuario);
    if (sessionToken) return this.getCartBySession(sessionToken);
      return null;
    }

  private async findOrCreateCart(ident: CartIdent): Promise<Carrito> {
    const carrito = await this.findCart(ident);
    if (carrito) return carrito;

    const { idUsuario, sessionToken } = ident;
    if (idUsuario) return this.createCart(idUsuario);
    if (sessionToken) return this.createGuestCart(sessionToken);

    throw new NotFoundException('No se pudo crear el carrito');
  }

  private async findCartItem(carrito: Carrito, idProducto: number): Promise<CarritoItem | null> {
    return this.cartItemRepository.findOne({
      where: {
        carrito: { idCarrito: carrito.idCarrito },
        producto: { idProducto },
      },
    });
  }



  private async createCart(idUsuario: number): Promise<Carrito> {
      const carrito = this.cartRepository.create({
          sessionToken: null,
          shareToken: null,
          expiresAt: null,
          usuario: { idUsuario },
          items: [],
        });
        return this.cartRepository.save(carrito);
    }

  private async getCart(idUsuario: number): Promise<Carrito | null> {
    return this.cartRepository.findOne({ 
      where: { usuario: { idUsuario } }, 
      relations: ['items', 'items.producto'] 
    });
  }

  private async getCartBySession(sessionToken: string): Promise<Carrito | null> {
    return this.cartRepository.findOne({
      where: { sessionToken },
      relations: ['items', 'items.producto'],
    });
  }

  private async createGuestCart(sessionToken: string): Promise<Carrito> {
    return this.cartRepository.save(
      this.cartRepository.create({
        sessionToken,
        shareToken: null,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        items: [],
      })
    );
  }


  
  ///
  ///PUBLICOS 
  ///

  async updateCartItem(
    ident: CartIdent,
    idProducto: number,
    cantidad: number,
  ) {
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      throw new BadRequestException('La cantidad debe ser mayor a 0');
    }

    const { idUsuario, sessionToken } = ident;
    if (!idUsuario && !sessionToken) {
      throw new BadRequestException('Se requiere un ID de usuario o un token de sesión');
    }
    const carrito = await this.findCart(ident);
    if (!carrito) {
      throw new NotFoundException('Carrito no encontrado');
    }
    const item = await this.findCartItem(carrito, idProducto);
    if (!item) throw new NotFoundException(`El producto con ID ${idProducto} no está en el carrito`);
    item.cantidad = cantidad;
    return this.cartItemRepository.save(item);
  }

  async removeFromCart(ident: CartIdent, idProducto: number) {
    const carrito = await this.findCart(ident); 
    if (!carrito) {
      throw new NotFoundException('Carrito no encontrado');
    }
    const item = await this.findCartItem(carrito, idProducto);
    if (!item){throw new NotFoundException(`El producto con ID ${idProducto} no está en el carrito`);
    }
    return this.cartItemRepository.remove(item);
  }
  async findByUser(ident: CartIdent) {
    const { idUsuario, sessionToken } = ident;
    if (!idUsuario && !sessionToken) {
      throw new BadRequestException('Se requiere un ID de usuario o un token de sesión');
    }

    const carrito = await this.findCart(ident);
    if (!carrito) {
      return {
        idUsuario: ident.idUsuario,
        sessionToken: ident.sessionToken,
        idCarrito: null,
        items: [],
        totalItems: 0,
      };
    }
    return {
      idUsuario: ident.idUsuario,
      sessionToken: carrito.sessionToken,
      idCarrito: carrito.idCarrito,
      items: carrito.items || [],
      totalItems: (carrito.items || [] ).reduce((acc, it) => acc + (Number(it.cantidad) || 0), 0),
    };
  }

  async addToCart(
    ident: CartIdent,
    idProducto: number,
    cantidad: number,
  ) {
    this.validateId(idProducto, 'idProducto');
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      throw new BadRequestException('La cantidad debe ser mayor a 0');
    }
    const producto = await this.productRepository.findOne({ where: { idProducto } });
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${idProducto} no encontrado`);
    }
    const carrito = await this.findOrCreateCart(ident);
    const existingItem = await this.findCartItem(carrito, idProducto);

    if (existingItem) {
      existingItem.cantidad += cantidad;
      return this.cartItemRepository.save(existingItem);
    }
    return this.cartItemRepository.save(
      this.cartItemRepository.create({
        carrito,
        producto: producto,
        cantidad: cantidad
      })
    );
  }

  async mergeGuestCart(idUsuario: number, sessionToken: string) {
    const guestCart = await this.cartRepository.findOne({
      where: { sessionToken },
      relations: ['items', 'items.producto'],
    });

    if (!guestCart) return;

    const userCart = await this.cartRepository.findOne({
      where: { usuario: { idUsuario } },
      relations: ['items', 'items.producto'],
    });

    if (!userCart) {
      guestCart.usuario = { idUsuario } as any;
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

  async generateShareCartLink(ident: CartIdent) {
    const carrito = await this.findCart(ident);
    if (!carrito) {
      throw new NotFoundException('Carrito no encontrado');
    }
    if (!carrito.items.length) {
      throw new BadRequestException('El carrito está vacío');
    }

    if (!carrito.shareToken) {
      carrito.shareToken = randomUUID();
      await this.cartRepository.save(carrito);
    }
    return { url: carrito.shareToken };
  }

  async findByShareToken(shareToken: string) {
    const carrito = await this.cartRepository.findOne({
      where: { shareToken },
      relations: ['items', 'items.producto'],
    });

    if (!carrito) {
      throw new NotFoundException('Carrito compartido no encontrado');
    }

    return {
      idCarrito: carrito.idCarrito,
      items: carrito.items,
      totalItems: carrito.items.reduce(
        (acc, it) => acc + (Number(it.cantidad) || 0),
        0,
      ),
    };
  }
}
