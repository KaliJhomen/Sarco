import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Producto } from "src/producto/entities/producto.entity";
import { Venta } from "../../venta/entities/venta.entity";

@Index("fk_detalle_venta_venta_1", ["idVenta"], {})
@Index("fk_detalle_venta_producto_2", ["idProducto"], {})
@Entity("detalle_venta", { schema: "sarcos_db" })
export class DetalleVenta {
  @PrimaryGeneratedColumn({ type: "int", name: "id_detalle_venta" })
  idDetalleVenta!: number;

  @Column("int", { name: "id_venta", nullable: true })
  idVenta!: number | null;

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

  @ManyToOne(() => Producto, (producto) => producto.detalleVentas, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_producto", referencedColumnName: "idProducto" }])
  producto!: Producto;

  @ManyToOne(() => Venta, (venta) => venta.detalleVentas, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_venta", referencedColumnName: "idVenta" }])
  venta!: Venta;
}
