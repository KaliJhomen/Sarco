import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";

@Entity("cargo", { schema: "sarcos_db" })
export class Cargo {
  @PrimaryGeneratedColumn({ type: "int", name: "id_cargo" })
  idCargo!: number;

  @Column("varchar", { name: "nombre", nullable: true, length: 255 })
  nombre!: string | null;

  @OneToMany(() => User, (user) => user.cargo)
  users!: User[];
}
