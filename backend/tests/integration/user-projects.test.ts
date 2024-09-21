import { faker } from '@faker-js/faker';
import 'dotenv/config';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import supertest from 'supertest';
import app, { close, init } from '../../src/app';
import {
   createFakeProject,
   insertUserInProject,
} from '../factories/project.factory';
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

describe('Get project users', () => {
   it('Should respond with 401 when token is invalid', async () => {
      const response = await server
         .get(`/api/projetos/${faker.number.int()}/usuarios`)
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
         .get(`/api/projetos/${faker.number.int()}/usuarios`)
         .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      expect(response.text).toBe('Token inválido! Faça login novamente.');
   });

   it('Should respond with 200 and return the projects', async () => {
      const user = await createFakeUser({
         email: faker.internet.email(),
         senha: '123456',
      });
      const session = await createFakeSession(user.id);
      const project = await createFakeProject({}, user.id);
      const response = await server
         .get(`/api/projetos/${project.id}/usuarios`)
         .set('Authorization', `Bearer ${session}`);
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toStrictEqual({ users: [], total: 0 });
   });
});

describe('Post project users', () => {
   it('Should respond with 401 when token is invalid', async () => {
      const response = await server
         .post(`/api/projetos/${faker.number.int()}/usuarios`)
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
         .post('/api/projetos')
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
      const user = await createFakeUser({
         email: faker.internet.email(),
         senha: '123456',
      });
      const response = await server
         .post(`/api/projetos/${faker.number.int()}/usuarios`)
         .set('Authorization', `Bearer ${token}`)
         .send({
            usuario_id: user.id,
         });
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      expect(response.text).toBe('Token inválido! Faça login novamente.');
   });

   it('Should respond with 404 when project not found', async () => {
      const user = await createFakeUser({
         email: faker.internet.email(),
         senha: '123456',
      });
      const session = await createFakeSession(user.id);
      const response = await server
         .post(`/api/projetos/${faker.number.int()}/usuarios`)
         .set('Authorization', `Bearer ${session}`)
         .send({
            usuario_id: user.id,
         });
      expect(response.status).toBe(httpStatus.NOT_FOUND);
   });

   it('Should respond with 404 when user not found', async () => {
      const user = await createFakeUser({
         email: faker.internet.email(),
         senha: '123456',
      });
      const session = await createFakeSession(user.id);
      const project = await createFakeProject({}, user.id);
      const response = await server
         .post(`/api/projetos/${project.id}/usuarios`)
         .set('Authorization', `Bearer ${session}`)
         .send({
            usuario_id: faker.number.int(),
         });
      expect(response.status).toBe(httpStatus.NOT_FOUND);
   });

   it('Should respond with 201 and return the user', async () => {
      const user = await createFakeUser({
         email: faker.internet.email(),
         senha: '123456',
      });
      const session = await createFakeSession(user.id);
      const project = await createFakeProject({}, user.id);
      const response = await server
         .post(`/api/projetos/${project.id}/usuarios`)
         .set('Authorization', `Bearer ${session}`)
         .send({
            usuario_id: user.id,
         });
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toHaveProperty('id');
   });
});

describe('Delete project users', () => {
   it('Should respond with 401 when token is invalid', async () => {
      const response = await server
         .delete(
            `/api/projetos/${faker.number.int()}/usuarios/${faker.number.int}`,
         )
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
         .delete(
            `/api/projetos/${faker.number.int()}/usuarios/${faker.number.int}`,
         )
         .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      expect(response.text).toBe('Token inválido! Faça login novamente.');
   });

   it('Should respond with 404 when project not found', async () => {
      const user = await createFakeUser({
         email: faker.internet.email(),
         senha: '123456',
      });
      const session = await createFakeSession(user.id);
      const response = await server
         .delete(`/api/projetos/${faker.number.int()}/usuarios/${user.id}`)
         .set('Authorization', `Bearer ${session}`);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
   });

   it('Should respond with 404 when user not found', async () => {
      const user = await createFakeUser({
         email: faker.internet.email(),
         senha: '123456',
      });
      const session = await createFakeSession(user.id);
      const project = await createFakeProject({}, user.id);
      const response = await server
         .delete(`/api/projetos/${project.id}/usuarios/${faker.number.int()}`)
         .set('Authorization', `Bearer ${session}`);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
   });

   it('Should respond with 204 and delete user from project', async () => {
      const user = await createFakeUser({
         email: faker.internet.email(),
         senha: '123456',
      });
      const session = await createFakeSession(user.id);
      const project = await createFakeProject({}, user.id);
      await insertUserInProject(project.id, user.id);
      const response = await server
         .delete(`/api/projetos/${project.id}/usuarios/${user.id}`)
         .set('Authorization', `Bearer ${session}`);
      expect(response.status).toBe(httpStatus.NO_CONTENT);
   });
});
