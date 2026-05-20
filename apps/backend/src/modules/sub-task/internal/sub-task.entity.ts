import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "sub_tasks" })
@Index(["userId", "taskId"])
export class SubTaskEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Column({ type: "bigint", name: "user_id" })
  userId: number;

  @Column({ type: "bigint", name: "task_id" })
  taskId: number;

  @Column({ type: "character varying", length: 250 })
  title: string;

  @Column({ type: "boolean", name: "is_completed", default: false })
  isCompleted: boolean;

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
