import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { ResultsEntity } from '../../messages/entities/results.entity';
@Entity('client')
export class ClientEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @Column({ unique: true, type: 'bigint' })
  telegram_id: number;

  @Column({ nullable: true })
  custom_name: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ default: false, type: 'boolean' })
  is_activated: boolean;

  @OneToMany(() => ResultsEntity, (res) => res.client)
  results: ResultsEntity[];
}
