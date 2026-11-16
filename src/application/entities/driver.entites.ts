
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('drivers')
export class Driver {
    @PrimaryGeneratedColumn()
    id: number;

}

