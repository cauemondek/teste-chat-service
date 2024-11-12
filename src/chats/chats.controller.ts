import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { Chat } from '../model/chat.entity';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  create(@Body() chat: Chat) {
    return this.chatsService.create(chat);
  }

  @Post(':chatId/users/:userId')
  async addUserToChat(@Param('chatId') chatId: number, @Param('userId') userId: number) {
    return this.chatsService.addUserToChat(chatId, userId);
  }

  @Get()
  findAll() {
    return this.chatsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() chat: Chat) {
    return this.chatsService.update(+id, chat);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatsService.remove(+id);
  }
}
