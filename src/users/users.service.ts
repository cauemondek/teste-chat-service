import { HttpException, Injectable, Logger, NotFoundException } from '@nestjs/common';
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
    const user: User = this.userRepository.create({ name });

    if (!user) {
      throw new HttpException('It was not possible to Create a new user', 500);
    }

    const response: User = await this.userRepository.save(user).catch(error => {
      throw new HttpException(`It was not possible to Save the new user: ${error}`, 500);
    });

    return response;
  }

  async findAll(): Promise<User[]> {
    const response: User[] = await this.userRepository.find({ relations: ['chats'] });

    if (response.length < 1) {
      Logger.warn('No stored user found');
    }

    return response;
  }

  async findOne(id: number): Promise<User> {
    const response: User = await this.userRepository.findOne({ where: { id }, relations: ['chats'] });

    if (!response) {
      throw new NotFoundException('User not found');
    }

    return response;
  }

  async update(id: number, name: string): Promise<User> {
    const response: User = await this.findOne(id);

    if (!response) {
      throw new NotFoundException('User not found for update');
    }

    await this.userRepository.update(id, { name }).catch(error => {
      throw new HttpException(`Error when Update User: ${error}`, 500);
    });

    return response;
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id).catch(error => {
      throw new NotFoundException(`User not found for remove: ${error}`);
    });

    for await (const chat of (await this.userRepository.findOne({ where: { id: id }, relations: ['chats'] })).chats) {
      chat.usersCount--;

      await this.chatsRepository.save(chat);
    }

    await this.userRepository.delete(id).catch(error => {
      throw new HttpException(`Error when Remove User: ${error}`, 500);
    });
  }
}
