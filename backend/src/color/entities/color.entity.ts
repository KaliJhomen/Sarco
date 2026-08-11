import { ProductoColor } from '../../producto-color/entities/producto-color.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('color', {schema: 'sarcos_db'})
export class Color {
  @PrimaryGeneratedColumn({type: 'int', name: 'id_color'})
  idColor: number;

  @Column({type: 'varchar', length: 100 })
  nombre: string;

  @Column({type: 'varchar', name: 'codigo_hex', length: 7})
  codigoHex: string;

  
  @OneToMany(() => ProductoColor, (productoColor) => productoColor.color)
  productoColores: ProductoColor[];
}
