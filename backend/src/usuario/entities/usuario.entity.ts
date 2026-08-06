import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Agenda } from "../../agenda/entities/agenda.entity";
import { Credito } from "../../credito/entities/credito.entity";
import { Egreso } from "../../egreso/entities/egreso.entity";
import { Garantia } from "../../garantia/entities/garantia.entity";
import { Ingreso } from "../../ingreso/entities/ingreso.entity";
import { PagoCredito } from "../../pago-credito/entities/pago-credito.entity";
import { PagoSeparado } from "../../pago-separado/entities/pago-separado.entity";
import { Separado } from "../../separado/entities/separado.entity";
import { Servicio } from "../../servicio/entities/servicio.entity";
import { TicketCredito } from "../../ticket-credito/entities/ticket-credito.entity";
import { Cargo } from "../../cargo/entities/cargo.entity";
import { Documento } from "../../documento/entities/documento.entity";
import { Tienda } from "../../tienda/entities/tienda.entity";
import { UsuarioPermiso } from "../../usuario-permiso/entities/usuario-permiso.entity";
import { Venta } from "../../venta/entities/venta.entity";
import { UsuarioRol } from "src/usuario-rol/entities/usuario-rol.entity";

@Index("fk_usuario_cargo_1", ["idCargo"], {})
@Index("fk_usuario_documento_2", ["idDocumento"], {})
@Index("id_tienda", ["idTienda"], {})
@Entity("usuario", { schema: "sarcos_db" })
export class Usuario {
  @PrimaryGeneratedColumn({ name: "id_usuario" })
  idUser!: number;

  @Column("varchar", { name: "nombre", nullable: true, length: 255 })
  name!: string | null;

  @Column("int", { name: "id_documento", nullable: true })
  idDocument!: number | null;

  @Column("varchar", { name: "numero_documento", nullable: true, length: 255 })
  documentNumber!: string | null;

  @Column("varchar", { name: "direccion", nullable: true, length: 255 })
  address!: string | null;

  @Column("varchar", { name: "telefono", nullable: true, length: 255 })
  phone!: string | null;

  @Column("varchar", { unique: true, nullable: true, length: 255 })
  email!: string | null;

  @Column("varchar", { length: 255 })
  login!: string;

  @Column("varchar", { name: "clave", length: 255 })
  password!: string;

  @Column("varchar", { name: "imagen", nullable: true, length: 255 })
  image!: string | null;

  @Column("varchar", { name: "fondo", nullable: true, length: 255 })
  background!: string | null;
/*
  @Column("tinyint", { name: "condicion", nullable: true })
  condition!: number | null;
*/
  @Column("int", { name: "id_tienda", nullable: true })
  idStore!: number | null;

  @Column("int", { name: "id_favoritos", nullable: true })
  idFavoritos!: number | null;

  @Column("int", { name: "id_carrito", nullable: true })
  idCarrito!: number | null;

  @OneToMany(() => Agenda, (agenda) => agenda.idUsuario2)
  agenda!: Agenda[];

  @OneToMany(() => Credito, (credito) => credito.idUsuario2)
  creditos!: Credito[];

  @OneToMany(() => Egreso, (egreso) => egreso.idUsuario2)
  egresos!: Egreso[];

  @OneToMany(() => Garantia, (garantia) => garantia.idUsuario2)
  garantias!: Garantia[];

  @OneToMany(() => Ingreso, (ingreso) => ingreso.idUsuario2)
  ingresos!: Ingreso[];

  @OneToMany(() => PagoCredito, (pagoCredito) => pagoCredito.idUsuario2)
  pagoCreditos!: PagoCredito[];

  @OneToMany(() => PagoSeparado, (pagoSeparado) => pagoSeparado.idUsuario2)
  pagoSeparados!: PagoSeparado[];

  @OneToMany(() => Separado, (separado) => separado.idUsuario2)
  separados!: Separado[];

  @OneToMany(() => Servicio, (servicio) => servicio.idUsuario2)
  servicios!: Servicio[];

  @OneToMany(() => TicketCredito, (ticketCredito) => ticketCredito.idUsuario2)
  ticketCreditos!: TicketCredito[];

  @ManyToOne(() => Cargo, (cargo) => cargo.usuarios, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_cargo", referencedColumnName: "idCargo" }])
  idCargo2!: Cargo;

  @ManyToOne(() => Documento, (documento) => documento.usuarios, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_documento", referencedColumnName: "idDocumento" }])
  idDocumento2!: Documento;

  @ManyToOne(() => Tienda, (tienda) => tienda.usuarios, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_tienda", referencedColumnName: "idTienda" }])
  idTienda2!: Tienda;

  @OneToMany(() => UsuarioPermiso, (usuarioPermiso) => usuarioPermiso.usuario)
  permisos!: UsuarioPermiso[];

  @OneToMany(() => Venta, (venta) => venta.idUsuario2)
  ventas!: Venta[];

  @OneToMany(() => UsuarioRol, (usuarioRol) => usuarioRol.usuario)
  usuarioRoles!: UsuarioRol[];
  roles!: any;
}
