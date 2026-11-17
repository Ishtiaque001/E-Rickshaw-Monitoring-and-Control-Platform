
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  RelationId,
} from 'typeorm';
import { Application } from '../../application/entities/application.entity.js';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Application, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'applicationId' })
  application: Application;

  @RelationId((document: Document) => document.application)
  applicationId: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  documentType: string;

  @Column({
    type: 'varchar',
    length: 500,
  })
  filePath: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  mimeType: string;

  @CreateDateColumn()
  uploadedAt: Date;
}
