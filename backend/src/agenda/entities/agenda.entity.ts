import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../../user/entities/user.entity";

@Index("idx_fecha", ["fecha"], {})
@Index("idx_user", ["idUser"], {})
@Index("idx_estado", ["estado"], {})
@Index("idx_fecha_hora", ["fecha", "hora"], {})
@Index("idx_tipo_tarea", ["tipoTarea"], {})
@Entity("agenda", { schema: "sarcos_db" })

export class Agenda {
  @PrimaryGeneratedColumn({ type: "int", name: "id_agenda" })
  idAgenda!: number;

  @Column("int", { name: "id_usuario", nullable: true })
  idUser!: number | null;
  
  @Column("varchar", { name: "titulo", nullable: true, length: 255 })
  title!: string | null;

  @Column("text", { name: "descripcion", nullable: true })
  description!: string | null;

  @Column("varchar", { name: "tipo_tarea", nullable: true, length: 50 })
  taskType!: string | null;

  @Column("int", {name: "estado", nullable: true, width: 1, default: 1})
  state!: number | null;

  @Column("varchar", {name: "color", nullable: true, length: 7, default: "'#007bff'"})
  color!: string | null;
  
  @Column("date", { name: "fecha", nullable: true })
  date!: Date | null;

  @Column("time", { name: "hora", nullable: true })
  hour!: string | null;

  @Column("timestamp", {
    name: "fecha_creacion",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: Date | null;

  @Column("timestamp", {
    name: "fecha_actualizacion",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date | null;

  
  @ManyToOne(() => User, (user) => user.agendas, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "id_user" }])
  user!: User;
}
