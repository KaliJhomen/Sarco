import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Producto } from "src/producto/entities/producto.entity";
import { Separado } from "../../separado/entities/separado.entity";

@Index("fk_detalle_separado_producto_2", ["idProducto"], {})
@Index("id_separado", ["idSeparado"], {})
@Entity("detalle_separado", { schema: "sarcos_db" })
export class DetalleSeparado {
  @PrimaryGeneratedColumn({ type: "int", name: "id_detalle_separado" })
  idDetalleSeparado!: number;

  @Column("int", { name: "id_separado", nullable: true })
  idSeparado!: number | null;

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

  @Column("tinyint", { name: "despachado", nullable: true })
  despachado!: number | null;

  @ManyToOne(() => Producto, (producto) => producto.detalleSeparados, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_producto", referencedColumnName: "idProducto" }])
  producto!: Producto;

  @ManyToOne(() => Separado, (separado) => separado.detalleSeparados, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_separado", referencedColumnName: "idSeparado" }])
  separado!: Separado;
}
