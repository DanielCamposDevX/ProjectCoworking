import { faker } from '@faker-js/faker';
import 'dotenv/config';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import supertest from 'supertest';
import app, { close, init } from '../../src/app';
import { createFakeProject } from '../factories/project.factory';

import { createFakeTask } from '../factories/task.factory';
import { createFakeSession, createFakeUser } from '../factories/user.factory';
import { cleanDb } from '../helpers';

beforeAll(async () => {
   await init();
   await cleanDb();
});

beforeEach(async () => {
   await cleanDb();
});

afterAll(async () => {
   await close();
});

const server = supertest(app);

describe('Get project tasks', () => {
   it('Should respond with 401 when token is invalid', async () => {
      const response = await server
         .get('/api/projetos/2/tarefas')
         .set('Authorization', 'Bearer invalidtoken');
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      expect(response.text).toBe('Token inválido, faça login novamente!');
   });

   it('Should respond with Unauthorized when jwt is valid but not from the user', async () => {
      const token = jwt.sign(
         { id: faker.seed(), token: faker.lorem.sentence() },
         process.env.JWT_KEY as string,
         { expiresIn: '1h' },
      );
      const response = await server
         .get('/api/projetos/2/tarefas')
         .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      expect(response.text).toBe('Token inválido! Faça login novamente.');
   });

   it('Should respond with 200 and return the tasks', async () => {
      const user = await createFakeUser({
         email: faker.internet.email(),
         senha: '123456',
      });
      const session = await createFakeSession(user.id);
      const project = await createFakeProject({}, user.id);
      const response = await server
         .get(`/api/projetos/${project.id}/tarefas`)
         .set('Authorization', `Bearer ${session}`);
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toStrictEqual({ tasks: [], total: 0 });
   });
});

describe('Post task', () => {
   it('Should respond with 401 when token is invalid', async () => {
      const response = await server
         .post('/api/projetos/2/tarefas')
         .set('Authorization', 'Bearer invalidtoken');
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      expect(response.text).toBe('Token inválido, faça login novamente!');
   });

   it('Should respond with 422 when body is invalid', async () => {
      const user = await createFakeUser({
         email: faker.internet.email(),
         senha: '123456',
      });
      const session = await createFakeSession(user.id);
      const response = await server
         .post('/api/projetos/2/tarefas')
         .set('Authorization', `Bearer ${session}`)
         .send({
            invalidBody: faker.lorem.sentence(),
         });
      expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
   });

   it('Should respond with Unauthorized when jwt is valid but not from the user', async () => {
      const token = jwt.sign(
         { id: faker.seed(), token: faker.lorem.sentence() },
         process.env.JWT_KEY as string,
         { expiresIn: '1h' },
      );
      const response = await server
         .post('/api/projetos/2/tarefas')
         .set('Authorization', `Bearer ${token}`)
         .send({
            nome: faker.lorem.sentence({ min: 1, max: 3 }),
            descricao: faker.lorem.sentence({ min: 1, max: 3 }),
            status: 'PENDENTE',
         });
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      expect(response.text).toBe('Token inválido! Faça login novamente.');
   });

   it('Should respond with 201 when created', async () => {
      const user = await createFakeUser({
         email: faker.internet.email(),
         senha: '123456',
      });
      const session = await createFakeSession(user.id);
      const project = await createFakeProject({}, user.id);
      const response = await server
         .post(`/api/projetos/${project.id}/tarefas`)
         .set('Authorization', `Bearer ${session}`)
         .send({
            nome: faker.lorem.sentence({ min: 1, max: 3 }),
            descricao: faker.lorem.sentence({ min: 1, max: 3 }),
            status: 'PENDENTE',
         });
      expect(response.status).toBe(httpStatus.CREATED);
      expect(response.body).toHaveProperty('id');
   });
});

describe('Update tasks', () => {
   it('Should respond with 401 when token is invalid', async () => {
      const response = await server
         .put(`/api/projetos/tarefas/2`)
         .set('Authorization', 'Bearer invalidtoken');
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      expect(response.text).toBe('Token inválido, faça login novamente!');
   });

   it('Should respond with 422 when body is invalid', async () => {
      const user = await createFakeUser({
         email: faker.internet.email(),
         senha: '123456',
      });
      const session = await createFakeSession(user.id);
      const response = await server
         .put(`/api/projetos/tarefas/2`)
         .set('Authorization', `Bearer ${session}`)
         .send({
            invalidBody: faker.lorem.sentence(),
         });
      expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
   });

   it('Should respond with Unauthorized when jwt is valid but not from the user', async () => {
      const token = jwt.sign(
         { id: faker.seed(), token: faker.lorem.sentence() },
         process.env.JWT_KEY as string,
         { expiresIn: '1h' },
      );
      const response = await server
         .put(`/api/projetos/tarefas/2`)
         .set('Authorization', `Bearer ${token}`)
         .send({
            nome: faker.lorem.sentence({ min: 1, max: 3 }),
            descricao: faker.lorem.sentence({ min: 1, max: 3 }),
            status: 'PENDENTE',
         });
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      expect(response.text).toBe('Token inválido! Faça login novamente.');
   });

   it('Should respond with 404 when task not found', async () => {
      const user = await createFakeUser({
         email: faker.internet.email(),
         senha: '123456',
      });
      const session = await createFakeSession(user.id);
      const response = await server
         .put(`/api/projetos/tarefas/${faker.number.int({ min: 0, max: 100 })}`)
         .set('Authorization', `Bearer ${session}`)
         .send({
            nome: faker.lorem.sentence({ min: 1, max: 3 }),
            descricao: faker.lorem.sentence({ min: 1, max: 3 }),
            status: 'PENDENTE',
         });
      expect(response.status).toBe(httpStatus.NOT_FOUND);
   });

   it('Should respond with 200 when updated', async () => {
      const user = await createFakeUser({
         email: faker.internet.email(),
         senha: '123456',
      });
      const session = await createFakeSession(user.id);
      const project = await createFakeProject({}, user.id);
      const task = await createFakeTask(user.id, project.id);
      const response = await server
         .put(`/api/projetos/tarefas/${task.id}`)
         .set('Authorization', `Bearer ${session}`)
         .send({
            nome: faker.lorem.sentence({ min: 1, max: 3 }),
            descricao: faker.lorem.sentence({ min: 1, max: 3 }),
            status: 'PENDENTE',
         });
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toHaveProperty('id');
   });
});

describe('Delete tasks', () => {
   it('Should respond with 401 when token is invalid', async () => {
      const response = await server
         .delete(`/api/projetos/tarefas/2`)
         .set('Authorization', 'Bearer invalidtoken');
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      expect(response.text).toBe('Token inválido, faça login novamente!');
   });

   it('Should respond with Unauthorized when jwt is valid but not from the user', async () => {
      const token = jwt.sign(
         { id: faker.seed(), token: faker.lorem.sentence() },
         process.env.JWT_KEY as string,
         { expiresIn: '1h' },
      );
      const response = await server
         .delete(`/api/projetos/tarefas/2`)
         .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      expect(response.text).toBe('Token inválido! Faça login novamente.');
   });

   it('Should respond with 404 when task not found', async () => {
      const user = await createFakeUser({
         email: faker.internet.email(),
         senha: '123456',
      });
      const session = await createFakeSession(user.id);
      const response = await server
         .delete(
            `/api/projetos/tarefas/${faker.number.int({ min: 0, max: 100 })}`,
         )
         .set('Authorization', `Bearer ${session}`);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
   });
});
