import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Producto } from '../../producto/entities/producto.entity';

@Entity('carrito') 
export class Carrito {
  @PrimaryGeneratedColumn({name : 'id_carrito' })
  idCarrito: number;

  @OneToOne(() => User, (user) => user.carrito, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'idUser' })
  user: User;

  @Column( {name: 'id_user' })
  idUser: number;

  @ManyToOne(() => Producto, (producto) => producto.carritos, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'idProducto' })
  producto: Producto;

  @Column({name: 'id_producto' })
  idProducto: number;

  @Column({ type: 'int' }) 
  cantidad: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}