import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Index("id_credito", ["idCredito"], {})
@Entity("plan_pago", { schema: "sarcos_db" })
export class PlanPago {
  @PrimaryGeneratedColumn({ type: "int", name: "id_plan_pago" })
  idPlanPago!: number;

  @Column("int", { name: "id_credito", nullable: true })
  idCredito!: number | null;

  @Column("date", { name: "fecha_programada", nullable: true })
  fechaProgramada!: string | null;

  @Column("int", { name: "num_cuota", nullable: true })
  numCuota!: number | null;

  @Column("decimal", {
    name: "monto_cuota",
    nullable: true,
    precision: 20,
    scale: 2,
  })
  montoCuota!: string | null;

  @Column("varchar", { name: "estado", nullable: true, length: 50 })
  estado!: string | null;
}
