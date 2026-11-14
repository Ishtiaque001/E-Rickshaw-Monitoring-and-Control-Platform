
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Application } from '../../applications/entities/application.entity';
import { VerificationLog } from '../../verification/entities/verification-log.entity.js';

export enum LicenseStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  CANCELLED = 'CANCELLED',
}

@Entity('licenses')
export class License {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  applicationId: number;

  @Column({ unique: true })
  licenseNumber: string;

  @Column({ unique: true })
  verificationToken: string;

  @Column({ type: 'date' })
  issueDate: string;

  @Column({ type: 'date' })
  expiryDate: string;

  @Column({
    type: 'enum',
    enum: LicenseStatus,
    default: LicenseStatus.ACTIVE,
  })
  status: LicenseStatus;

  @ManyToOne(
    () => Application,
    (application) => application.license,
    { nullable: false },
  )
  @JoinColumn({ name: 'applicationId' })
  application: Application;

  @OneToMany(
    () => VerificationLog,
    (log) => log.license,
  )
  verificationLogs: VerificationLog[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
