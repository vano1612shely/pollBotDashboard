import { ClientEntity } from '../../client/entities/client.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('city')
export class CityEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => ClientEntity, (client) => client.city)
  clients: ClientEntity[];
}
