import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClientEntity } from '../../client/entities/client.entity';
import { MessageEntity } from './message.entity';

@Entity('result')
export class ResultsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  client_id: number;
  @ManyToOne(() => ClientEntity, (clientEntity) => clientEntity.results, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;

  @CreateDateColumn()
  date: Date;

  @Column()
  message_id: number;
  @ManyToOne(() => MessageEntity, (messageEntity) => messageEntity.results, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'message_id' })
  message: MessageEntity;

  @Column()
  result: string;
}
