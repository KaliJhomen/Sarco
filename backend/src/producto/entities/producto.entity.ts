import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Marca } from "../../marca/entities/marca.entity";
import { ProductoTienda } from "../../producto-tienda/entities/producto-tienda.entity";
import { ProductoTipoProducto } from "../../producto-tipo-producto/entities/producto-tipo-producto.entity";
import { ProductoColor } from "../../producto-color/entities/producto-color.entity";
import { CarritoItem } from "../../carrito/entities/carrito-item.entity"; 
import { FavoritosItem } from "../../favoritos/entities/favoritos-item.entity";

@Index("fk_producto_marca_2", ["idMarca"], {})
@Entity("producto", { schema: "sarcos_db" })
export class Producto {
  @PrimaryGeneratedColumn({ type: "int", name: "id_producto" })
  idProducto!: number;

  @Column("varchar", { name: "nombre", length: 25 })
  nombre!: string ;
  
  @Column("varchar", { name: "modelo", length: 25 })
  modelo!: string ;

  @Column("int", { name: "id_marca" })
  idMarca!: number;

  @Column("varchar", {
    name: "descripcion",
    nullable: true,
    comment: " ",
    length: 1000,
  })
  descripcion!: string | null;

  @Column("int", { name: "stock", default:0, nullable: false })
  stock!: number;

  @Column("varchar", { name: "imagen", nullable: true, length: 255 })
  imagen!: string | null;

  @Column("decimal", {
    name: "precio_tope",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  precioTope!: string | null;

  @Column("decimal", {
    name: "precio_venta",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  precioVenta!: string | null;

  @Column("tinyint", { name: "estado", nullable: true, default: null, transformer: {
    to: (value: boolean | null): number | null => value === null ? null : value ? 1 : 0,
    from: (value: number | null): boolean | null => value === null ? null : Boolean(value),},})
  estado!: boolean;

  @Column("date", { name: "fecha_ingreso", nullable: true })
  fechaIngreso!: string | null;

  @Column("varchar", { name: "garantia_fabrica", nullable: true, length: 10 })
  garantiaFabrica!: string | null;

  @Column("int", { name: "descuento", nullable: true })
  descuento!: number | null;



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

  @ManyToOne(() => Marca, (marca) => marca.productos, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "id_marca", referencedColumnName: "idMarca" }])
  marca!: Marca;
}
