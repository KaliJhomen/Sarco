import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import {Carrito } from "../../carrito/entities/carrito.entity"
import { Favoritos } from "../../favoritos/entities/favoritos.entity"
import { Documento } from "../../documento/entities/documento.entity";
import { EstadoCliente } from "../../estado-cliente/entities/estado-cliente.entity";
import { Credito } from "../../credito/entities/credito.entity";
import { Garantia } from "../../garantia/entities/garantia.entity";
import { Separado } from "../../separado/entities/separado.entity";
import { Servicio } from "../../servicio/entities/servicio.entity";
import { Venta } from "../../venta/entities/venta.entity";

@Index("fk_cliente_documento_1", ["idDocumento"], {})
@Index("fk_cliente_estado_cliente_2", ["idEstadoCliente"], {})
@Entity("cliente", { schema: "sarcos_db" })
export class Cliente {
  @PrimaryGeneratedColumn({ type: "int", name: "id_cliente" })
  idCliente!: number;

  @Column("varchar", { name: "nombre", nullable: true, length: 255 })
  nombre!: string | null;

  @Column("varchar", { name: "clave", nullable: true, length: 255 })
  clave!: string | null;

  @Column("int", { name: "id_documento", nullable: true })
  idDocumento!: number | null;

  @Column("varchar", { name: "numero_documento", length: 255, unique: true })
  numeroDocumento!: string | null;

  @Column("varchar", { name: "direccion", nullable: true, length: 255 })
  direccion!: string | null;

  @Column("varchar", { name: "referencia", nullable: true, length: 255 })
  referencia!: string | null;

  @Column("varchar", { name: "direccion_dni", nullable: true, length: 255 })
  direccionDni!: string | null;

  @Column("varchar", { name: "telefono", nullable: true, length: 255 })
  telefono!: string | null;

  @Column("varchar", { name: "email", nullable: true, length: 255 })
  email!: string | null;

  @Column("int", { name: "id_estado_cliente", nullable: true })
  idEstadoCliente!: number | null;
/*
  @OneToMany(() => Favoritos, (favoritos) => favoritos.cliente)
  favoritos!: Favoritos[];
*/
  @OneToMany(() => Credito, (credito) => credito.cliente)
  creditos!: Credito[];

  @OneToMany(() => Credito, (credito) => credito.clienteGarante)
  creditos2!: Credito[];
  
  @OneToMany(() => Garantia, (garantia) => garantia.cliente)
  garantias!: Garantia[];

  @OneToMany(() => Separado, (separado) => separado.cliente)
  separados!: Separado[];

  @OneToMany(() => Servicio, (servicio) => servicio.cliente)
  servicios!: Servicio[];

  @OneToMany(() => Venta, (venta) => venta.cliente)
  ventas!: Venta[];


  @ManyToOne(() => Documento, (documento) => documento.clientes, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_documento", referencedColumnName: "idDocumento" }])
  documento!: Documento;
/*
  @OneToOne(() => Carrito, (carrito) => carrito.cliente)
  carrito!: Carrito;

*/

  @ManyToOne(() => EstadoCliente, (estadoCliente) => estadoCliente.clientes, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_estado_cliente", referencedColumnName: "idEstado" }])
  estadoCliente!: EstadoCliente;
}
