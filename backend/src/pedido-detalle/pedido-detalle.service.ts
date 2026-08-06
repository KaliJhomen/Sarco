import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { PedidoDetalle } from './entities/pedido-detalle.entity';
import { EstadoPedido, Pedido } from '../pedido/entities/pedido.entity';
import { Producto } from '../producto/entities/producto.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class PedidoDetalleService {
  constructor(
    @InjectRepository(PedidoDetalle)
    private readonly pedidoDetalleRepository: Repository<PedidoDetalle>,
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
    @InjectRepository(Producto)
    private readonly productRepository: Repository<Producto>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Obtener o crear pedido para usuario registrado O invitado
  private async getOrCreateOrder(idUser?: number, sessionToken?: string): Promise<Pedido> {
    let pedido: Pedido | null;

    if (idUser) {
      const user = await this.userRepository.findOne({ where: { id: idUser } });
      if (!user) throw new NotFoundException(`Usuario con ID ${idUser} no encontrado`);

      pedido = await this.pedidoRepository.findOne({
        where: {
          usuario: { id: idUser },
          estado: EstadoPedido.PENDIENTE
}      });

      if (!pedido) {
        pedido = this.pedidoRepository.create({
          usuario: user,
        });
        pedido = await this.pedidoRepository.save(pedido);
      }
    } else if (sessionToken) {
      // Usuario no registrado
      pedido = await this.pedidoRepository.findOne({
        where: {
          sessionToken,
          estado: EstadoPedido.PENDIENTE
}      });

      if (!pedido) {
        pedido = this.pedidoRepository.create({
          sessionToken,
          // No incluyas usuario
        });
        pedido = await this.pedidoRepository.save(pedido);
      }
    } else {
      throw new BadRequestException('idUser o sessionToken es requerido');
    }

    return pedido;
  }

  // Construir where clause dinámicamente
  private buildWhereClause(idUser?: number, sessionToken?: string): FindOptionsWhere<Pedido> {
    if (idUser) {
      return { usuario: { id: idUser } };
    }
    return { sessionToken };
  }

  // Obtener pedido/carrito del usuario
  async findByUser(idUser?: number, sessionToken?: string) {
    const where = this.buildWhereClause(idUser, sessionToken);
    const pedido = await this.pedidoRepository.findOne({
      where,
      relations: ['items', 'items.producto'],
    });

    if (!pedido) {
      return {
        userId: idUser || null,
        sessionToken: sessionToken || null,
        idPedido: null,
        items: [],
        totalItems: 0,
        total: 0,
      };
    }

    const items = pedido.items || [];
    const totalItems = items.reduce((acc, it) => acc + (Number(it.cantidad) || 0), 0);
    const total = items.reduce((acc, it) => acc + (Number(it.cantidad) * Number(it.precioVenta) || 0), 0);

    return {
      userId: idUser || null,
      sessionToken: sessionToken || null,
      idPedido: pedido.idPedido,
      items,
      totalItems,
      total,
    };
  }

  // Agregar producto al pedido
  async addToOrder(idProducto: number, quantity: number, idUser?: number, sessionToken?: string) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestException('La cantidad debe ser mayor a 0');
    }

    const product = await this.productRepository.findOne({ where: { idProducto } });
    if (!product) throw new NotFoundException(`Producto con ID ${idProducto} no encontrado`);

    const stock = Number(product.stock) || 0;
    if (quantity > stock) {
      throw new BadRequestException(`Solo hay ${stock} unidades disponibles`);
    }

    const pedido = await this.getOrCreateOrder(idUser, sessionToken);

    const existingItem = await this.pedidoDetalleRepository.findOne({
      where: {
        pedido: { idPedido: pedido.idPedido },
        producto: { idProducto },
      },
      relations: ['producto'],
    });

    if (existingItem) {
      const newQuantity = existingItem.cantidad + quantity;
      if (newQuantity > stock) {
        throw new BadRequestException(`Solo hay ${stock} unidades disponibles`);
      }
      existingItem.cantidad = newQuantity;
      existingItem.subtotal = newQuantity * Number(existingItem.precioVenta);
      return this.pedidoDetalleRepository.save(existingItem);
    }

    const newItem = this.pedidoDetalleRepository.create({
      pedido,
      producto: product,
      cantidad: quantity,
      precioVenta: Number(product.precioVenta),
      subtotal: quantity * Number(product.precioVenta),
    });

    return this.pedidoDetalleRepository.save(newItem);
  }

  // Actualizar cantidad de item
  async updateOrderItem(idProducto: number, quantity: number, idUser?: number, sessionToken?: string) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestException('La cantidad debe ser mayor a 0');
    }

    const product = await this.productRepository.findOne({ where: { idProducto } });
    if (!product) throw new NotFoundException(`Producto con ID ${idProducto} no encontrado`);

    const stock = Number(product.stock) || 0;
    if (quantity > stock) {
      throw new BadRequestException(`Solo hay ${stock} unidades disponibles`);
    }

    const where = this.buildWhereClause(idUser, sessionToken);
    const pedido = await this.pedidoRepository.findOne({ where });
    if (!pedido) throw new NotFoundException('Pedido no encontrado');

    const existingItem = await this.pedidoDetalleRepository.findOne({
      where: {
        pedido: { idPedido: pedido.idPedido },
        producto: { idProducto },
      },
    });

    if (!existingItem) {
      throw new NotFoundException(`El producto con ID ${idProducto} no está en el pedido`);
    }

    existingItem.cantidad = quantity;
    existingItem.subtotal = quantity * Number(existingItem.precioVenta);
    return this.pedidoDetalleRepository.save(existingItem);
  }

  // Eliminar item del pedido
  async removeFromOrder(idProducto: number, idUser?: number, sessionToken?: string) {
    const where = this.buildWhereClause(idUser, sessionToken);
    const pedido = await this.pedidoRepository.findOne({ where });
    if (!pedido) throw new NotFoundException('Pedido no encontrado');

    const existingItem = await this.pedidoDetalleRepository.findOne({
      where: {
        pedido: { idPedido: pedido.idPedido },
        producto: { idProducto },
      },
    });

    if (!existingItem) {
      throw new NotFoundException(`El producto con ID ${idProducto} no está en el pedido`);
    }

    return this.pedidoDetalleRepository.remove(existingItem);
  }
}
