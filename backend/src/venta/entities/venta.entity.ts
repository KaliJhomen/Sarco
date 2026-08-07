import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DetalleVenta } from "../../detalle-venta/entities/detalle-venta.entity";
import { Comprobante } from "../../comprobante/entities/comprobante.entity";
import { EstadoVenta } from "../../estado-venta/entities/estado-venta.entity";
import { MetodoPago } from "../../metodo-pago/entities/metodo-pago.entity";
import { Tienda } from "../../tienda/entities/tienda.entity";

import { User } from "src/user/entities/user.entity";
import { Cliente } from "../../cliente/entities/cliente.entity";

@Index("fk_venta_estado_venta_1", ["idEstadoVenta"], {})
@Index("fk_venta_usuario_2", ["idUsuario"], {})
@Index("fk_venta_cliente_3", ["idCliente"], {})
@Index("fk_venta_comprobante_4", ["idComprobante"], {})
@Index("fk_venta_metodo_pago_5", ["idMetodoPago"], {})
@Index("id_tienda", ["idTienda"], {})
@Entity("venta", { schema: "sarcos_db" })
export class Venta {
  @PrimaryGeneratedColumn({ type: "int", name: "id_venta" })
  idVenta!: number;

  @Column("int", { name: "id_usuario", nullable: true })
  idUsuario!: number | null;

  @Column("int", { name: "id_cliente", nullable: true })
  idCliente!: number | null;

  @Column("int", { name: "id_comprobante", nullable: true })
  idComprobante!: number | null;

  @Column("int", { name: "id_metodo_pago", nullable: true })
  idMetodoPago!: number | null;

  @Column("varchar", { name: "numero_comprobante", nullable: true, length: 50 })
  numeroComprobante!: string | null;

  @Column("datetime", { name: "fecha_hora", nullable: true })
  fechaHora!: Date | null;

  @Column("decimal", {
    name: "impuesto",
    nullable: true,
    precision: 20,
    scale: 2,
  })
  impuesto!: string | null;

  @Column("decimal", {
    name: "total_venta",
    nullable: true,
    precision: 20,
    scale: 2,
  })
  totalVenta!: string | null;

  @Column("int", { name: "id_estado_venta", nullable: true })
  idEstadoVenta!: number | null;

  @Column("varchar", { name: "garantia_tienda", nullable: true, length: 50 })
  garantiaTienda!: string | null;

  @Column("varchar", { name: "descripcion", nullable: true, length: 50 })
  descripcion!: string | null;

  @Column("int", { name: "registrar", nullable: true })
  registrar!: number | null;

  @Column("int", { name: "id_tienda", nullable: true })
  idTienda!: number | null;

  @OneToMany(() => DetalleVenta, (detalleVenta) => detalleVenta.venta)
  detalleVentas!: DetalleVenta[];

  @ManyToOne(() => Cliente, (cliente) => cliente.ventas, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_cliente", referencedColumnName: "idCliente" }])
  cliente!: Cliente;

  @ManyToOne(() => Comprobante, (comprobante) => comprobante.ventas, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([
    { name: "id_comprobante", referencedColumnName: "idComprobante" },
  ])
  comprobante!: Comprobante;

  @ManyToOne(() => EstadoVenta, (estadoVenta) => estadoVenta.ventas, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([
    { name: "id_estado_venta", referencedColumnName: "idEstadoVenta" },
  ])
  estadoVenta!: EstadoVenta;

  @ManyToOne(() => MetodoPago, (metodoPago) => metodoPago.ventas, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([
    { name: "id_metodo_pago", referencedColumnName: "idMetodoPago" },
  ])
  metodoPago!: MetodoPago;

  @ManyToOne(() => User, (user) => user.ventas, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "idUser" }])
  user!: User;

  @ManyToOne(() => Tienda, (tienda) => tienda.ventas, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_tienda", referencedColumnName: "idTienda" }])
  tienda!: Tienda;
}
