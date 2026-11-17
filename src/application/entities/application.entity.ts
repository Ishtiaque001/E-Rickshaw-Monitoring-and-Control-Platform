
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  RelationId,
} from 'typeorm';

import type { Relation } from 'typeorm';
import { ApplicationStatus } from '../enums/application-status.enum.js';
import { Driver } from '../../driver/entities/driver.entites.js';
import { Rickshaw } from '../../rickshaws/rickshaw.entity.js';
import { User } from '../../users/entities/user.entity.js';

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  // Driver foreign key
  @ManyToOne(() => Driver, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'driverId' })
  driver: Relation<Driver>;

  @RelationId((application: Application) => application.driver)
  driverId: number;

  // Rickshaw foreign key
  @ManyToOne(() => Rickshaw, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'rickshawId' })
  rickshaw: Relation<Rickshaw>;

  @RelationId((application: Application) => application.rickshaw)
  rickshawId: number;

  // User who submitted the application
  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'submittedBy' })
  submittedBy: Relation<User>;

  @RelationId((application: Application) => application.submittedBy)
  submittedById: string;

  // Admin who reviewed the application
  @ManyToOne(() => User, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'reviewedBy' })
  reviewedBy: Relation<User> | null;
  @RelationId((application: Application) => application.reviewedBy)
  reviewedById: string | null;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  rejectionReason: string | null;

  @CreateDateColumn()
  submittedAt: Date;
}
