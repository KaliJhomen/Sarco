import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { MetodoPago } from "../../metodo-pago/entities/metodo-pago.entity";
import { Tienda } from "../../tienda/entities/tienda.entity";
import { Separado } from "../../separado/entities/separado.entity";
import { Usuario } from "../../usuario/entities/usuario.entity";
import { User } from "src/user/entities/user.entity";

@Index("id_separado", ["idSeparado"], {})
@Index("id_usuario", ["idUsuario"], {})
@Index("id_metodo_pago", ["idMetodoPago"], {})
@Index("fk_pago_separado_tienda", ["idTienda"], {})
@Entity("pago_separado", { schema: "sarcos_db" })
export class PagoSeparado {
  @PrimaryGeneratedColumn({ type: "int", name: "id_pago_separado" })
  idPagoSeparado!: number;

  @Column("int", { name: "id_separado", nullable: true })
  idSeparado!: number | null;
  
  @Column("int", { name: "id_usuario", nullable: true })
  idUsuario!: number | null;

  @Column("datetime", { name: "fecha", nullable: true })
  fecha!: Date | null;

  @Column("decimal", {
    name: "monto_pago",
    nullable: true,
    precision: 20,
    scale: 2,
  })
  montoPago!: string | null;


  @Column("int", { name: "id_tienda", nullable: true })
  idTienda!: number | null;

  @Column("int", { name: "id_metodo_pago", nullable: true })
  idMetodoPago!: number | null;

  @Column("varchar", { name: "num_comprobante", nullable: true, length: 24 })
  numComprobante!: string | null;

  @ManyToOne(() => MetodoPago, (metodoPago) => metodoPago.pagoSeparados, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([
    { name: "id_metodo_pago", referencedColumnName: "idMetodoPago" },
  ])
  metodoPago!: MetodoPago;

  @ManyToOne(() => Tienda, (tienda) => tienda.pagoSeparados, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_tienda", referencedColumnName: "idTienda" }])
  tienda!: Tienda;

  @ManyToOne(() => Separado, (separado) => separado.pagoSeparados, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_separado", referencedColumnName: "idSeparado" }])
  separado!: Separado;

  @ManyToOne(() => User, (user) => user.pagoSeparados, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "idUsuario" }])
  user!: User;
}
