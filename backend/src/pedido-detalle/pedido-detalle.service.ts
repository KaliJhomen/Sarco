import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { PedidoDetalle } from './entities/pedido-detalle.entity';
import { EstadoPedido, Pedido } from '../pedido/entities/pedido.entity';
import { Producto } from '../producto/entities/producto.entity';
import { Usuario } from '../usuario/entities/usuario.entity';

@Injectable()
export class PedidoDetalleService {
  constructor(
    @InjectRepository(PedidoDetalle)
    private readonly pedidoDetalleRepository: Repository<PedidoDetalle>,
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
    @InjectRepository(Producto)
    private readonly productRepository: Repository<Producto>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  // Obtener o crear pedido para usuario registrado O invitado
  private async getOrCreateOrder(idUsuario?: number, sessionToken?: string): Promise<Pedido> {
    let pedido: Pedido | null;

    if (idUsuario) {
      const usuario = await this.usuarioRepository.findOne({ where:  {idUsuario } });
      if (!usuario) throw new NotFoundException(`Usuario con ID ${idUsuario} no encontrado`);

      pedido = await this.pedidoRepository.findOne({
        where: {
          usuario: { idUsuario },
          estado: EstadoPedido.PENDIENTE
}      });

      if (!pedido) {
        pedido = this.pedidoRepository.create({
          usuario
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
  private buildWhereClause(idUsuario?: number, sessionToken?: string): FindOptionsWhere<Pedido> {
    if (idUsuario) {
      return { idUsuario};
    }
    return { sessionToken };
  }

  // Obtener pedido/carrito del usuario
  async findByUser(idUsuario?: number, sessionToken?: string) {
    const where = this.buildWhereClause(idUsuario, sessionToken);
    const pedido = await this.pedidoRepository.findOne({
      where,
      relations: ['pedidoDetalles'],
    });

    if (!pedido) {
      return {
        idUsuario: idUsuario || null,
        sessionToken: sessionToken || null,
        idPedido: null,
        items: [],
        totalItems: 0,
        total: 0,
      };
    }

    const items = pedido.pedidoDetalles || [];
    const totalItems = items.reduce((acc, it) => acc + (Number(it.cantidad) || 0), 0);
    const total = items.reduce((acc, it) => acc + (Number(it.cantidad) * Number(it.montoTotal) || 0), 0);

    return {
      idUsuario: idUsuario || null,
      sessionToken: sessionToken || null,
      idPedido: pedido.idPedido,
      items,
      totalItems,
      total,
    };
  }

  // Agregar producto al pedido
  async addToOrder(idProducto: number, cantidad: number, idUsuario?: number, sessionToken?: string) {
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      throw new BadRequestException('La cantidad debe ser mayor a 0');
    }

    const producto = await this.productRepository.findOne({ where: { idProducto } });
    if (!producto) throw new NotFoundException(`Producto con ID ${idProducto} no encontrado`);

    const stock = Number(producto.stock) || 0;
    if (cantidad > stock) {
      throw new BadRequestException(`Solo hay ${stock} unidades disponibles`);
    }

    const pedido = await this.getOrCreateOrder(idUsuario, sessionToken);

    const existingItem = await this.pedidoDetalleRepository.findOne({
      where: {
        pedido: { idPedido: pedido.idPedido },
        producto: { idProducto },
      },
      relations: ['producto'],
    });

    if (existingItem) {
      const nuevaCantidad = existingItem.cantidad + cantidad;
      if (nuevaCantidad> stock) {
        throw new BadRequestException(`Solo hay ${stock} unidades disponibles`);
      }
      existingItem.cantidad =nuevaCantidad;
      existingItem.subtotal = String(nuevaCantidad * Number(existingItem.montoTotal));
      return this.pedidoDetalleRepository.save(existingItem);
    }

    const newItem = this.pedidoDetalleRepository.create();
    newItem.pedido = pedido;
    newItem.producto = producto;   
    newItem.cantidad=  cantidad;
    newItem.montoTotal= String(producto.precioVenta);
    newItem.subtotal= String(cantidad * Number(producto.precioVenta));
    return this.pedidoDetalleRepository.save(newItem);
  }

  // Actualizar cantidad de item
  async updateOrderItem(idProducto: number, cantidad: number, idUsuario?: number, sessionToken?: string) {
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      throw new BadRequestException('La cantidad debe ser mayor a 0');
    }

    const product = await this.productRepository.findOne({ where: { idProducto } });
    if (!product) throw new NotFoundException(`Producto con ID ${idProducto} no encontrado`);

    const stock = Number(product.stock) || 0;
    if (cantidad> stock) {
      throw new BadRequestException(`Solo hay ${stock} unidades disponibles`);
    }

    const where = this.buildWhereClause(idUsuario, sessionToken);
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

    existingItem.cantidad = cantidad;
    existingItem.subtotal = String(cantidad * Number(existingItem.montoTotal));
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
