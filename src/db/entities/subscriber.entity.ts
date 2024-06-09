import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Subscriber {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  dateCreated: Date;
}
