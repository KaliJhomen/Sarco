import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SubCategoria } from "src/sub-categoria/entities/sub-categoria.entity";

@Entity("categoria", { schema: "sarcos_db" })
export class Categoria {
  @PrimaryGeneratedColumn({ type: "int", name: "id_categoria" })
  idCategoria!: number;

  @Column("varchar", { name: "nombre", length: 25 })
  nombre!: string;

  @Column("boolean", { name: "estado", default: '1'})
  estado!: boolean;

  @OneToMany(() => SubCategoria, (subCategoria) => subCategoria.categoria)
  subCategorias!: SubCategoria[];
}
