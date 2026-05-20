import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "member_invites" })
export class MemberInviteEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Index("idx_member_invites_code", { unique: true })
  @Column({ type: "character varying", length: 6 })
  code: string;

  @Index("idx_member_invites_invited_by_id")
  @Column({ type: "bigint", name: "invited_by_id" })
  invitedById: number;

  @Column({ type: "character varying", length: 320, nullable: true })
  email: string | null;

  @Column({ type: "timestamptz", name: "expires_at", nullable: false })
  expiresAt: Date;

  @Column({ type: "integer", name: "max_uses", nullable: true })
  maxUses: number | null;

  @Column({ type: "integer", name: "used_count", default: 0 })
  usedCount: number;

  @Column({ type: "boolean", name: "is_active", default: true })
  isActive: boolean;

  @CreateDateColumn({
    type: "timestamptz",
    name: "created_at",
    nullable: false,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;
}
