import { Agenda } from '../../agenda/entities/agenda.entity';
import { Garantia } from '../../garantia/entities/garantia.entity';
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

  @OneToMany(() => Garantia, (garantia) => garantia.user)
  garantias!: Garantia[];

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