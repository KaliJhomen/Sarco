import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique} from 'typeorm';
import { Producto } from '../../producto/entities/producto.entity';
import { Pedido } from '../../pedido/entities/pedido.entity';

@Entity('pedido-detalle')
@Unique('uq_pedido_producto', ['pedido', 'producto'])
export class PedidoDetalle {
  @PrimaryGeneratedColumn({ name: 'id_pedido_detalle' })
  idPedidoDetalle: number;

  @ManyToOne(() => Pedido, (pedido) => pedido.items, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'id_pedido' })
  pedido: Pedido;

  @ManyToOne(() => Producto, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'id_producto' })
  producto: Producto;

  @Column({ type: 'int', default: 1 })
  cantidad: number;

  @Column({ name: 'precio_venta',type: 'decimal', precision: 10, scale: 2, nullable: true })
  precioVenta: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  subtotal: number | null; 
}