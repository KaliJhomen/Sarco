import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TipoProductoSubCategoria } from "src/tipo-producto-sub-categoria/entities/tipo-producto-sub-categoria.entity";
import { ProductoTipoProducto } from "src/producto-tipo-producto/entities/producto-tipo-producto.entity";

@Entity("tipo_producto", { schema: "sarcos_db" })
export class TipoProducto {
    @PrimaryGeneratedColumn({ type: "int", name: "id_tipo_producto" })
    idTipoProducto!: number;

    @Column("varchar", { name: "nombre", nullable: true, length: 20 })
    nombre!: string;

    @Column("boolean", { name: "estado", default: () => "'0'" })
    estado!: boolean;
    
    @OneToMany(() => TipoProductoSubCategoria, (tipoProductoSubCategoria) => tipoProductoSubCategoria.tipoProducto)
    tipoProductoSubCategorias!: TipoProductoSubCategoria[];
    
    @OneToMany(() => ProductoTipoProducto, (productoTipoProducto) => productoTipoProducto.tipoProducto,
    {cascade:true})
    productoTipoProductos!: ProductoTipoProducto[];  

}