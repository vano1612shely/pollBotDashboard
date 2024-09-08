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
import {SendedListEntity} from "./sendedList.entity";

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

  @Column()
  name: string;

  @Column()
  message: string;

  @Column({nullable:true})
  message_img?: string

  @Column()
  thx_message: string;

  @Column({nullable:true})
  thx_img: string;

  @Column({ default: false })
  is_send: boolean;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'json' })
  buttons: any;

  @Column({ type: 'enum', enum: MessageType})
  type: MessageType;

  @OneToMany(() => ResultsEntity, (res) => res.message)
  results: ResultsEntity[];

  @OneToMany(() => SendedListEntity, (res) => res.message)
  sended: ResultsEntity[];

  @Column({ default: false })
  archived: boolean;
}
