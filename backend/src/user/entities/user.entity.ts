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
import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, OneToMany, ManyToOne, JoinColumn} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn({ name: 'id_user' })
  idUser!: number;

  @Column( "varchar", {name: 'nombre', nullable: true, length: 255 } )
  name!: string;
  
  @Column("int",{name: 'id_documento', nullable: true} )
  idDocument!: number | null;

  @Column( "varchar", { name: 'numero_documento', nullable: true, length: 255 } )
  documentNumber!: string | null;

  @Column("int", { name: 'id_cargo', nullable: true })
  idRole!: number | null;

  @Column("varchar", { name: "direccion", nullable: true, length: 255, })
  address!: string | null;

  @Column("varchar", { name: "telefono", nullable: true, length: 255 })
  phone!: string | null;

  @Column( "varchar", {unique: true, length: 255 })
  email!: string | null;

  @Column("varchar", { length: 255 })
  login!: string;

  @Column( "varchar", {name: 'clave', length: 255 })
  password!: string;

  @Column("varchar", { name: "imagen", nullable: true, length: 255 })
  image!: string | null;

  @Column("varchar", { name: "fondo", nullable: true, length: 255 })
  background!: string | null;

  @Column("tinyint", { name: "condicion", nullable: true })
  condition!: number | null;

  @Column("int", { name: "id_tienda", nullable: true })
  idStore!: number | null;

  @Column("varchar", {name: 'rol', length: 255})
  role!: string;
    @OneToMany(() => UsuarioRol, (userRole) => userRole.user)
    userRoles!: UsuarioRol[];

  @DeleteDateColumn( {name: 'deleted_at'})
  deletedAt!: Date;  



  @OneToMany(() => Agenda, (agenda) => agenda.user)
  agendas!: Agenda[];

  @OneToMany(() => Credito, (credito) => credito.idUsuario2)
  creditos!: Credito[];
  
  @OneToMany(() => Egreso, (egreso) => egreso.user)
  egresos!: Egreso[];

  @OneToMany(() => Garantia, (garantia) => garantia.idUsuario2)
  garantias!: Garantia[];

  @OneToMany(() => Ingreso, (ingreso) => ingreso.user)
  ingresos!: Ingreso[];

  @OneToMany(() => PagoSeparado, (pagoSeparado) => pagoSeparado.idUsuario2)
  pagoSeparados!: PagoSeparado[];

  @OneToMany(() => PagoCredito, (pagoCredito) => pagoCredito.idUsuario2)
  pagoCreditos!: PagoCredito[];
    
  @OneToMany(() => Separado, (separado) => separado.idUsuario2)
  separados!: Separado[];

  @OneToMany(() => Servicio, (servicio) => servicio.idUsuario2)
  servicios!: Servicio[];

  @OneToMany(() => TicketCredito, (ticketCredito) => ticketCredito.idUsuario2)
  ticketCreditos!: TicketCredito[];

  @OneToMany(() => Venta, (venta) => venta.idUsuario2)
  ventas!: Venta[];



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
}