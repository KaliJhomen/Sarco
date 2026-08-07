import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { MetodoPago } from "../../metodo-pago/entities/metodo-pago.entity";
import { PlanPago } from "../../plan-pago/entities/plan-pago.entity";
import { Tienda } from "../../tienda/entities/tienda.entity";
import { User } from "../../user/entities/user.entity";

@Index("id_plan_pago", ["idPlanPago"], {})
@Index("id_usuario", ["idUsuario"], {})
@Index("id_metodo_pago", ["idMetodoPago"], {})
@Index("fk_pago_credito_tienda", ["idTienda"], {})
@Entity("pago_credito", { schema: "sarcos_db" })
export class PagoCredito {
  @PrimaryGeneratedColumn({ type: "int", name: "id_pago_credito" })
  idPagoCredito!: number;

  @Column("int", { name: "id_plan_pago", nullable: true })
  idPlanPago!: number | null;

  @Column("datetime", { name: "fecha_pago", nullable: true })
  fechaPago!: Date | null;

  @Column("decimal", {
    name: "monto_pago",
    nullable: true,
    precision: 20,
    scale: 2,
  })
  montoPago!: string | null;

  @Column("int", { name: "id_usuario", nullable: true })
  idUsuario!: number | null;

  @Column("int", { name: "id_tienda", nullable: true })
  idTienda!: number | null;

  @Column("int", { name: "id_metodo_pago", nullable: true })
  idMetodoPago!: number | null;

  @Column("varchar", { name: "num_comprobante", nullable: true, length: 24 })
  numComprobante!: string | null;

  @Column("decimal", {
    name: "deuda_restante",
    nullable: true,
    precision: 20,
    scale: 2,
    default: 0.00,
  })
  deudaRestante!: string | null;

  @ManyToOne(() => MetodoPago, (metodoPago) => metodoPago.pagoCreditos, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([
    { name: "id_metodo_pago", referencedColumnName: "idMetodoPago" },
  ])
  metodoPago!: MetodoPago;

  @ManyToOne(() => PlanPago, (planPago) => planPago.pagoCreditos, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_plan_pago", referencedColumnName: "idPlanPago" }])
  planPago!: PlanPago;

  @ManyToOne(() => Tienda, (tienda) => tienda.pagoCreditos, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_tienda", referencedColumnName: "idTienda" }])
  tienda!: Tienda;

  @ManyToOne(() => User, (user) => user.pagoCreditos, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "idUser" }])
  user!: User;
}
