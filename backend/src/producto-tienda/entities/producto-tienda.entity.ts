import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Producto } from "src/producto/entities/producto.entity";
import { Tienda } from "../../tienda/entities/tienda.entity";

@Index("FK_producto_tienda_producto", ["idProducto"], {})
@Index("FK_producto_tienda_tienda", ["idTienda"], {})
@Entity("producto_tienda", { schema: "sarcos_db" })
export class ProductoTienda {
  @PrimaryGeneratedColumn({ type: "int", name: "id_producto_tienda" })
  idProductoTienda: number;

  @Column("int", { name: "id_producto", nullable: true })
  idProducto: number | null;

  @Column("int", { name: "id_tienda", nullable: true })
  idTienda: number | null;

  @Column("int", { name: "cantidad", nullable: true })
  cantidad: number | null;

  
  @ManyToOne(() => Producto, (producto) => producto.productoTiendas, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_producto", referencedColumnName: "idProducto" }])
  idProducto2: Producto;

  @ManyToOne(() => Tienda, (tienda) => tienda.productoTiendas, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_tienda", referencedColumnName: "idTienda" }])
  idTienda2: Tienda;
}
