import { faker } from '@faker-js/faker';
import 'dotenv/config';
import httpStatus from 'http-status';
import supertest from 'supertest';
import app, { close, init } from '../../src/app';
import { prisma } from '../../src/config/database';
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

describe('logs creation', () => {
   it('Should respond with 201 when created', async () => {
      const user = await createFakeUser({
         email: faker.internet.email(),
         senha: '123456',
      });
      const session = await createFakeSession(user.id);
      const response = await server
         .post('/api/projetos')
         .set('Authorization', `Bearer ${session}`)
         .send({
            nome: faker.person.firstName(),
            descricao: faker.lorem.sentence(),
            status: 'PENDENTE',
            data_inicio: faker.date.recent().toISOString(),
         });
      expect(response.status).toBe(httpStatus.CREATED);
      const createdLog = await prisma.logs.findFirst();
      expect(createdLog).toHaveProperty('id');
   });
   it('Should respond with 201 when updated', async () => {
      const user = await createFakeUser({
         email: faker.internet.email(),
         senha: '123456',
      });
      const session = await createFakeSession(user.id);
      const project = await createFakeProject({}, user.id);
      const response = await server
         .put(`/api/projetos/${project.id}`)
         .set('Authorization', `Bearer ${session}`)
         .send({
            nome: faker.person.firstName(),
            descricao: faker.lorem.sentence(),
            status: 'PENDENTE',
            data_inicio: faker.date.past(),
            data_fim: faker.date.future(),
         });
      expect(response.status).toBe(httpStatus.OK);
      const createdLog = await prisma.logs.findFirst();
      expect(createdLog).toHaveProperty('id');
   });
});
