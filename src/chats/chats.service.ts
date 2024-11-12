import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from '../model/chat.entity';
import { Repository } from 'typeorm';
import { User } from '../model/user.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat)
    private chatsRepository: Repository<Chat>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(chat: Chat): Promise<Chat> {
    return this.chatsRepository.save(chat);
  }

  async findAll(): Promise<Chat[]> {
    return this.chatsRepository.find({ relations: ['users'] });
  }

  async findOne(id: number): Promise<Chat> {
    return this.chatsRepository.findOne({ where: { id }, relations: ['users'] });
  }

  async update(id: number, chat: Chat): Promise<Chat> {
    await this.chatsRepository.update(id, chat);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    for await (const user of (await this.chatsRepository.findOne({ where: { id: id }, relations: ['users'] })).users) {
      user.chatsCount--;

      await this.userRepository.save(user);
    }

    await this.chatsRepository.delete(id);
  }

  async addUserToChat(chatId: number, userId: number): Promise<Chat> {
    const chat = await this.chatsRepository.findOne({ where: { id: chatId }, relations: ['users'] });
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!chat || !user) {
      throw new Error('Chat or User not found');
    }

    chat.users.push(user);
    chat.usersCount++;
    user.chatsCount++;

    return this.chatsRepository.save(chat);
  }
}
