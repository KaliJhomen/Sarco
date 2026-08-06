import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from './entities/pedido.entity';
import { PedidoDetalle } from '../pedido-detalle/entities/pedido-detalle.entity';
import { Producto } from '../producto/entities/producto.entity';
import { User } from '../user/entities/user.entity';
import { EstadoPedido } from './entities/pedido.entity';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
    @InjectRepository(PedidoDetalle)
    private readonly pedidoDetalleRepository: Repository<PedidoDetalle>,
    @InjectRepository(Producto)
    private readonly productRepository: Repository<Producto>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createPedido(
    userId: number,
    shippingData: {
      nombre: string;
      email: string | undefined;
      telefono: string;
      direccion: string;
      ciudad: string;
    },
    items: Array<{ idProducto: number; cantidad: number }>,
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    let total = 0;
    const detalles: PedidoDetalle[] = [];

    for (const item of items) {
      const producto = await this.productRepository.findOne({ where: { idProducto: item.idProducto } });
      if (!producto) throw new NotFoundException(`Producto ${item.idProducto} no encontrado`);
      if (item.cantidad > producto.stock) throw new BadRequestException(`Stock insuficiente para producto ${producto.nombre}`);

      const detalle = this.pedidoDetalleRepository.create({
        producto,
        cantidad: item.cantidad,
        precioVenta: Number(producto.precioVenta),
        subtotal: item.cantidad * Number(producto.precioVenta),
      });

      total += detalle.subtotal ?? 0;
      detalles.push(detalle);
    }

    const pedido = this.pedidoRepository.create({
      usuario: user,
      ...shippingData,
      total,
      estado: EstadoPedido.PENDIENTE,
      items: detalles,
    });

    return this.pedidoRepository.save(pedido);
  }

  async findByUserId(userId: number) {
    return this.pedidoRepository.find({
      where: { usuario: { id: userId } },
      relations: ['items', 'items.producto'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(idPedido: number) {
    const pedido = await this.pedidoRepository.findOne({
      where: { idPedido },
      relations: ['usuario', 'items', 'items.producto'],
    });
    if (!pedido) throw new NotFoundException('Pedido no encontrado');
    return pedido;
  }
}
