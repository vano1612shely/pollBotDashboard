import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClientEntity } from '../../client/entities/client.entity';
export enum ChatMessageType {
  CLIENT = 'client',
  BOT = 'bot',
}

@Entity('chat')
export class ChatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ChatMessageType })
  type: ChatMessageType;

  @Column()
  message: string;

  @Column({ nullable: true })
  telegram_message_id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'boolean', default: false })
  read: boolean;

  @Column()
  client_id: number;

  @ManyToOne(() => ClientEntity, (client) => client.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;
}
