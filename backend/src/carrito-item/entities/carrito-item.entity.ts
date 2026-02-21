import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Producto } from '../../producto/entities/producto.entity';
import { Carrito } from '../../carrito/entities/carrito.entity';

@Entity('carrito_item')
@Unique('uq_carrito_producto', ['carrito', 'producto'])
export class CarritoItem {
  @PrimaryGeneratedColumn({ name: 'id_carrito_item' })
  idCarritoItem: number;

  @ManyToOne(() => Carrito, (carrito) => carrito.items, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'id_carrito' })
  carrito: Carrito;

  @ManyToOne(() => Producto, (producto) => producto.carritoItems, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'id_producto' })
  producto: Producto;

  @Column({ type: 'int', default: 1 })
  cantidad: number;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}