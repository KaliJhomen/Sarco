import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Producto } from '../../producto/entities/producto.entity';
import { Carrito } from './carrito.entity';

@Entity('carrito_item')
@Unique('uq_carrito_producto', ['carrito', 'producto'])
export class CarritoItem {
  @PrimaryGeneratedColumn({ name: 'id_carrito_item' })
  idCarritoItem!: number;

  @Column("int", { name: 'cantidad', default: 1 })
  cantidad!: number;

  @CreateDateColumn({name: 'created_at'})
  createdAt!: Date;

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt!: Date;



  @ManyToOne(() => Carrito, (carrito) => carrito.items, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'id_carrito' })
  carrito!: Carrito;

  @ManyToOne(() => Producto, (producto) => producto.carritoItems, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'id_producto' })
  producto!: Producto;
}