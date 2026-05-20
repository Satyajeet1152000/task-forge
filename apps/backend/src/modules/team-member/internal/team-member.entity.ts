import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "team_members" })
export class TeamMemberEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Index("idx_team_members_user_id", { unique: true })
  @Column({ type: "bigint", name: "user_id" })
  userId: number;

  @Column({ type: "bigint", array: true, default: [] })
  members: number[];

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
