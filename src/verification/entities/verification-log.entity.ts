
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import { License } from '../../licenses/entities/license.entity.js';
import { User } from '../../users/entities/user.entity.js';

@Entity('verification_logs')
export class VerificationLog {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  licenseId: number;

  @Column({ nullable: true })
  verifiedBy: number | null;

  @Column()
  result: string;

  @ManyToOne(
    () => License,
    (license) => license.verificationLogs,
    { nullable: false },
  )
  @JoinColumn({ name: 'licenseId' })
  license: License;

  @ManyToOne(
    () => User,
    { nullable: true },
  )
  @JoinColumn({ name: 'verifiedBy' })
  verifier: User | null;

  @CreateDateColumn()
  verifiedAt: Date;
}
