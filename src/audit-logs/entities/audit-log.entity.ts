import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from '../../users/entities/user.entity.js';

export enum AuditAction {
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_ACTIVATED = 'USER_ACTIVATED',
  USER_DEACTIVATED = 'USER_DEACTIVATED',
}

@Entity('audit_logs')
@Index('IDX_audit_logs_created_at', ['createdAt'])
@Index('IDX_audit_logs_actor_created_at', ['actorId', 'createdAt'])
@Index('IDX_audit_logs_target', ['targetType', 'targetId'])
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Store the actor ID without a cascading relation to preserve history.
  @Column({ type: 'uuid', update: false })
  actorId: string;

  // Snapshot of the actor's role when the action occurred.
  @Column({ type: 'enum', enum: UserRole, update: false })
  actorRole: UserRole;

  @Column({ type: 'enum', enum: AuditAction, update: false })
  action: AuditAction;

  @Column({ type: 'varchar', length: 100, update: false })
  targetType: string;

  // A string supports both UUID and numeric identifiers.
  @Column({ type: 'varchar', length: 100, update: false })
  targetId: string;

  @CreateDateColumn({ type: 'timestamptz', update: false })
  createdAt: Date;
}


