import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'packet' })
export class Packet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  time: string;

  @Column({ nullable: true })
  source: string;

  @Column({ nullable: true })
  destination: string;

  @Column({ nullable: true })
  protocol: string;

  @Column({ nullable: true })
  length: string;

  @Column({ nullable: true })
  info: string;

  @Column({ nullable: true })
  isFlagged: boolean;

  @Column({ nullable: true })
  createdAt: Date;
}
