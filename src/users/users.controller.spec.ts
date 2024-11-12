import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersService } from './users.service';
import { User } from '../model/user.entity';
import { AppModule } from '../app.module';

describe('UsersController', () => {
  let app: INestApplication;

  const mockUsersService = {
    create: jest.fn((name: string) => Promise.resolve({ id: 1, name })),
    findAll: jest.fn(() => Promise.resolve([{ id: 1, name: 'Usuário Teste' }])),
    findOne: jest.fn((id: number) => Promise.resolve({ id, name: 'Usuário Teste' })),
    update: jest.fn((id: number, name: string) => Promise.resolve({ id, name })),
    remove: jest.fn((id: number) => Promise.resolve({ id })),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/users (POST)', () => {
    const user: User = { id: 1, name: 'Usuário Teste' } as User;

    return request(app.getHttpServer())
      .post('/users')
      .send(user)
      .expect(201)
      .expect({ id: 1, ...user });
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect([{ id: 1, name: 'Usuário Teste' }]);
  });

  it('/users/:id (GET)', () => {
    const id = 1;
    return request(app.getHttpServer()).get(`/users/${id}`).expect(200).expect({ id, name: 'Usuário Teste' });
  });

  it('/users/:id (PUT)', () => {
    const id = 1;
    const user: User = { id: 1, name: 'Usuário Atualizado' } as User;

    return request(app.getHttpServer()).put(`/users/${id}`).send(user).expect(200).expect({ id: 1, name: 'Usuário Atualizado' });
  });

  it('/users/:id (DELETE)', () => {
    const id = 1;
    return request(app.getHttpServer()).delete(`/users/${id}`).expect(200).expect({ id });
  });
});
