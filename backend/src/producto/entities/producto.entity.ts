import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Marca } from "../../marca/entities/marca.entity";
import { ProductoTienda } from "../../producto-tienda/entities/producto-tienda.entity";
import { DetalleSeparado } from "../../detalle-separado/entities/detalle-separado.entity";
import { PedidoDetalle } from "../../pedido-detalle/entities/pedido-detalle.entity";

import { Garantia } from "../../garantia/entities/garantia.entity";
import { ProductoTipoProducto } from "../../producto-tipo-producto/entities/producto-tipo-producto.entity";
import { ProductoColor } from "../../producto-color/entities/producto-color.entity";
import { CarritoItem } from "../../carrito/entities/carrito-item.entity"; 
import { FavoritosItem } from "../../favoritos/entities/favoritos-item.entity";

@Index("fk_producto_marca_2", ["idMarca"], {})
@Entity("producto", { schema: "sarcos_db" })
export class Producto {
  @PrimaryGeneratedColumn({ type: "int", name: "id_producto" })
  idProducto!: number;

  @Column("varchar", { name: "nombre", length: 255 })
  nombre!: string ;
  
  @Column("varchar", { name: "modelo", length: 255 })
  modelo!: string ;

  @Column("int", { name: "id_marca" })
  idMarca!: number;

  @Column("varchar", {
    name: "descripcion",
    nullable: true,
    comment: " ",
    length: 1024,
  })
  descripcion!: string | null;

  @Column("int", { name: "stock", default:0, nullable: false })
  stock!: number;

  @Column("varchar", { name: "imagen", nullable: true, length: 255 })
  imagen!: string | null;

  @Column("decimal", {
    name: "precio_tope",
    nullable: true,
    precision: 20,
    scale: 2,
  })
  precioTope!: string | null;

  @Column("decimal", {
    name: "precio_venta",
    nullable: true,
    precision: 20,
    scale: 2,
  })
  precioVenta!: string | null;

  @Column("tinyint", { name: "estado", nullable: true, default: 1, transformer: {
    to: (value: boolean | null): number | null => value === null ? null : value ? 1 : 0,
    from: (value: number | null): boolean | null => value === null ? null : Boolean(value),},})
  estado!: boolean;

  @Column("date", { name: "fecha_ingreso", nullable: true })
  fechaIngreso!: string | null;

  @Column("int", { name: "garantia_fabrica", nullable: true })
  garantiaFabrica!: number | null;

  @Column("int", { name: "descuento", nullable: true })
  descuento!: number | null;



  @OneToOne(() => Garantia, (garantia) => garantia.producto)
  garantia!: Garantia;

  @OneToMany(() => CarritoItem, (carritoItem) => carritoItem.producto)
  carritoItems!: CarritoItem[];

  // Relación con Favorito
  @OneToMany(() => FavoritosItem, (favoritosItem) => favoritosItem.producto)
  favoritosItems!: FavoritosItem[];

  @OneToMany(() => ProductoTipoProducto, (productoTipoProducto) => productoTipoProducto.producto,
    { cascade: true }
  )
  productoTipoProductos!: ProductoTipoProducto[];  

  @OneToMany(() => ProductoColor, (productoColor) => productoColor.producto)
  productoColores!: ProductoColor[];

  @OneToMany(() => ProductoTienda, (productoTienda) => productoTienda.producto)
  productoTiendas!: ProductoTienda[];

  @OneToMany(() => PedidoDetalle, (pedidoDetalle) => pedidoDetalle.producto)
  pedidoDetalles!: PedidoDetalle[];

  @OneToMany(() => DetalleSeparado, (detalleSeparado) => detalleSeparado.producto)
  detalleSeparados!: DetalleSeparado[];

  @ManyToOne(() => Marca, (marca) => marca.productos, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "id_marca", referencedColumnName: "idMarca" }])
  marca!: Marca;
}
