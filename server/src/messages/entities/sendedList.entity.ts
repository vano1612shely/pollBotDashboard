import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {MessageEntity} from "./message.entity";
import {ClientEntity} from "../../client/entities/client.entity";

@Entity('message')
export class SendedListEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  message_id: number;
  @ManyToOne(() => MessageEntity, (res) => res.sended, {nullable: true, onDelete: 'CASCADE'})
  @JoinColumn({ name: 'message_id' })
  message: MessageEntity;
  @Column({nullable: true})
  client_id: number;
  @ManyToOne(() => ClientEntity, (res) => res.sended, {nullable: true, onDelete: "CASCADE"})
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;

  @CreateDateColumn()
  created_at: Date;

  @Column({nullable: true, type:"boolean", default: false})
  activity: boolean
}