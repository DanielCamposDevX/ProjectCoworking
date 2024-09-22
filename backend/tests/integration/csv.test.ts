import { faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';
import supertest from 'supertest';
import app, { close, init } from '../../src/app';
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

describe('POST /api/projetos/many', () => {
   it('Deve responder com 422 quando estiver campos faltando', async () => {
      const user = await createFakeUser({
         email: faker.internet.email(),
         senha: '123456',
      });
      const session = await createFakeSession(user.id);

      const filePath = path.join(__dirname, 'testFiles', 'invalid.csv');
      const fileBuffer = fs.readFileSync(filePath);

      const response = await server
         .post('/api/projetos/many')
         .set('Authorization', `Bearer ${session}`)
         .attach('file', fileBuffer, {
            filename: 'invalid.csv',
            contentType: 'text/csv',
         });

      expect(response.status).toBe(422);
   });
   it('Deve responder com 201 quando o arquivo CSV for processado com sucesso', async () => {
      const user = await createFakeUser({
         email: faker.internet.email(),
         senha: '123456',
      });
      const session = await createFakeSession(user.id);

      const filePath = path.join(__dirname, 'testFiles', 'valid.csv');
      const fileBuffer = fs.readFileSync(filePath);

      const response = await server
         .post('/api/projetos/many')
         .set('Authorization', `Bearer ${session}`)
         .attach('file', fileBuffer, {
            filename: 'valid.csv',
            contentType: 'text/csv',
         });

      expect(response.status).toBe(200);
   });
});
