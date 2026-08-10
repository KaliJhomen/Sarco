import { Agenda } from 'src/agenda/entities/agenda.entity';
import { Credito } from 'src/credito/entities/credito.entity';
import { Egreso } from 'src/egreso/entities/egreso.entity';
import { Garantia } from 'src/garantia/entities/garantia.entity';
import { Ingreso } from 'src/ingreso/entities/ingreso.entity';
import { PagoCredito } from 'src/pago-credito/entities/pago-credito.entity';
import { PagoSeparado } from 'src/pago-separado/entities/pago-separado.entity';
import { Separado } from 'src/separado/entities/separado.entity';
import { Servicio } from 'src/servicio/entities/servicio.entity';
import { TicketCredito } from 'src/ticket-credito/entities/ticket-credito.entity';
import { UsuarioRol } from 'src/usuario-rol/entities/usuario-rol.entity';
import { Venta } from 'src/venta/entities/venta.entity';
import { UsuarioPermiso } from 'src/usuario-permiso/entities/usuario-permiso.entity';
import { Cargo } from 'src/cargo/entities/cargo.entity';
import { Documento } from 'src/documento/entities/documento.entity';
import { Tienda } from 'src/tienda/entities/tienda.entity';
import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, OneToMany, ManyToOne, JoinColumn} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn({ name: 'id_user' })
  idUser!: number;

  @Column("varchar", {name: 'nombre', nullable: true, length: 255 })
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
  email!: string | null;

  @Column("varchar", { length: 255 })
  login!: string;

  @Column("varchar", {name: 'clave', length: 255 })
  clave!: string;

  @Column("varchar", { name: "imagen", nullable: true, length: 255 })
  imagen!: string | null;

  @Column("varchar", { name: "fondo", nullable: true, length: 255 })
  fondo!: string | null;

  @Column("tinyint", { name: "condicion", nullable: true })
  condicion!: number | null;

  @Column("int", { name: "id_tienda", nullable: true })
  idTienda!: number | null;

  @Column("varchar", {name: 'rol', length: 255 })
  rol!: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  fechaEliminacion!: Date;  


  
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

  @OneToMany(() => PagoCredito, (pagoCredito) => pagoCredito.user)
  pagoCredito!: PagoCredito[];

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