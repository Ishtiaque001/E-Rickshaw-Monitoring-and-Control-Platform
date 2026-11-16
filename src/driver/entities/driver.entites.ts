
import { Entity, PrimaryGeneratedColumn, Column,CreateDateColumn} from 'typeorm';

@Entity('drivers')
export class Driver {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 50})
    name:string;

    @Column ({length:14 })
    phone:string;
    @Column({type : 'date' })
    dateOfBirth:string;
    @Column({ length: 105 })
    address: string;

    @CreateDateColumn()
    createdAt: Date;
}

