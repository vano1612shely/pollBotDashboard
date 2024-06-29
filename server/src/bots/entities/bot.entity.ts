import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../entities/users/User';
export enum BotStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

@Entity('bot')
export class BotEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  token: string;

  @Column({ nullable: true })
  chat_id: string;

  @Column()
  user_id: number;

  @Column({ type: 'enum', enum: BotStatus, default: BotStatus.ACTIVE })
  status: BotStatus;

  @OneToOne(() => UserEntity, (user) => user.bot)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
