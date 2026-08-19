import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { Documento } from "../../documento/entities/documento.entity";
import { EstadoCliente } from "../../estado-cliente/entities/estado-cliente.entity";

import { Favoritos } from "../../favoritos/entities/favoritos.entity";
import { Carrito } from "../../carrito/entities/carrito.entity";


@Index("fk_cliente_documento_1", ["idDocumento"], {})
@Index("fk_cliente_estado_cliente_2", ["idEstadoCliente"], {})
@Entity("cliente", { schema: "sarcos_db" })
export class Cliente {
  @PrimaryGeneratedColumn({ type: "int", name: "id_cliente" })
  idCliente!: number;

  @Column("int", { name: "id_estado_cliente", nullable: true, default:null})
  idEstadoCliente!: number | null;
  
  @Column("varchar", { name: "nombre", nullable: true, length: 255, default: null})
  nombre!: string | null;

  @Column("varchar", { name: "email", nullable: true, length: 255, default: null })
  email!: string | null;

  @Column("varchar", { name: "clave", length: 255, nullable:true })
  clave!: string;

  @Column("int", { name: "id_documento", nullable: true, default: null })
  idDocumento!: number | null;

  @Column("varchar", { name: "numero_documento", nullable: true, length: 255, unique: true })
  numeroDocumento!: string | null;

  @Column("varchar", { name: "telefono", nullable: true, length: 255 })
  telefono!: string | null;
  
  @Column("varchar", { name: "departamento", nullable: true, length: 60, default: null })
  departamento!: string | null;
  
  @Column("varchar", { name: "provincia", nullable: true, length: 60, default: null })
  provincia!: string | null;
  
  @Column("varchar", { name: "distrito", nullable: true, length: 60, default: null })
  distrito!: string | null;
  
  @Column("varchar", { name: "ciudad", nullable: true, length: 255, default: null })
  ciudad!: string | null;

  @Column("varchar", { name: "direccion", nullable: true, length: 255, default: null })
  direccion!: string | null;

  @Column("varchar", { name: "referencia", nullable: true, length: 255, default: null })
  referencia!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true, default: null })
  updatedAt!: Date | null;


  @OneToOne(() => Favoritos, (favoritos) => favoritos.cliente)
  favoritos!: Favoritos;
  @OneToOne(() => Carrito, (carrito) => carrito.cliente)
  carrito!: Carrito;



  @ManyToOne(() => Documento, (documento) => documento.clientes, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_documento", referencedColumnName: "idDocumento" }])
  documento!: Documento;

  @ManyToOne(() => EstadoCliente, (estadoCliente) => estadoCliente.clientes, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_estado_cliente", referencedColumnName: "idEstado" }])
  estadoCliente!: EstadoCliente;
}
