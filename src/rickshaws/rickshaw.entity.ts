import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import type { Relation } from 'typeorm';
import { Owner } from '../owners/owner.entity.js';

export enum RickshawStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('rickshaws')
export class Rickshaw {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ownerId: number;

  @ManyToOne(() => Owner, (owner) => owner.rickshaws, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'ownerId' })
  owner: Relation<Owner>;

  @Column({ unique: true })
  registrationNumber: string;

  @Column()
  model: string;

  @Column({ unique: true })
  chassisNumber: string;

  @Column({
    type: 'enum',
    enum: RickshawStatus,
    default: RickshawStatus.ACTIVE,
  })
  status: RickshawStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
