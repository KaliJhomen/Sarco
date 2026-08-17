import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Index("id_credito", ["idCredito"], {})
@Entity("penalidades", { schema: "sarcos_db" })
export class Penalidades {
  @PrimaryGeneratedColumn({ type: "int", name: "id_penalidades" })
  idPenalidades!: number;

  @Column("int", { name: "id_credito", nullable: true })
  idCredito!: number | null;

  @Column("date", { name: "fecha", nullable: true })
  fecha!: string | null;

  @Column("int", { name: "monto", nullable: true })
  monto!: number | null;

  @Column("int", { name: "descuento", nullable: true })
  descuento!: number | null;
}
