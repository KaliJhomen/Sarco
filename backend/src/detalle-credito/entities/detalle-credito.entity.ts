import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Producto } from "src/producto/entities/producto.entity";
import { Credito } from "../../credito/entities/credito.entity";

@Index("fk_detalle_credito_credito_1", ["idCredito"], {})
@Index("fk_detalle_credito_producto_2", ["idProducto"], {})
@Entity("detalle_credito", { schema: "sarcos_db" })
export class DetalleCredito {
  @PrimaryGeneratedColumn({ type: "int", name: "id_detalle_credito" })
  idDetalleCredito!: number;

  @Column("int", { name: "id_credito", nullable: true })
  idCredito!: number | null;

  @Column("int", { name: "id_producto", nullable: true })
  idProducto!: number | null;

  @Column("int", { name: "cantidad", nullable: true })
  cantidad!: number | null;

  @Column("varchar", { name: "serie", nullable: true, length: 255 })
  serie!: string | null;

  @Column("decimal", {
    name: "descuento",
    nullable: true,
    precision: 20,
    scale: 2,
  })
  descuento!: string | null;

  @Column("decimal", {
    name: "monto_total",
    nullable: true,
    precision: 20,
    scale: 2,
  })
  montoTotal!: string | null;

  @ManyToOne(() => Producto, (producto) => producto.detalleCreditos, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_producto", referencedColumnName: "idProducto" }])
  producto!: Producto;

  @ManyToOne(() => Credito, (credito) => credito.detalleCreditos, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_credito", referencedColumnName: "idCredito" }])
  credito!: Credito;
}
