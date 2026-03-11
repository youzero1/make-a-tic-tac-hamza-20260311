import 'reflect-metadata';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type CellValue = 'X' | 'O' | null;
export type GameStatus = 'in_progress' | 'won' | 'draw';

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  board!: string;

  @Column({ type: 'text', nullable: true })
  winner!: string | null;

  @Column({ type: 'text', default: 'in_progress' })
  status!: GameStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
