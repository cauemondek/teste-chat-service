import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ChatsService } from './chats.service';
import { Chat } from '../model/chat.entity';
import { AppModule } from '../app.module';

describe('ChatsController', () => {
  let app: INestApplication;

  const mockChatsService = {
    create: jest.fn((chat: Chat) => Promise.resolve({ id: 1, ...chat })),
    addUserToChat: jest.fn((chatId: number, userId: number) => Promise.resolve({ chatId, userId })),
    findAll: jest.fn(() => Promise.resolve([{ id: 1, name: 'Chat Geral' }])),
    findOne: jest.fn((id: number) => Promise.resolve({ id, name: 'Chat Geral' })),
    update: jest.fn((id: number, chat: Chat) => Promise.resolve({ id, ...chat })),
    remove: jest.fn((id: number) => Promise.resolve({ id })),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ChatsService)
      .useValue(mockChatsService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/chats (POST)', () => {
    const chat: object = { name: 'Chat Geral' };
    return request(app.getHttpServer())
      .post('/chats')
      .send(chat)
      .expect(201)
      .expect({ id: 1, ...chat });
  });

  it('/chats/:chatId/users/:userId (POST)', () => {
    const chatId = '1';
    const userId = '2';
    return request(app.getHttpServer()).post(`/chats/${chatId}/users/${userId}`).expect(201).expect({ chatId, userId });
  });

  it('/chats (GET)', () => {
    return request(app.getHttpServer())
      .get('/chats')
      .expect(200)
      .expect([{ id: 1, name: 'Chat Geral' }]);
  });

  it('/chats/:id (GET)', () => {
    const id = 1;
    return request(app.getHttpServer()).get(`/chats/${id}`).expect(200).expect({ id, name: 'Chat Geral' });
  });

  it('/chats/:id (PUT)', () => {
    const id = 1;
    const chat: object = { id: 1, name: 'Chat Atualizado' };
    return request(app.getHttpServer())
      .put(`/chats/${id}`)
      .send(chat)
      .expect(200)
      .expect({ id: 1, ...chat });
  });

  it('/chats/:id (DELETE)', () => {
    const id = 1;
    return request(app.getHttpServer()).delete(`/chats/${id}`).expect(200).expect({ id });
  });
});
