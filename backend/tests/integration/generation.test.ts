import { faker } from '@faker-js/faker';
import 'dotenv/config';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import supertest from 'supertest';
import app, { close, init } from '../../src/app';
import { createFakeProject } from '../factories/project.factory';
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

describe('Get project generation', () => {
   it('Should respond with 401 when token is invalid', async () => {
      const response = await server
         .get('/api/projetos/2/tarefas/generate')
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
         .get('/api/projetos/2/tarefas/generate')
         .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      expect(response.text).toBe('Token inválido! Faça login novamente.');
   });

   it('Should respond with 200 and return the comments', async () => {
      const user = await createFakeUser({
         email: faker.internet.email(),
         senha: '123456',
      });
      const session = await createFakeSession(user.id);
      const project = await createFakeProject(
         {
            nome: 'Projeto Teste',
            descricao: 'Projeto de um CRM de controle ao cliente',
         },
         user.id,
      );
      const response = await server
         .get(`/api/projetos/${project.id}/tarefas/generate`)
         .set('Authorization', `Bearer ${session}`);
      expect(response.status).toBe(httpStatus.OK);
   });
});
