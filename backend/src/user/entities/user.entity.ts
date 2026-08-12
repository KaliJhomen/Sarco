import { Agenda } from '../../agenda/entities/agenda.entity';
import { Credito } from '../../credito/entities/credito.entity';
import { Egreso } from '../../egreso/entities/egreso.entity';
import { Garantia } from '../../garantia/entities/garantia.entity';
import { Ingreso } from '../../ingreso/entities/ingreso.entity';
import { PagoCredito } from '../../pago-credito/entities/pago-credito.entity';
import { PagoSeparado } from '../../pago-separado/entities/pago-separado.entity';
import { Separado } from '../../separado/entities/separado.entity';
import { Servicio } from '../../servicio/entities/servicio.entity';
import { TicketCredito } from '../../ticket-credito/entities/ticket-credito.entity';
import { UsuarioRol } from '../../usuario-rol/entities/usuario-rol.entity';
import { Venta } from '../../venta/entities/venta.entity';
import { UsuarioPermiso } from '../../usuario-permiso/entities/usuario-permiso.entity';
import { Cargo } from '../../cargo/entities/cargo.entity';
import { Documento } from '../../documento/entities/documento.entity';
import { Tienda } from '../../tienda/entities/tienda.entity';
import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, OneToMany, ManyToOne, JoinColumn} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn({ name: 'id_user' })
  idUser!: number;

  @Column("varchar", {name: 'nombre', length: 255 })
  nombre!: string;
  
  @Column("int",{name: 'id_documento', nullable: true} )
  idDocumento!: number | null;

  @Column("varchar", { name: 'numero_documento', nullable: true, length: 255 })
  numeroDocumento!: string | null;

  @Column("int", { name: 'id_cargo', nullable: true })
  idCargo!: number | null;

  @Column("varchar", { name: "direccion", nullable: true, length: 255 })
  direccion!: string | null;

  @Column("varchar", { name: "telefono", nullable: true, length: 255 })
  telefono!: string | null;

  @Column("varchar", {unique: true, length: 255 })
  email!: string;

  @Column("varchar", { length: 255 })
  login!: string;

  @Column("varchar", {name: 'clave', length: 255 })
  clave!: string;

  @Column("varchar", { name: "imagen", nullable: true, length: 255 })
  imagen!: string | null;

  @Column("varchar", { name: "fondo", nullable: true, length: 255 })
  fondo!: string | null;

  @Column("tinyint", { name: "condicion", width:1, nullable: true })
  condicion!: boolean | null;

  @Column("int", { name: "id_tienda", nullable: true })
  idTienda!: number | null;

  @Column("varchar", {name: 'rol', length: 255 })
  rol!: string;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt!: Date | null;  


  
  @OneToMany(() => Agenda, (agenda) => agenda.user)
  agendas!: Agenda[];

  @OneToMany(() => Credito, (credito) => credito.user)
  creditos!: Credito[];
  
  @OneToMany(() => Egreso, (egreso) => egreso.user)
  egresos!: Egreso[];

  @OneToMany(() => Garantia, (garantia) => garantia.user)
  garantias!: Garantia[];

  @OneToMany(() => Ingreso, (ingreso) => ingreso.user)
  ingresos!: Ingreso[];

  @OneToMany(() => PagoSeparado, (pagoSeparado) => pagoSeparado.user)
  pagoSeparados!: PagoSeparado[];

  @OneToMany(() => PagoCredito, (pagoCredito) => pagoCredito.user)
  pagoCreditos!: PagoCredito[];
    
  @OneToMany(() => Separado, (separado) => separado.user)
  separados!: Separado[];

  @OneToMany(() => Servicio, (servicio) => servicio.user)
  servicios!: Servicio[];

  @OneToMany(() => TicketCredito, (ticketCredito) => ticketCredito.user)
  ticketCreditos!: TicketCredito[];

  @OneToMany(() => Venta, (venta) => venta.user)
  ventas!: Venta[];

  @OneToMany(() => UsuarioPermiso, (usuarioPermiso) => usuarioPermiso.user)
  usuarioPermisos!: UsuarioPermiso[];

  @OneToMany(() => UsuarioRol, (usuarioRol) => usuarioRol.user)
  usuarioRoles!: UsuarioRol[];

  @ManyToOne(() => Cargo, (cargo) => cargo.users, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_cargo", referencedColumnName: "idCargo" }])
  cargo!: Cargo;

  @ManyToOne(() => Documento, (documento) => documento.users, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_documento", referencedColumnName: "idDocumento" }])
  documento!: Documento;

  @ManyToOne(() => Tienda, (tienda) => tienda.user, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_tienda", referencedColumnName: "idTienda" }])
  tienda!: Tienda;
}