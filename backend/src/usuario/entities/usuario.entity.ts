import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cargo } from "../../cargo/entities/cargo.entity";
import { Documento } from "../../documento/entities/documento.entity";
import { Tienda } from "../../tienda/entities/tienda.entity";
import { Favoritos } from "src/favoritos/entities/favoritos.entity";
import { PagoCredito } from "src/pago-credito/entities/pago-credito.entity";
@Index("fk_usuario_cargo_1", ["idCargo"], {})
@Index("fk_usuario_documento_2", ["idDocumento"], {})
@Index("id_tienda", ["idTienda"], {})
@Entity("usuario", { schema: "sarcos_db" })
export class Usuario {
  @PrimaryGeneratedColumn({ name: "id_usuario" })
  idUsuario!: number;

  @Column("varchar", { length: 255 })
  login!: string;

  @Column("varchar", { unique: true, length: 255 })
  email!: string;

  @Column("varchar", { name: "clave", length: 255 })
  clave!: string;

  @Column("varchar", { name: "nombre", length: 255 })
  nombre!: string;

  @Column("int", { name: "id_documento", nullable: true })
  idDocumento!: number | null;

  @Column("varchar", { name: "numero_documento", nullable: true, length: 255 })
  numeroDocumento!: string | null;

  @Column("varchar", { name: "telefono", nullable: true, length: 255 })
  telefono!: string | null;

  @Column("varchar", { name: "ciudad", nullable: true, length: 255 })
  ciudad!: string | null;

  @Column("varchar", { name: "direccion", nullable: true, length: 255 })
  direccion!: string | null;

  @Column("varchar", { name: "imagen", nullable: true, length: 255 })
  imagen!: string | null;

  @Column("varchar", { name: "fondo", nullable: true, length: 255 })
  fondo!: string | null;

  @Column("int", { name: "id_favoritos", nullable: true })
  idFavoritos!: number | null;

  @Column("int", { name: "id_carrito", nullable: true })
  idCarrito!: number | null;


  @OneToMany(() => Favoritos, (favoritos) => favoritos.usuario)
  favoritos!: Favoritos[];

  /*
  @ManyToOne(() => Cargo, (cargo) => cargo.usuarios, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_cargo", referencedColumnName: "idCargo" }])
  cargo!: Cargo;
*/
  @ManyToOne(() => Documento, (documento) => documento.usuarios, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_documento", referencedColumnName: "idDocumento" }])
  documento!: Documento;

  
/*
  @ManyToOne(() => Tienda, (tienda) => tienda.usuarios, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_tienda", referencedColumnName: "idTienda" }])
  tienda!: Tienda;
*/
}