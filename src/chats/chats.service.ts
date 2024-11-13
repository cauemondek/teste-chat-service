import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from '../model/chat.entity';
import { Repository } from 'typeorm';
import { User } from '../model/user.entity';
import { Logger } from '@nestjs/common';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat)
    private chatsRepository: Repository<Chat>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(chat: Chat): Promise<Chat> {
    const response: Chat = await this.chatsRepository.save(chat).catch(error => {
      throw new HttpException(`It was not possible to Create a new chat: ${error}`, 500);
    });

    return response;
  }

  async findAll(): Promise<Chat[]> {
    const response: Chat[] = await this.chatsRepository.find({ relations: ['users'] });

    if (response.length < 1) {
      Logger.warn('No stored chat found');
    }

    return response;
  }

  async findOne(id: number): Promise<Chat> {
    const response: Chat = await this.chatsRepository.findOne({ where: { id }, relations: ['users'] });

    if (!response) {
      throw new NotFoundException('Chat not found');
    }

    return response;
  }

  async update(id: number, chat: Chat): Promise<Chat> {
    const response: Chat = await this.findOne(id);

    if (!response) {
      throw new NotFoundException('Chat not found for update');
    }

    await this.chatsRepository.update(id, chat).catch(error => {
      throw new HttpException(`Error when Update Chat: ${error}`, 500);
    });

    return response;
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id).catch(error => {
      throw new NotFoundException(`Chat not found for remove: ${error}`);
    });

    for await (const user of (await this.chatsRepository.findOne({ where: { id: id }, relations: ['users'] })).users) {
      user.chatsCount--;

      await this.userRepository.save(user);
    }

    await this.chatsRepository.delete(id).catch(error => {
      throw new HttpException(`Error when Remove Chat: ${error}`, 500);
    });
  }

  async addUserToChat(chatId: number, userId: number): Promise<Chat> {
    const chat: Chat = await this.chatsRepository.findOne({ where: { id: chatId }, relations: ['users'] });
    const user: User = await this.userRepository.findOne({ where: { id: userId } });

    if (!chat || !user) {
      throw new NotFoundException('Chat or User not found');
    }

    chat.users.push(user);
    chat.usersCount++;
    user.chatsCount++;

    const response = await this.chatsRepository.save(chat);

    if (!response) {
      throw new HttpException('Error when Save the Chat', 500);
    }

    return response;
  }
}
