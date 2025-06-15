import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { ResultsEntity } from '../../messages/entities/results.entity';
import { ChatEntity } from '../../chat/entities/chat.entity';
import { SendedListEntity } from '../../messages/entities/sendedList.entity';
import { CityEntity } from '../../city/entities/city.entity';

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

  @Column({ type: 'boolean', default: false })
  his_block_bot: boolean;

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

  @OneToMany(() => SendedListEntity, (res) => res.client)
  sended: SendedListEntity[];

  @OneToMany(() => ChatEntity, (chat) => chat.client)
  messages: ChatEntity[];

  @Column({ nullable: true })
  last_message_id: number;

  @OneToOne(() => ChatEntity, (chat) => chat.client, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'last_message_id' })
  last_message: ChatEntity;

  @Column({ type: 'boolean', default: false })
  is_blocked?: boolean;

  @Column({ nullable: true })
  city_id: number;

  @ManyToOne(() => CityEntity, (city) => city.clients, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'city_id' })
  city: CityEntity;
}
