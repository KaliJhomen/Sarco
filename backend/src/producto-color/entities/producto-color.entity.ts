import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Producto } from '../../producto/entities/producto.entity';
import { Color } from '../../color/entities/color.entity';

@Entity('producto_color')
export class ProductoColor {
  @PrimaryGeneratedColumn({type: 'int', name: 'id_producto_color'})
  idProductoColor!: number;

  @Column({type: 'int', name: 'id_producto'})
  idProducto!: number;

  @Column({type: 'int', name: 'id_color'})
  idColor!: number;

  @Column({type: 'int', nullable: true, default: null })
  stock!: number | null;

  @Column({type: 'varchar', length: 255, nullable: true, default: null })
  imagen!: string | null;

  // Relación con Producto
  @ManyToOne(() => Producto, (producto) => producto.productoColores, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_producto', referencedColumnName: 'idProducto' })
  producto!: Producto;

  // Relación con Color
  @ManyToOne(() => Color, (color) => color.productoColores, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_color', referencedColumnName: 'idColor' })
  color!: Color;
}