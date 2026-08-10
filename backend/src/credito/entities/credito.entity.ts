import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Tienda } from "../../tienda/entities/tienda.entity";
import { Cliente } from "../../cliente/entities/cliente.entity";
import { Comprobante } from "../../comprobante/entities/comprobante.entity";
import { EstadoCredito } from "../../estado-credito/entities/estado-credito.entity";
import { MetodoPago } from "../../metodo-pago/entities/metodo-pago.entity";
import { User } from "../../user/entities/user.entity";
import { DetalleCredito } from "../../detalle-credito/entities/detalle-credito.entity";
import { Penalidades } from "../../penalidades/entities/penalidade.entity";
import { PlanPago } from "../../plan-pago/entities/plan-pago.entity";
import { TicketCredito } from "../../ticket-credito/entities/ticket-credito.entity";

@Index("fk_credito_estado_credito_2", ["idEstadoCredito"], {})
@Index("fk_credito_cliente_3", ["idClienteGarante"], {})
@Index("fk_credito_cliente_4", ["idCliente"], {})
@Index("id_usuario", ["idUsuario"], {})
@Index("id_metodo_pago", ["idMetodoPago"], {})
@Index("fk_credito_comprobante", ["idComprobante"], {})
@Index("id_tienda", ["idTienda"], {})
@Entity("credito", { schema: "sarcos_db" })
export class Credito {
  @PrimaryGeneratedColumn({ type: "int", name: "id_credito" })
  idCredito!: number;

  @Column("int", { name: "id_usuario", nullable: true })
  idUsuario!: number | null;

  @Column("int", { name: "id_cliente_garante", nullable: true })
  idClienteGarante!: number | null;

  @Column("int", { name: "id_cliente", nullable: true })
  idCliente!: number | null;

  @Column("int", { name: "id_metodo_pago", nullable: true })
  idMetodoPago!: number | null;

  @Column("int", { name: "num_cuotas", nullable: true })
  numCuotas!: number | null;

  @Column("int", { name: "num_cuotas_restante", nullable: true })
  numCuotasRestante!: number | null;

  @Column("datetime", { name: "fecha_inicio", nullable: true })
  fechaInicio!: Date | null;

  @Column("date", { name: "fecha_final", nullable: true })
  fechaFinal!: Date | null;

  @Column("int", { name: "id_estado_credito", nullable: true })
  idEstadoCredito!: number | null;

  @Column("varchar", {
    name: "garantia_extendida_credito",
    nullable: true,
    length: 255,
  })
  garantiaExtendidaCredito!: string | null;

  @Column("varchar", { name: "garantia_tienda", nullable: true, length: 255 })
  garantiaTienda!: string | null;

  @Column("varchar", { name: "periodo_pago", nullable: true, length: 20 })
  periodoPago!: string | null;

  @Column("decimal", {
    name: "interes",
    nullable: true,
    precision: 20,
    scale: 2,
  })
  interes!: string | null;

  @Column("decimal", {
    name: "inicial",
    nullable: true,
    precision: 20,
    scale: 2,
  })
  inicial!: string | null;

  @Column("decimal", {
    name: "monto_cuota",
    nullable: true,
    precision: 20,
    scale: 2,
  })
  montoCuota!: string | null;

  @Column("decimal", {
    name: "monto_deuda",
    nullable: true,
    precision: 20,
    scale: 2,
  })
  montoDeuda!: string | null;

  @Column("decimal", {
    name: "monto_deuda_base",
    nullable: true,
    precision: 20,
    scale: 2,
  })
  montoDeudaBase!: string | null;

  @Column("decimal", {
    name: "monto_deuda_restante",
    nullable: true,
    precision: 20,
    scale: 2,
  })
  montoDeudaRestante!: string | null;

  @Column("int", { name: "id_comprobante", nullable: true })
  idComprobante!: number | null;

  @Column("int", { name: "registrar", nullable: true })
  registrar!: number | null;

  @Column("int", { name: "id_tienda", nullable: true })
  idTienda!: number | null;

  @Column("varchar", { name: "justificacion", nullable: true, length: 255 })
  justificacion!: string | null;

  @OneToMany(
    () => DetalleCredito,
    (detalleCredito) => detalleCredito.credito
  )
  detalleCreditos!: DetalleCredito[];

  @OneToMany(() => Penalidades, (penalidades) => penalidades.credito)
  penalidades!: Penalidades[];

  @OneToMany(() => PlanPago, (planPago) => planPago.credito)
  planPagos!: PlanPago[];

  @OneToMany(() => TicketCredito, (ticketCredito) => ticketCredito.credito)
  ticketCreditos!: TicketCredito[];

  
  @ManyToOne(() => Tienda, (tienda) => tienda.creditos, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_tienda", referencedColumnName: "idTienda" }])
  tienda!: Tienda;

  @ManyToOne(() => Cliente, (cliente) => cliente.creditos, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([
    { name: "id_cliente_garante", referencedColumnName: "idCliente" },
  ])
  clienteGarante!: Cliente;

  @ManyToOne(() => Cliente, (cliente) => cliente.creditos, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_cliente", referencedColumnName: "idCliente" }])
  cliente!: Cliente;

  @ManyToOne(() => Comprobante, (comprobante) => comprobante.creditos, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([
    { name: "id_comprobante", referencedColumnName: "idComprobante" },
  ])
  comprobante!: Comprobante;

  @ManyToOne(() => EstadoCredito, (estadoCredito) => estadoCredito.creditos, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([
    { name: "id_estado_credito", referencedColumnName: "idEstadoCredito" },
  ])
  estadoCredito!: EstadoCredito;

  @ManyToOne(() => MetodoPago, (metodoPago) => metodoPago.creditos, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([
    { name: "id_metodo_pago", referencedColumnName: "idMetodoPago" },
  ])
  metodoPago!: MetodoPago;

  @ManyToOne(() => User, (user) => user.creditos, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "idUser" }])
  user!: User;
}