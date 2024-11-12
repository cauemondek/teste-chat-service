import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../model/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Chat } from '../model/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Chat])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
