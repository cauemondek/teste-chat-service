import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Chat } from './chat.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 0 })
  chatsCount: number;

  @ManyToMany(() => Chat, chat => chat.users, { cascade: true })
  @JoinTable()
  chats: Chat[];
}
