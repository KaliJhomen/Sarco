import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Pedido } from '../../pedido/entities/pedido.entity';
import { Carrito } from '../../carrito/entities/carrito.entity';

@Entity('pedido_detalle')
export class PedidoDetalle {
  @PrimaryGeneratedColumn({ name: 'id_pedido_detalle' })
  idPedidoDetalle!: number;

  @ManyToOne(() => Pedido, (pedido) => pedido.pedidoDetalles, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_pedido' })
  pedido!: Pedido;

  @ManyToOne(() => Carrito, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'id_carrito' })
  carrito!: Carrito;
}
