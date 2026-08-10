import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Credito } from "../../credito/entities/credito.entity";
import { MetodoPago } from "../../metodo-pago/entities/metodo-pago.entity";
import { Tienda } from "../../tienda/entities/tienda.entity";
import { Usuario } from "../../usuario/entities/usuario.entity";
import { User } from "src/user/entities/user.entity";

@Index("FK_ticket_credito_usuario", ["idUsuario"], {})
@Index("FK_ticket_credito_credito", ["idCredito"], {})
@Index("FK_ticket_credito_metodo", ["idMetodoPago"], {})
@Index("fk_ticket_credito_tienda", ["idTienda"], {})
@Entity("ticket_credito", { schema: "sarcos_db" })
export class TicketCredito {
  @PrimaryGeneratedColumn({ type: "int", name: "id_ticket_credito" })
  idTicketCredito!: number;

  @Column("int", { name: "id_usuario", nullable: true })
  idUsuario!: number | null;

  @Column("int", { name: "id_tienda", nullable: true })
  idTienda!: number | null;

  @Column("int", { name: "id_credito", nullable: true })
  idCredito!: number | null;

  @Column("int", { name: "id_metodo_pago", nullable: true })
  idMetodoPago!: number | null;

  @Column("datetime", { name: "fecha_pago", nullable: true })
  fechaPago!: Date | null;

  @Column("decimal", {
    name: "monto_pago",
    nullable: true,
    precision: 20,
    scale: 2,
    default: () => "'0.00'",
  })
  montoPago!: string | null;

  @Column("char", { name: "num_comprobante", nullable: true, length: 24 })
  numComprobante!: string | null;

  @Column("decimal", {
    name: "deuda_restante",
    nullable: true,
    precision: 20,
    scale: 2,
    default: () => "'0.00'",
  })
  deudaRestante!: string | null;

  @ManyToOne(() => Credito, (credito) => credito.ticketCreditos, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_credito", referencedColumnName: "idCredito" }])
  credito!: Credito;

  @ManyToOne(() => MetodoPago, (metodoPago) => metodoPago.ticketCreditos, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([
    { name: "id_metodo_pago", referencedColumnName: "idMetodoPago" },
  ])
  metodoPago!: MetodoPago;

  @ManyToOne(() => Tienda, (tienda) => tienda.ticketCreditos, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_tienda", referencedColumnName: "idTienda" }])
  tienda!: Tienda;

  @ManyToOne(() => User, (user) => user.ticketCreditos, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "idUser" }])
  user!: User;
}
