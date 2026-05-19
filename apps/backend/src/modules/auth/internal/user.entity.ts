import { AuthProvider, UserRole } from "@task-forge/shared/types";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "users" })
export class UserEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column({ type: "character varying", length: 150 })
  name: string;

  @Index("idx_users_email", { unique: true })
  @Column({ type: "character varying", length: 255, unique: true })
  email: string;

  @Column({ type: "character varying", length: 255, nullable: true })
  password: string | null;

  @Column({ type: "text", nullable: true })
  image: string | null;

  @Column({ type: "character varying", length: 20, default: UserRole.USER })
  role: UserRole;

  @Column({ type: "character varying", length: 20, default: AuthProvider.CREDENTIALS })
  provider: AuthProvider;

  @CreateDateColumn({
    type: "timestamp",
    name: "created_at",
    nullable: false,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    name: "updated_at",
    nullable: false,
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;
}
