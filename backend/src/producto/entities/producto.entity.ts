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
import { ProductoTienda } from "src/producto-tienda/entities/producto-tienda.entity";
import { DetalleCredito } from "../../detalle-credito/entities/detalle-credito.entity";
import { DetalleSeparado } from "../../detalle-separado/entities/detalle-separado.entity";
import { DetalleVenta } from "../../detalle-venta/entities/detalle-venta.entity";
import { Garantia } from "../../garantia/entities/garantia.entity";
import { ProductoTipoProducto } from "src/producto-tipo-producto/entities/producto-tipo-producto.entity";
import { ProductoColor } from "src/producto-color/entities/producto-color.entity";
import { CarritoItem } from "../../carrito-item/entities/carrito-item.entity"; 
import { FavoritosItem } from "src/favoritos-item/entities/favoritos-item.entity";

@Index("fk_producto_marca_2", ["idMarca"], {})
@Entity("producto", { schema: "sarcos_db" })
export class Producto {
  @PrimaryGeneratedColumn({ type: "int", name: "id_producto" })
  idProducto: number;

  @Column("varchar", { name: "nombre", length: 255 })
  nombre: string ;
  
  @Column("varchar", { name: "modelo", length: 255 })
  modelo: string ;

  @Column("int", { name: "id_marca" })
  idMarca: number;

  @Column("varchar", {
    name: "descripcion",
    nullable: true,
    comment: " ",
    length: 1024,
  })
  descripcion: string | null;

  @Column("int", { name: "stock", default:0, nullable: false })
  stock: number;

  @Column("varchar", { name: "imagen", nullable: true, length: 255 })
  imagen: string | null;

  @Column("decimal", {
    name: "precio_tope",
    nullable: true,
    precision: 20,
    scale: 2,
  })
  precioTope: number | null;

  @Column("decimal", {
    name: "precio_venta",
    nullable: true,
    precision: 20,
    scale: 2,
  })
  precioVenta: number | null;

  @Column("tinyint", { name: "estado", nullable: true, default: () => "'1'" })
  estado: boolean | null;

  @Column("date", { name: "fecha_ingreso", nullable: true })
  fechaIngreso: string | null;

  @Column("int", { name: "garantia_fabrica", nullable: true })
  garantiaFabrica: number | null;

  @Column("int", { name: "descuento", nullable: true })
  descuento: number | null;

  @OneToMany(
    () => ProductoTipoProducto,
    (productoTipoProducto) => productoTipoProducto.idProducto,
    { cascade: true }
  )
  productoTipoProducto: ProductoTipoProducto[];  

  @ManyToOne(() => Marca, (marca) => marca.productos, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "id_marca", referencedColumnName: "idMarca" }])
  idMarca2: Marca;

  @OneToMany(() => ProductoColor, (productoColor) => productoColor.producto)
  productoColores: ProductoColor[];

  @OneToMany(
    () => ProductoTienda,
    (productoTienda) => productoTienda.idProducto2
  )
  productoTiendas: ProductoTienda[];

  @OneToMany(
    () => DetalleCredito,
    (detalleCredito) => detalleCredito.idProducto2
  )
  detalleCreditos: DetalleCredito[];

  @OneToMany(
    () => DetalleSeparado,
    (detalleSeparado) => detalleSeparado.idProducto2
  )
  detalleSeparados: DetalleSeparado[];

  @OneToMany(() => DetalleVenta, (detalleVenta) => detalleVenta.idProducto2)
  detalleVentas: DetalleVenta[];

  @OneToOne(() => Garantia, (garantia) => garantia.idProducto2)
  garantia: Garantia;

  @OneToMany(() => CarritoItem, (carritoItem) => carritoItem.producto)
  carritoItems: CarritoItem[];

  // Relación con Favorito
  @OneToMany(() => FavoritosItem, (favoritosItem) => favoritosItem.producto)
  favoritosItems: FavoritosItem[];
}
