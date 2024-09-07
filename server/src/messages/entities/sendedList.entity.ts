import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {MessageEntity} from "./message.entity";
import {ClientEntity} from "../../client/entities/client.entity";

@Entity('ignoreList')
export class SendedListEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message_id: number;
  @ManyToOne(() => MessageEntity, (res) => res.sended, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'message_id' })
  message: MessageEntity;
  @Column()
  client_id: number;
  @ManyToOne(() => ClientEntity, (res) => res.sended, { onDelete: "CASCADE"})
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type:"boolean", default: false})
  activity: boolean
}