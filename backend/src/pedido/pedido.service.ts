import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido, EstadoPedido, TipoEntrega } from './entities/pedido.entity';
import { PedidoDetalle } from '../pedido-detalle/entities/pedido-detalle.entity';
import { Producto } from '../producto/entities/producto.entity';
import { Cliente } from '../cliente/entities/cliente.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(Pedido) private readonly pedidoRepository: Repository<Pedido>,
    @InjectRepository(PedidoDetalle) private readonly pedidoDetalleRepository: Repository<PedidoDetalle>,
    @InjectRepository(Producto) private readonly productoRepository: Repository<Producto>,
    @InjectRepository(Cliente) private readonly clienteRepository: Repository<Cliente>,
  ) {}

  async createPedido(idCliente: number, dto: CreatePedidoDto) {
    const cliente = await this.clienteRepository.findOne({ where: { idCliente } });
    if (!cliente) throw new NotFoundException('Cliente no encontrado');

    let total = 0;
    const detalles: PedidoDetalle[] = [];

    for (const item of dto.items) {
      const producto = await this.productoRepository.findOne({ where: { idProducto: item.idProducto } });
      if (!producto) throw new NotFoundException(`Producto ${item.idProducto} no encontrado`);
      if (item.cantidad > producto.stock) throw new BadRequestException(`Stock insuficiente para producto ${producto.nombre}`);

      const detalle = this.pedidoDetalleRepository.create({
        producto,
        cantidad: item.cantidad,
        montoTotal: String(Number(producto.precioVenta)),
        subtotal: String(item.cantidad * Number(producto.precioVenta)),
      });
      total += Number(detalle.subtotal) || 0;
      detalles.push(detalle);
    }

    const pedido = this.pedidoRepository.create({
      idCliente,
      nombreCliente: dto.nombre,
      emailCliente: dto.email,
      telefonoCliente: dto.telefono,
      departamentoCliente: dto.departamento ?? null,
      provinciaCliente: dto.provincia ?? null,
      distritoCliente: dto.distrito ?? null,
      ciudadCliente: dto.ciudad ?? null,
      direccionCliente: dto.direccion ?? null,
      referenciaCliente: dto.referencia ?? null,
      ubigeoCodigo: dto.ubigeoCodigo ?? null,
      total: String(total),
      estadoPedido: EstadoPedido.PENDIENTE,
      tipoEntrega: dto.tipoEntrega,
      pedidoDetalles: detalles,
    });

    return this.pedidoRepository.save(pedido);
  }

  async findByUserId(idCliente: number) {
    return this.pedidoRepository.find({
      where: { idCliente },
      relations: ['cliente', 'pedidoDetalles', 'pedidoDetalles.producto'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(idPedido: number) {
    const pedido = await this.pedidoRepository.findOne({
      where: { idPedido },
      relations: ['cliente', 'pedidoDetalles', 'pedidoDetalles.producto'],
    });
    if (!pedido) throw new NotFoundException('Pedido no encontrado');
    return pedido;
  }

  async update(idPedido: number, dto: UpdatePedidoDto, idCliente: number) {
    const pedido = await this.findOne(idPedido);
    if (pedido.idCliente !== idCliente) throw new BadRequestException('No puedes modificar este pedido');

    const editable = pedido.estadoPedido === EstadoPedido.PENDIENTE || pedido.estadoPedido === EstadoPedido.CONFIRMADO;

    if (dto.estado !== undefined) {
      if (dto.estado !== EstadoPedido.CANCELADO) throw new BadRequestException('El cliente solo puede cancelar el pedido');
      if (!editable) throw new BadRequestException('El pedido ya no puede cancelarse');
      pedido.estadoPedido = EstadoPedido.CANCELADO;
      return this.pedidoRepository.save(pedido);
    }

    const tocaDireccion = [dto.departamento, dto.provincia, dto.distrito, dto.ciudad, dto.direccion, dto.referencia, dto.ubigeoCodigo]
      .some((f) => f !== undefined);
    if (tocaDireccion) {
      if (!editable) throw new BadRequestException('La dirección solo puede editarse antes del envío');
      if (pedido.tipoEntrega !== TipoEntrega.DELIVERY) throw new BadRequestException('Un pedido de recojo no tiene dirección');
      pedido.departamentoCliente = dto.departamento ?? pedido.departamentoCliente;
      pedido.provinciaCliente = dto.provincia ?? pedido.provinciaCliente;
      pedido.distritoCliente = dto.distrito ?? pedido.distritoCliente;
      pedido.ciudadCliente = dto.ciudad ?? pedido.ciudadCliente;
      pedido.direccionCliente = dto.direccion ?? pedido.direccionCliente;
      pedido.referenciaCliente = dto.referencia ?? pedido.referenciaCliente;
      pedido.ubigeoCodigo = dto.ubigeoCodigo ?? pedido.ubigeoCodigo;
    }

    return this.pedidoRepository.save(pedido);
  }
}