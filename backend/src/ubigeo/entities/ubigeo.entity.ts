import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";

@Entity("ubigeo", { schema: "sarcos_db" })
export class Ubigeo {
  @PrimaryColumn("char", { name: "codigo", length: 6 })
  codigo!: string;

  @Column("varchar", { name: "departamento", length: 60 })
  departamento!: string;

  @Column("varchar", { name: "provincia", length: 60 })
  provincia!: string;

  @Column("varchar", { name: "distrito", length: 60 })
  distrito!: string;
}

