import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Comprobante } from "../../comprobante/entities/comprobante.entity";
import { MetodoPago } from "../../metodo-pago/entities/metodo-pago.entity";


import { Usuario } from "../../usuario/entities/usuario.entity";
import { Cliente } from "../../cliente/entities/cliente.entity";

@Index("fk_servicio_usuario_1", ["idUsuario"], {})
@Index("fk_servicio_cliente_2", ["idCliente"], {})
@Index("fk_servicio_comprobante_3", ["idComprobante"], {})
@Index("fk_servicio_metodo_pago_4", ["idMetodoPago"], {})
@Entity("servicio", { schema: "sarcos_db" })
export class Servicio {
  @PrimaryGeneratedColumn({ type: "int", name: "id_servicio" })
  idServicio!: number;

  @Column("int", { name: "id_usuario", nullable: true })
  idUsuario!: number | null;

  @Column("int", { name: "id_cliente", nullable: true })
  idCliente!: number | null;

  @Column("varchar", { name: "nombre", nullable: true, length: 255 })
  nombre!: string | null;

  @Column("varchar", { name: "descripcion", nullable: true, length: 255 })
  descripcion!: string | null;

  @Column("date", { name: "fecha", nullable: true })
  fecha!: string | null;

  @Column("int", { name: "id_comprobante", nullable: true })
  idComprobante!: number | null;

  @Column("int", { name: "id_metodo_pago", nullable: true })
  idMetodoPago!: number | null;

  @Column("decimal", {
    name: "precio",
    nullable: true,
    precision: 20,
    scale: 2,
  })
  precio!: string | null;

  @Column("int", { name: "estado", nullable: true })
  estado!: number | null;

  @Column("varchar", { name: "numero_comprobante", nullable: true, length: 50 })
  numeroComprobante!: string | null;

  @ManyToOne(() => Cliente, (cliente) => cliente.servicios, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_cliente", referencedColumnName: "idCliente" }])
  cliente!: Cliente;

  @ManyToOne(() => Comprobante, (comprobante) => comprobante.servicios, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([
    { name: "id_comprobante", referencedColumnName: "idComprobante" },
  ])
  comprobante!: Comprobante;

  @ManyToOne(() => MetodoPago, (metodoPago) => metodoPago.servicios, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([
    { name: "id_metodo_pago", referencedColumnName: "idMetodoPago" },
  ])
  metodoPago!: MetodoPago;

  @ManyToOne(() => Usuario, (usuario) => usuario.servicios, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "idUsuario" }])
  usuario!: Usuario;
}
