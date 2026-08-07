import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DetalleSeparado } from "../../detalle-separado/entities/detalle-separado.entity";
import { PagoSeparado } from "../../pago-separado/entities/pago-separado.entity";
import { Comprobante } from "../../comprobante/entities/comprobante.entity";
import { MetodoPago } from "../../metodo-pago/entities/metodo-pago.entity";
import { Tienda } from "../../tienda/entities/tienda.entity";

import { User } from "../../user/entities/user.entity";
import { Cliente } from "../../cliente/entities/cliente.entity";

@Index("fk_credito_cliente_4", ["idCliente"], {})
@Index("id_usuario", ["idUsuario"], {})
@Index("id_metodo_pago", ["idMetodoPago"], {})
@Index("fk_id_comprobante", ["idComprobante"], {})
@Index("id_tienda", ["idTienda"], {})
@Entity("separado", { schema: "sarcos_db" })
export class Separado {
  @PrimaryGeneratedColumn({ type: "int", name: "id_separado" })
  idSeparado!: number;

  @Column("int", { name: "id_usuario", nullable: true })
  idUsuario!: number | null;

  @Column("int", { name: "id_cliente", nullable: true })
  idCliente!: number | null;

  @Column("int", { name: "id_metodo_pago", nullable: true })
  idMetodoPago!: number | null;

  @Column("date", { name: "fecha_inicio", nullable: true })
  fechaInicio!: string | null;

  @Column("decimal", {
    name: "deuda_total",
    nullable: true,
    precision: 20,
    scale: 2,
  })
  deudaTotal!: string | null;

  @Column("decimal", {
    name: "deuda_pagada",
    nullable: true,
    precision: 20,
    scale: 2,
  })
  deudaPagada!: string | null;

  @Column("decimal", {
    name: "deuda_restante",
    nullable: true,
    precision: 20,
    scale: 2,
  })
  deudaRestante!: string | null;

  @Column("tinyint", { name: "estado", nullable: true })
  estado!: number | null;

  @Column("varchar", { name: "descripcion", nullable: true, length: 250 })
  descripcion!: string | null;

  @Column("int", { name: "id_comprobante", nullable: true })
  idComprobante!: number | null;

  @Column("int", { name: "registrar", nullable: true })
  registrar!: number | null;

  @Column("int", { name: "id_tienda", nullable: true })
  idTienda!: number | null;

  
  @OneToMany(
    () => DetalleSeparado,
    (detalleSeparado) => detalleSeparado.separado)
  detalleSeparados!: DetalleSeparado[];

  @OneToMany(() => PagoSeparado, (pagoSeparado) => pagoSeparado.separado)
  pagoSeparados!: PagoSeparado[];


  @ManyToOne(() => Comprobante, (comprobante) => comprobante.separados, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([
    { name: "id_comprobante", referencedColumnName: "idComprobante" },
  ])
  idComprobante2!: Comprobante;

  @ManyToOne(() => Cliente, (cliente) => cliente.separados, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_cliente", referencedColumnName: "idCliente" }])
  idCliente2!: Cliente;

  @ManyToOne(() => MetodoPago, (metodoPago) => metodoPago.separados, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([
    { name: "id_metodo_pago", referencedColumnName: "idMetodoPago" },
  ])
  metodoPago!: MetodoPago;

  @ManyToOne(() => User, (user) => user.separados, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "idUser" }])
  user!: User;

  @ManyToOne(() => Tienda, (tienda) => tienda.separados, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_tienda", referencedColumnName: "idTienda" }])
  tienda!: Tienda;
}
