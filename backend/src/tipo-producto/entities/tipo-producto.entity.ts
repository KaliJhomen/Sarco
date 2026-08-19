import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SubCategoriaTipoProducto } from "src/sub-categoria-tipo-producto/entities/sub-categoria-tipo-producto.entity";
import { ProductoTipoProducto } from "src/producto-tipo-producto/entities/producto-tipo-producto.entity";

@Entity("tipo_producto", { schema: "sarcos_db" })
export class TipoProducto {
    @PrimaryGeneratedColumn({ type: "int", name: "id_tipo_producto" })
    idTipoProducto!: number;

    @Column("varchar", { name: "nombre", length: 20 })
    nombre!: string;

    @Column("boolean", { name: "estado", default: '0'})
    estado!: boolean;
    
    @OneToMany(() => SubCategoriaTipoProducto, (subCategoriaTipoProducto) => subCategoriaTipoProducto.tipoProducto)
    subCategoriaTipoProductos!: SubCategoriaTipoProducto[];
    
    @OneToMany(() => ProductoTipoProducto, (productoTipoProducto) => productoTipoProducto.tipoProducto,
    {cascade:true})
    productoTipoProductos!: ProductoTipoProducto[];  

}