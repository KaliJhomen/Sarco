import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique} from 'typeorm';
import { Producto } from '../../producto/entities/producto.entity';
import { Pedido } from '../../pedido/entities/pedido.entity';

@Entity('pedido-detalle')
@Unique('uq_pedido_producto', ['pedido', 'producto'])
export class PedidoDetalle {
  @PrimaryGeneratedColumn({ name: 'id_pedido_detalle' })
  idPedidoDetalle!: number;

  @Column({ type: 'int', default: 1 })
  cantidad!: number;

  @Column( "decimal", { name: 'monto_total', precision: 10, scale: 2, nullable: true })
  montoTotal!: string | null;

  @Column( "decimal",{  precision: 10, scale: 2, nullable: true })
  subtotal!: string | null; 


  @ManyToOne(() => Pedido, (pedido) => pedido.pedidoDetalles, 
    { onDelete: 'CASCADE', 
      onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'id_pedido' })
  pedido!: Pedido;

  @ManyToOne(() => Producto, (producto) => producto.pedidoDetalles,
    { onDelete: 'RESTRICT', 
      onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'id_producto' })
  producto!: Producto;
}