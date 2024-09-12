import { faker } from '@faker-js/faker';
import app, { close, init } from 'app';
import 'dotenv/config';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import supertest from 'supertest';
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

describe('updatePermissions', () => {
   it('Should respond with 401 when token is invalid', async () => {
      const response = await server
         .put('/api/permissions/:projectId/:userId')
         .set('Authorization', 'Bearer invalidtoken');
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      expect(response.text).toBe('Token inválido, faça login novamente!');
   });

   it('Should respond with 422 when body is not valid', async () => {
      const user = await createFakeUser({
         email: faker.internet.email(),
         senha: '123456',
      });
      const session = await createFakeSession(user.id);

      const project = await createFakeProject({}, user.id);
      const response = await server
         .put(`/api/permissions/${project.id}/${user.id}`)
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
         .put('/api/permissions/2/1')
         .set('Authorization', `Bearer ${token}`)
         .send({
            create: true,
            update: true,
            delete: true,
         });
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      expect(response.text).toBe('Token inválido! Faça login novamente.');
   });

   it('Should respond with 200 when updated', async () => {
      const user = await createFakeUser({
         email: faker.internet.email(),
         senha: '123456',
      });
      const session = await createFakeSession(user.id);

      const project = await createFakeProject({}, user.id);
      await insertUserInProject(project.id, user.id);
      const response = await server
         .put(`/api/permissions/${project.id}/${user.id}`)
         .set('Authorization', `Bearer ${session}`)
         .send({
            create: true,
            update: true,
            delete: true,
         });

      expect(response.status).toBe(httpStatus.OK);
   });
});
