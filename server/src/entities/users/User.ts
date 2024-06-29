import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { BotEntity } from '../../bots/entities/bot.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  login: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  bot_id: number;
  @OneToOne(() => BotEntity, (bot) => bot.user, { nullable: true })
  @JoinColumn({ name: 'bot_id' })
  bot: BotEntity;
}
