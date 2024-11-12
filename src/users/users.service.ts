import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../model/user.entity';
import { Repository } from 'typeorm';
import { Chat } from '../model/chat.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Chat)
    private chatsRepository: Repository<Chat>,
  ) {}

  async create(name: string): Promise<User> {
    const user = this.userRepository.create({ name });
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['chats'] });
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id }, relations: ['chats'] });
  }

  async update(id: number, name: string): Promise<User> {
    await this.userRepository.update(id, { name });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    for await (const chat of (await this.userRepository.findOne({ where: { id: id }, relations: ['chats'] })).chats) {
      chat.usersCount--;

      await this.chatsRepository.save(chat);
    }

    await this.userRepository.delete(id);
  }
}
