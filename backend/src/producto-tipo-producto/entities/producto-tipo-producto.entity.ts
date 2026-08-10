import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TipoProducto } from "src/tipo-producto/entities/tipo-producto.entity";
import { Producto } from "src/producto/entities/producto.entity";

@Entity("producto_tipo_producto", { schema: "sarcos_db" })
export class ProductoTipoProducto {
  @PrimaryGeneratedColumn({ type: "int", name: "id_producto_tipo_producto" })
  idProductoTipoProducto!: number;

  
  @ManyToOne(() => Producto, producto => producto.productoTipoProductos, { 
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION' 
  })
  @JoinColumn({ name: 'id_producto' })
  producto!: Producto;


  @ManyToOne(() => TipoProducto, tipoProducto => tipoProducto.productoTipoProductos,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn({ name: "id_tipo_producto" })
  tipoProducto!: TipoProducto;
}

