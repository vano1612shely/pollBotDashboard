import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ResultsEntity } from '../../messages/entities/results.entity';
import { ChatEntity } from '../../chat/entities/chat.entity';
@Entity('client')
export class ClientEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

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

  @Column({ nullable: true })
  img_link: string;

  @Column({ default: false, type: 'boolean' })
  is_activated: boolean;

  @OneToMany(() => ResultsEntity, (res) => res.client)
  results: ResultsEntity[];

  @OneToMany(() => ChatEntity, (chat) => chat.client)
  messages: ChatEntity[];

  @Column({ nullable: true })
  last_message_id: number;
  @OneToOne(() => ChatEntity, (chat) => chat.client)
  @JoinColumn({ name: 'last_message_id' })
  last_message: ChatEntity;
}
