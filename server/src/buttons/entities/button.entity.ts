import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('button')
export class ButtonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true, type: 'json' })
  buttons: any;
}
