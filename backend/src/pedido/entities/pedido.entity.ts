import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PedidoDetalle } from '../../pedido-detalle/entities/pedido-detalle.entity';

import { Usuario } from '../../usuario/entities/usuario.entity';

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
  idPedido!: number;

  @Column( "int",{ name: 'id_usuario' })
  idUsuario!: number;

  @Column("varchar",{ name:'nombre_usuario', length: 100 })
  nombreUsuario!: string;

  @Column("varchar", { name:'email_usuario', length: 100, nullable: true })
  emailUsuario!: string | null;

  @Column("varchar", { name: 'telefono_usuario', length: 20 })
  telefonoUsuario!: string;

  @Column("varchar",{ name: 'direccion_usuario', length: 255 })
  direccionUsuario!: string;

  @Column("varchar", { name: 'ciudad_usuario', length: 100 })
  ciudadUsuario!: string;

  @Column("decimal", { name: 'total', precision: 10, scale: 2, default: 0 })
  total!: string;

  @Column("enum", { name: 'estado',enum: EstadoPedido, default: EstadoPedido.PENDIENTE })
  estado!: EstadoPedido;

  @Column('varchar', { name: 'session_token', nullable: true, length: 32 })
  sessionToken!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

//Relaciones 
  @OneToMany(() => PedidoDetalle, (pedidoDetalle) => pedidoDetalle.pedido, 
  { cascade: true })
  pedidoDetalles!: PedidoDetalle[];

  @ManyToOne(() => Usuario, { 
    onDelete: 'SET NULL', 
    onUpdate: 'CASCADE'})
  @JoinColumn({ name: 'id_usuario' })
  usuario!: Usuario;
}
