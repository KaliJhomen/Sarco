import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { PedidoDetalle } from '../../pedido-detalle/entities/pedido-detalle.entity';

export enum EstadoPedido {
  PENDIENTE = 'pendiente',
  CONFIRMADO = 'confirmado',
  ENVIADO = 'enviado',
  ENTREGADO = 'entregado',
  CANCELADO = 'cancelado',
}

@Entity('pedido')
export class Pedido {
  @PrimaryGeneratedColumn({ name: 'id_pedido' })
  idPedido: number;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_usuario' })
  usuario: User | null;

  @Column('varchar', { name: 'session_token', nullable: true, length: 32 })
  sessionToken: string | null;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 20 })
  telefono: string;

  @Column({ type: 'varchar', length: 255 })
  direccion: string;

  @Column({ type: 'varchar', length: 100 })
  ciudad: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number;

  @Column({ type: 'enum', enum: EstadoPedido, default: EstadoPedido.PENDIENTE })
  estado: EstadoPedido;

  @OneToMany(() => PedidoDetalle, (detalle) => detalle.pedido, { cascade: true })
  items: PedidoDetalle[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
