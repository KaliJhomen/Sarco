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
import { Usuario } from '../usuario/entities/usuario.entity';
import { EstadoPedido } from './entities/pedido.entity';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
    @InjectRepository(PedidoDetalle)
    private readonly pedidoDetalleRepository: Repository<PedidoDetalle>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}
  async createPedido(
    idUsuario: number,
    shippingData: {
      nombre: string;
      email: string | undefined;
      telefono: string;
      direccion: string;
      ciudad: string;
    },
    items: Array<{ idProducto: number; cantidad: number }>,
  ) {
    const usuario = await this.usuarioRepository.findOne({ where: { idUsuario } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    let total = 0;
    const detalles: PedidoDetalle[] = [];

    for (const item of items) {
      const producto = await this.productoRepository.findOne({ where: { idProducto: item.idProducto } });
      if (!producto) throw new NotFoundException(`Producto ${item.idProducto} no encontrado`);
      if (item.cantidad > producto.stock) throw new BadRequestException(`Stock insuficiente para producto ${producto.nombre}`);

      const detalle = this.pedidoDetalleRepository.create({
        producto: producto,
        cantidad: item.cantidad,
        montoTotal: String(Number(producto.precioVenta)),
        subtotal: String(item.cantidad * Number(producto.precioVenta)),
      });

      total += Number(detalle.subtotal) || 0;
      detalles.push(detalle);
    }

    const pedido = this.pedidoRepository.create({
      usuario,
      ...shippingData,
      total: String(total),
      estado: EstadoPedido.PENDIENTE,
      pedidoDetalles: detalles,
    });

    return this.pedidoRepository.save(pedido);
  }

  async findByUserId(idUsuario: number) {
    return this.pedidoRepository.find({
      where: { idUsuario },
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
