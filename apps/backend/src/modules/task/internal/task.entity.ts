import { TaskPriority, TaskStatus } from "@task-forge/shared/types";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "tasks" })
@Index(["userId"])
export class TaskEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column({ type: "bigint", name: "user_id" })
  userId: number;

  @Column({ type: "character varying", length: 250 })
  title: string;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @Column({ type: "character varying", length: 20, default: TaskStatus.PENDING })
  status: TaskStatus;

  @Column({ type: "character varying", length: 20, default: TaskPriority.MEDIUM })
  priority: TaskPriority;

  @Column({ type: "timestamptz", name: "start_date", nullable: true })
  startDate: Date | null;

  @Column({ type: "timestamptz", name: "due_date", nullable: true })
  dueDate: Date | null;

  @Column({ type: "bigint", array: true, name: "sub_tasks", default: [] })
  subTasks: number[];

  @Column({ type: "bigint", array: true, name: "assigned_members", default: [] })
  assignedMembers: number[];

  @Column({ type: "text", array: true, default: [] })
  attachments: string[];

  @CreateDateColumn({
    type: "timestamptz",
    name: "created_at",
    nullable: false,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamptz",
    name: "updated_at",
    nullable: false,
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;
}
