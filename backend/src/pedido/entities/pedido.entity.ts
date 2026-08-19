import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PedidoDetalle } from '../../pedido-detalle/entities/pedido-detalle.entity';

import { Cliente } from '../../cliente/entities/cliente.entity';

export enum EstadoPedido {
  PENDIENTE= 'PENDIENTE',
  CONFIRMADO= 'CONFIRMADO',
  ENVIADO= 'ENVIADO',
  ENTREGADO= 'ENTREGADO',
  CANCELADO= 'CANCELADO'
}
export enum TipoEntrega{
  DELIVERY= 'DELIVERY',
  RECOJO= 'RECOJO',
}
@Entity('pedido')
export class Pedido {
  @PrimaryGeneratedColumn({ name: 'id_pedido' })
  idPedido!: number;

  @Column( "int",{ name: 'id_cliente' })
  idCliente!: number;

  @Column("enum", { name: 'tipo_entrega',enum: TipoEntrega})
  tipoEntrega!: TipoEntrega;
  
  @Column("varchar",{ name:'nombre_cliente', length: 100 })
  nombreCliente!: string;

  @Column("varchar", { name:'email_cliente', length: 100})
  emailCliente!: string;

  @Column("varchar", { name: 'telefono_cliente', length: 20 })
  telefonoCliente!: string;

  @Column("varchar", { name: 'departamento_cliente', nullable: true,  length: 60 })
  departamentoCliente!: string | null;
  
  @Column("varchar", { name: 'provincia_cliente', nullable: true,  length: 60 })
  provinciaCliente!: string | null;
  
  @Column("varchar", { name: 'distrito_cliente', nullable: true,  length: 60 })
  distritoCliente!: string | null;

  @Column("varchar", { name: 'ciudad_cliente', nullable: true, length: 100 })
  ciudadCliente!: string | null;

  @Column("varchar",{ name: 'direccion_cliente',  nullable: true, length: 255 })
  direccionCliente!: string | null;

  @Column("varchar", { name: 'referencia_cliente', nullable: true, length: 255 })
  referenciaCliente!: string | null;

  @Column("decimal", { name: 'total', precision: 10, scale: 2})
  total!: string;

  @Column("enum", { name: 'estado_pedido',enum: EstadoPedido, default: EstadoPedido.PENDIENTE })
  estadoPedido!: EstadoPedido;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;

//Relaciones 
  @OneToMany(() => PedidoDetalle, (pedidoDetalle) => pedidoDetalle.pedido, 
  { cascade: true })
  pedidoDetalles!: PedidoDetalle[];

  @ManyToOne(() => Cliente, { 
    onDelete: 'RESTRICT', 
    onUpdate: 'CASCADE'})
  @JoinColumn({ name: 'id_cliente' })
  cliente!: Cliente;
}
