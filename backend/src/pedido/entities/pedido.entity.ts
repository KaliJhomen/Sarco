import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PedidoDetalle } from '../../pedido-detalle/entities/pedido-detalle.entity';

import { Cliente } from '../../cliente/entities/cliente.entity';

export enum EstadoPedido {
  PENDIENTE = 'pendiente',
  CONFIRMADO = 'confirmado',
  ENVIADO = 'enviado',
  ENTREGADO = 'entregado',
  CANCELADO = 'cancelado',
}
export enum TipoEntrega{
  DELIVERY = 'delivery',
  RECOJO = 'recojo',
}
@Entity('pedido')
export class Pedido {
  @PrimaryGeneratedColumn({ name: 'id_pedido' })
  idPedido!: number;

  @Column( "int",{ name: 'id_cliente' })
  idCliente!: number;

  @Column("enum", { name: 'tipoEntrega',enum: TipoEntrega})
  tipoEntrega!: TipoEntrega;
  
  @Column("varchar",{ name:'nombre_cliente', length: 100 })
  nombreCliente!: string;

  @Column("varchar", { name:'email_cliente', length: 100, nullable: true })
  emailCliente!: string;

  @Column("varchar", { name: 'telefono_cliente', length: 20 })
  telefonoCliente!: string;

  @Column("varchar", { name: 'departamento_cliente', nullable: true,  length: 60 })
  departamentoCliente!: string;
  
  @Column("varchar", { name: 'provincia_cliente', nullable: true,  length: 60 })
  provinciaCliente!: string;
  
  @Column("varchar", { name: 'distrito_cliente', nullable: true,  length: 60 })
  distritoCliente!: string;

  @Column("varchar", { name: 'ciudad_cliente', nullable: true, length: 100 })
  ciudadCliente!: string;

  @Column("varchar",{ name: 'direccion_cliente',  nullable: true, length: 255 })
  direccionCliente!: string;

  @Column("varchar", { name: 'referencia_cliente', nullable: true, length: 255 })
  referenciaCliente!: string | null;

  @Column("decimal", { name: 'total', precision: 10, scale: 2, default: 0 })
  total!: string;

  @Column("enum", { name: 'estadoPedido',enum: EstadoPedido, default: EstadoPedido.PENDIENTE })
  estadoPedido!: EstadoPedido;

  @Column('varchar', { name: 'session_token', nullable: true, length: 32 })
  sessionToken!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt!: Date;

//Relaciones 
  @OneToMany(() => PedidoDetalle, (pedidoDetalle) => pedidoDetalle.pedido, 
  { cascade: true })
  pedidoDetalles!: PedidoDetalle[];

  @ManyToOne(() => Cliente, { 
    onDelete: 'SET NULL', 
    onUpdate: 'CASCADE'})
  @JoinColumn({ name: 'id_cliente' })
  cliente!: Cliente;
}
