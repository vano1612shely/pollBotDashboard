import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClientEntity } from '../../client/entities/client.entity';
import { ResultsEntity } from './results.entity';

export enum MessageType {
  StartA = 'StartForAuthorized',
  StartU = 'StartForUnauthorized',
  MessageForAll = 'MessageForAll',
  MessageForA = 'MessageForAuthorized',
  MessageForU = 'MessageForUnauthorized',
}
@Entity('message')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column()
  message: string;

  @Column({ nullable: true })
  thx_message: string;

  @Column({ default: false })
  is_send: boolean;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'json', nullable: true })
  buttons: any;

  @Column({ type: 'enum', enum: MessageType })
  type: MessageType;

  @OneToMany(() => ResultsEntity, (res) => res.message)
  results: ResultsEntity[];

  @Column({ default: false })
  archived: boolean;
}
