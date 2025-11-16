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

  @Column({
    name: 'chat_id',
    type: 'text',
    nullable: true,
    transformer: {
      to: (value?: string[]) =>
        Array.isArray(value) && value.length ? JSON.stringify(value) : null,
      from: (value?: string | null) => {
        if (!value) return [];
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            return parsed
              .map((id) => `${id}`.trim())
              .filter((id) => id.length > 0);
          }
        } catch (e) {
          // fall through
        }
        if (typeof value === 'string') {
          return value
            .split(',')
            .map((id) => id.trim())
            .filter((id) => id.length > 0);
        }
        return [];
      },
    },
  })
  chat_ids: string[];

  @Column()
  user_id: number;

  @Column({ type: 'enum', enum: BotStatus, default: BotStatus.ACTIVE })
  status: BotStatus;

  @OneToOne(() => UserEntity, (user) => user.bot)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
