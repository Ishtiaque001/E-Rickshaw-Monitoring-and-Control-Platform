
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

import type { Relation } from 'typeorm';
import { Rickshaw } from '../rickshaws/rickshaw.entity.js';

@Entity('owners')
export class Owner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  address: string;

  @Column()
  identityDocumentReference: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Rickshaw, (rickshaw) => rickshaw.owner)
  rickshaws: Relation<Rickshaw[]>;
}
